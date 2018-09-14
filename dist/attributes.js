'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _printComplexDataStructure = require('./printComplexDataStructure');

var _printComplexDataStructure2 = _interopRequireDefault(_printComplexDataStructure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Based on
https://github.com/algolia/react-element-to-jsx-string/blob/master/src/formatter/formatPropValue.js
*/

var escape = function escape(s) {
    return s.replace(/"/g, '&quot;');
};

/*
 * Print a tag attribute, for example as 'key={value}' or 'key="value"' or 'key'
 */
function printAttributeValue(value) {
    if (typeof value === 'number') {
        return '{' + String(value) + '}';
    }

    if (typeof value === 'string') {
        return '"' + escape(value) + '"';
    }

    // > "Symbols (new in ECMAScript 2015, not yet supported in Flow)"
    // @see: https://flow.org/en/docs/types/primitives/
    // $FlowFixMe: Flow does not support Symbol
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol') {
        throw new Error('not implemented');
    }

    if (typeof value === 'function') {
        throw new Error('not implemented');
    }

    if (value instanceof Date) {
        return '{new Date("' + value.toISOString() + '")}';
    }

    if ((0, _isPlainObject2.default)(value) || Array.isArray(value)) {
        return '{' + (0, _printComplexDataStructure2.default)(value) + '}';
    }

    return '{' + String(value) + '}';
}

/*
 * Print a tag attribute to 'key={value}' or 'key' for `true`
 */
function printAttribute(key, value) {
    if (value === true) {
        return key;
    }

    return key + '=' + printAttributeValue(value);
}

exports.default = printAttribute;