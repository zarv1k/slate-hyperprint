'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _indentString = require('indent-string');

var _indentString2 = _interopRequireDefault(_indentString);

require('./options');

var _attributes = require('./attributes');

var _attributes2 = _interopRequireDefault(_attributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Represents a printable JSX tag
 */
var Tag = function () {
    function Tag() {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Tag);

        var name = args.name,
            children = args.children,
            attributes = args.attributes;


        this.name = name || '';
        this.children = children || [];
        this.attributes = attributes || {};

        return this;
    }

    _createClass(Tag, [{
        key: 'print',


        // Print this tag
        value: function print(options) {
            var name = this.name,
                children = this.children,
                attributes = this.attributes;


            var stringifiedAttrs = Object.keys(attributes).sort().map(function (key) {
                return (0, _attributes2.default)(key, attributes[key]);
            });

            var openingTagInner = [name].concat(stringifiedAttrs).join(' ');

            var printedChildren = children.map(function (child) {
                return child.print(options);
            })
            // Filter out empty strings
            .filter(Boolean);

            if (printedChildren.length === 0) {
                return '<' + openingTagInner + ' />';
            }

            return ['<' + openingTagInner + '>', (0, _indentString2.default)(printedChildren.join('\n'), 1, { indent: '    ' }), '</' + name + '>'].join('\n');
        }
    }], [{
        key: 'create',
        value: function create() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new (Function.prototype.bind.apply(Tag, [null].concat(args)))();
        }
    }]);

    return Tag;
}();

exports.default = Tag;