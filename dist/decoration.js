'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDecorationMarks = exports.getModelType = exports.isDecorationMark = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slate = require('slate');

/**
 * Checks is mark type is decoration in real
 *
 * @param {Mark} mark
 * @returns {boolean}
 */

var isDecorationMark = exports.isDecorationMark = function isDecorationMark(mark) {
  return mark.object === 'mark' && /__@.+@__/.test(mark.type);
};

/**
 * Returns model type
 *
 * @param {SlateModel} model
 * @returns {string}
 */

var getModelType = exports.getModelType = function getModelType(model) {
  return isDecorationMark(model) ? model.type.replace(/__@(.+)@__/, '$1') : model.type;
};

/**
 * Applies decoration marks
 *
 * The easiest way to print decoration tags is by applying decoration marks to slate document.
 * To identify marks which are decorations in real while printing tags, mark type is wrapped intentionally.
 * @param {Value} value
 * @returns {Value}
 */

var applyDecorationMarks = exports.applyDecorationMarks = function applyDecorationMarks(value) {
  var editor = new _slate.Editor({ value: value });

  value.annotations.valueSeq().reverse().forEach(function (annotation) {
    editor.withoutSaving(function () {
      editor.withoutNormalizing(function () {
        editor.addMarkAtRange(editor.value.document.createRange(annotation.toJSON()), {
          type: '__@' + annotation.type + '@__',
          data: _extends({}, annotation.data.toJSON(), {
            __key__: annotation.key
          })
        });
      });
    });
  });
  return editor.value;
};