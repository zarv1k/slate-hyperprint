import { Editor } from 'slate'

/**
 * Checks is mark type is annotation in real
 *
 * @param {Mark} mark
 * @returns {boolean}
 */

export const isAnnotationMark = mark =>
  mark.object === 'mark' && /__@.+@__/.test(mark.type)

/**
 * Returns model type
 *
 * @param {SlateModel} model
 * @returns {string}
 */

export const getModelType = model =>
  isAnnotationMark(model) ? model.type.replace(/__@(.+)@__/, '$1') : model.type

/**
 * Applies annotation marks
 *
 * The easiest way to print annotation tags is by applying annotation marks to slate document.
 * To identify marks which are annotations in real while printing tags, mark type is wrapped intentionally.
 * @param {Value} value
 * @returns {Value}
 */

export const applyAnnotationMarks = value => {
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
