import { Editor } from 'slate'

/**
 * Checks is selection at initial position: it is collapsed and is before the first character of the first text node
 *
 * @param {Value} value
 * @returns {boolean}
 */

export const isSelectionAtStartOfDocument = ({ selection, document }) =>
  selection.isCollapsed &&
  selection.anchor.offset === 0 &&
  selection.focus.offset === 0 &&
  selection.anchor.isAtStartOfNode(document.getFirstText())

/**
 *
 * Checks selection is set
 * @param selection
 * @returns {boolean}
 */

export const isSelectionSet = selection =>
  selection.anchor &&
  selection.anchor.isSet &&
  selection.focus &&
  selection.focus.isSet

/**
 * Builds the open part of the selection marker text.
 * Ensures that selection markers will not cause issues in hyperprint output for documents that have already includes selection markers as real texts.
 * If document text contains open or close part of the selection marker, function appends '@' and tries to make open/close marker texts unique in the document.
 * @param {Value} value
 * @param {string} open
 * @returns {string}
 */

const selectionOpenMarker = (value, open = '__@') => {
  const text = value.document.text
  const close = [...open].reverse().join('')

  return text.includes(open) || text.includes(close)
    ? selectionOpenMarker(value, `${open}@`)
    : open
}

/**
 * Insert selection tag markers
 *
 * The easiest way to print focused selection tags (anchor, focus, cursor) is to add them explicitly into the document as texts.
 * This function inserts special text strings that will be replaced by focused selection tags while printing the document.
 * It also saves selection marker open tag into the options for replacement while printing leaf nodes.
 * @param {Value} value
 * @param {Object} options
 * @returns {Value}
 */

export const insertFocusedSelectionTagMarkers = (value, options) => {
  const { selection } = value
  const { isExpanded, isBlurred, isUnset, isForward, anchor, marks } = selection

  if (isUnset || isBlurred || (marks && marks.size)) {
    return value
  }

  const open = selectionOpenMarker(value)
  const close = [...open].reverse().join('')

  let tags = ['cursor']

  if (isExpanded) {
    tags = isForward ? ['focus', 'anchor'] : ['anchor', 'focus']
  }

  const editor = new Editor({ value })

  editor.withoutSaving(() => {
    editor.command(e =>
      tags.forEach(tag => {
        const { path, offset } = selection[tag] || anchor
        e.insertTextByPath(path, offset, `${open}${tag}${close}`)
      })
    )
  })

  // selectionMarker in options saved only for internal usage
  options.selectionMarker = open

  return editor.value
}

/**
 * Prints focused selection tags with escaping texts around them
 *
 * @param {string} s
 * @param {string} marker
 * @param {Function} escape
 * @returns {string}
 */

export const printFocusedSelection = (s, marker, escape) => {
  const open = marker
  const close = marker
    .split('')
    .reverse()
    .join('')

  const selection = new RegExp(`${open}(focus|anchor|cursor)${close}`)
  const splitter = new RegExp(`(${open}(?:focus|anchor|cursor)${close})`)

  return s
    .split(splitter)
    .map(
      text =>
        selection.test(text) ? text.replace(selection, '<$1 />') : escape(text)
    )
    .join('')
}
