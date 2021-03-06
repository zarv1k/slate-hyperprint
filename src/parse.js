import Tag from './tag'
import { printString } from './utils'
import {
  applyAnnotationMarks,
  getModelType,
  isAnnotationMark,
} from './annotation'
import {
  isSelectionAtStartOfDocument,
  insertFocusedSelectionTagMarkers,
  isSelectionSet,
} from './selection'
import { Record } from 'immutable'

// All Tag parsers
const PARSERS = {
  value: (value, options) => {
    const children = [
      ...parse(value.document, options),
      ...((value.selection.marks && value.selection.marks.size) ||
      (isSelectionSet(value.selection) &&
        value.selection.isBlurred &&
        !isSelectionAtStartOfDocument(value))
        ? PARSERS.selection(
            value.selection,
            options,
            isSelectionAtStartOfDocument(value)
          )
        : []),
    ]
    return [
      Tag.create({
        name: 'value',
        attributes: getAttributes(value, options),
        children,
      }),
    ]
  },
  document: (document, options) => [
    Tag.create({
      name: 'document',
      attributes: getAttributes(document, options, false),
      children: document.nodes.flatMap(node => parse(node, options)).toArray(),
    }),
  ],
  block: (block, options) => [
    Tag.create({
      name: getTagName(block, options),
      attributes: getAttributes(block, options, canPrintAsShorthand(block)),
      children: isVoid(block, options)
        ? []
        : block.nodes.flatMap(node => parse(node, options)).toArray(),
    }),
  ],
  inline: (inline, options) => [
    Tag.create({
      name: getTagName(inline, options),
      attributes: getAttributes(inline, options, canPrintAsShorthand(inline)),
      children: isVoid(inline, options)
        ? []
        : inline.nodes.flatMap(node => parse(node, options)).toArray(),
    }),
  ],
  text: (text, options) => {
    const leaves = text.getLeaves([], [])
    const leavesTags = leaves.flatMap(leaf => parse(leaf, options)).toArray()

    if (options.preserveKeys) {
      return [
        Tag.create({
          name: 'text',
          attributes: { key: text.key },
          children: leavesTags,
        }),
      ]
    } else if (options.strict && text.text === '') {
      return [
        Tag.create({
          name: 'text',
          children: leavesTags,
        }),
      ]
    }

    return leavesTags
  },
  leaf: (leaf, options) =>
    leaf.marks.reduce(
      (acc, mark) => [
        Tag.create({
          name: getTagName(mark, options),
          attributes: getAttributes(mark, options, canPrintAsShorthand(mark)),
          children: acc,
          selfClosingPair: isAnnotationMark(mark),
        }),
      ],
      [
        {
          print: o => printString(leaf.text, o),
        },
      ]
    ),
  selection: (selection, options, initial) => {
    const children =
      options.preserveKeys || !initial
        ? [
            ...PARSERS.point(selection.anchor, options, 'anchor'),
            ...PARSERS.point(selection.focus, options, 'focus'),
          ]
        : []
    const attributes = {
      ...(selection.isFocused ? { focused: true } : {}),
      ...(selection.marks !== null && selection.marks.size
        ? {
            marks: selection.marks
              .map(m => ({
                type: m.type,
                ...(m.data.size ? { data: m.data.toJSON() } : {}),
              }))
              .toJS(),
          }
        : {}),
    }
    return Object.keys(attributes).length || children.length
      ? [
          Tag.create({
            name: 'selection',
            attributes,
            children,
          }),
        ]
      : []
  },
  point: (point, options, name) => [
    Tag.create({
      name,
      attributes: {
        ...(point.offset !== 0 ? { offset: point.offset } : {}),
        // print either path or key
        ...(options.preserveKeys
          ? { key: point.key }
          : { path: point.path.toArray() }),
      },
    }),
  ],
}

/*
 * Returns attributes (with or without key)
 */

function getAttributes(
  model,
  options,
  // True to spread the data as attributes.
  // False to keep it under `data` and to make `type` explicit
  asShorthand = true
) {
  let result = {}

  // type
  if (!asShorthand && model.type) {
    result.type = model.type
  }

  // key
  if (options.preserveKeys && model.key) {
    result.key = model.key
  }

  // data
  if (model.object !== 'value' || options.preserveData) {
    const data = model.data.delete('__key__').toJSON()
    if (
      Object.keys(data).length > 0 &&
      (!asShorthand || model.object === 'value')
    ) {
      result.data = data
    } else {
      // Spread the data as individual attributes
      result = { ...result, ...data }
    }
  }

  if (isAnnotationMark(model)) {
    result.key = model.data.get('__key__')
    if (result.type) {
      result.type = getModelType(result.type)
    }
  }

  return result
}

/**
 * Leaf model has been removed and text.getLeaves() model returns list on records which don't have 'object' property
 * This function is used for recognizing leaf-like records
 */

function isPseudoLeafRecord(model) {
  return (
    model instanceof Record &&
    model.text !== undefined &&
    model.annotations &&
    model.decorations &&
    model.marks
  )
}

/**
 * Parse a Slate model to a Tag representation
 */

function parse(model, options) {
  const object = isPseudoLeafRecord(model) ? 'leaf' : model.object
  const parser = PARSERS[object]

  if (!parser) {
    throw new Error(`Unrecognized Slate model ${object}`)
  }

  if (object === 'value') {
    if (model.annotations.size > 0) {
      model = applyAnnotationMarks(model)
    }

    if (model.selection.isFocused) {
      model = insertFocusedSelectionTagMarkers(model, options)
    }
  }

  return parser(model, options)
}

/*
 * True if the model can be print using the shorthand syntax 
 * (data spread into attributes)
 */

function canPrintAsShorthand(model) {
  const validAttributeKey = key => /^[a-zA-Z]/.test(key)

  return model.data
    .delete('__key__')
    .every((value, key) => validAttributeKey(key))
}

/**
 * Checks if the model if void node via hyperscript options schema object
 * @param {Block | Inline} model
 * @param {Options} options
 * @returns {boolean}
 */

function isVoid(model, options) {
  if (!options.hyperscript) {
    return false
  }

  const { schema } = options.hyperscript
  const { object, type } = model

  const schemaObject = `${object}s`
  const isVoidNode =
    !!schema &&
    schema[schemaObject] &&
    schema[schemaObject][type] &&
    schema[schemaObject][type].isVoid

  return isVoidNode
}

function getTagName(model, options) {
  const tagName = getHyperscriptTag(model, options.hyperscript)

  return canPrintAsShorthand(model) ? tagName : model.object
}

/**
 * Returns hyperscript tag according to createHyperscript() factory options
 * @param {SlateModel} model
 * @param {Object | undefined} hyperscript
 * @returns {string}
 */

function getHyperscriptTag(model, hyperscript) {
  const modelType = getModelType(model)

  const objects = `${model.object}s`

  if (!hyperscript || !hyperscript[objects]) {
    return modelType
  }

  const tagNameMap = hyperscript[objects]

  const tagName = Object.keys(tagNameMap).find(
    tag => tagNameMap[tag] === modelType
  )

  return tagName || modelType
}

export default parse
