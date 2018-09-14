#!/usr/bin/env node
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _slate = require('slate');

var _slate2 = _interopRequireDefault(_slate);

var _meow2 = require('meow');

var _meow3 = _interopRequireDefault(_meow2);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _meow = (0, _meow3.default)('\n    Usage\n        $ slate-hyperprint <path>\n'),
    input = _meow.input;

if (input.length > 0) {
    var _input = _slicedToArray(input, 1),
        path = _input[0];

    var json = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(path));
    var document = json.value && json.value.document || json.state && json.state.document || json.document || json;
    // COMPAT: Use Value or State
    var state = (_slate2.default.Value || _slate2.default.State).create({ document: document });

    // eslint-disable-next-line no-console
    console.log((0, _2.default)(state.document));
}