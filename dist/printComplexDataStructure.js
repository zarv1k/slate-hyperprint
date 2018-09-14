'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringifyObject = require('stringify-object');

var _stringifyObject2 = _interopRequireDefault(_stringifyObject);

var _sortObject = require('./sortObject');

var _sortObject2 = _interopRequireDefault(_sortObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Based on https://github.com/algolia/react-element-to-jsx-string/blob/9518c28d9ba2643c551f5fe8a2433cb097018466/src/formatter/formatComplexDataStructure.js

function noRefCheck() {}

function printComplexDataStructure(value) {
    // Sort keys for output stability
    var normalizedValue = (0, _sortObject2.default)(value);

    var stringifiedValue = (0, _stringifyObject2.default)(normalizedValue, {
        transform: function transform(currentObj, prop, originalResult) {
            var currentValue = currentObj[prop];

            if (typeof currentValue === 'function') {
                return noRefCheck;
            }

            return originalResult;
        }
    });

    // Always print values inline for now...
    return stringifiedValue.replace(/\s+/g, ' ').replace(/{ /g, '{').replace(/ }/g, '}').replace(/\[ /g, '[').replace(/ ]/g, ']');
}

exports.default = printComplexDataStructure;