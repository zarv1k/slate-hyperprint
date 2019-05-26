import { Editor } from 'slate'

/**
 * Checks is mark type is decoration in real
 *
 * @param {Mark} mark
 * @returns {boolean}
 */

export const isDecorationMark = mark =>
  mark.object === 'mark' && /__@.+@__/.test(mark.type)

/**
 * Returns model type
 *
 * @param {SlateModel} model
 * @returns {string}
 */

export const getModelType = model =>
  isDecorationMark(model) ? model.type.replace(/__@(.+)@__/, '$1') : model.type

/**
 * Applies decoration marks
 *
 * The easiest way to print decoration tags is by applying decoration marks to slate document.
 * To identify marks which are decorations in real while printing tags, mark type is wrapped intentionally.
 * @param {Value} value
 * @returns {Value}
 */

export const applyDecorationMarks = value => {
  const editor = new Editor({ value })

  value.annotations
    .valueSeq()
    .reverse()
    .forEach(annotation => {
      editor.withoutSaving(() => {
        editor.withoutNormalizing(() => {
          editor.addMarkAtRange(
            editor.value.document.createRange(annotation.toJSON()),
            {
              type: `__@${annotation.type}@__`,
              data: {
                ...annotation.data.toJSON(),
                __key__: annotation.key,
              },
            }
          )
        })
      })
    })
  return editor.value
}
