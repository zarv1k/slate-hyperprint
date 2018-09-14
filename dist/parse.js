'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _tag = require('./tag');

var _tag2 = _interopRequireDefault(_tag);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// All Tag parsers
var PARSERS = {
    value: function value(_value, options) {
        return [_tag2.default.create({
            name: 'value',
            attributes: getAttributes(_value, options),
            children: parse(_value.document, options)
        })];
    },
    // COMPAT
    state: function state(_state, options) {
        return PARSERS.value(_state, options);
    },
    document: function document(_document, options) {
        return [_tag2.default.create({
            name: 'document',
            attributes: getAttributes(_document, options, false),
            children: _document.nodes.flatMap(function (node) {
                return parse(node, options);
            }).toArray()
        })];
    },
    block: function block(_block, options) {
        return [_tag2.default.create({
            name: getTagName(_block, options),
            attributes: getAttributes(_block, options, canPrintAsShorthand(_block)),
            children: isVoid(_block, options) ? [] : _block.nodes.flatMap(function (node) {
                return parse(node, options);
            }).toArray()
        })];
    },
    inline: function inline(_inline, options) {
        return [_tag2.default.create({
            name: getTagName(_inline, options),
            attributes: getAttributes(_inline, options, canPrintAsShorthand(_inline)),
            children: isVoid(_inline, options) ? [] : _inline.nodes.flatMap(function (node) {
                return parse(node, options);
            }).toArray()
        })];
    },
    text: function text(_text, options) {
        // COMPAT
        var leaves = _text.getLeaves ? _text.getLeaves() : _text.getRanges();
        var leavesTags = leaves.flatMap(function (leaf) {
            return parse(leaf, options);
        }).toArray();
        if (options.preserveKeys) {
            return [_tag2.default.create({
                name: 'text',
                attributes: { key: _text.key },
                children: leavesTags
            })];
        } else if (options.strict && _text.text === '') {
            return [_tag2.default.create({
                name: 'text',
                children: leavesTags
            })];
        }

        return leavesTags;
    },
    leaf: function leaf(_leaf, options) {
        return _leaf.marks.reduce(function (acc, mark) {
            return [_tag2.default.create({
                name: getTagName(mark, options),
                attributes: getAttributes(mark, options, canPrintAsShorthand(mark)),
                children: acc
            })];
        }, [{
            print: function print() {
                return (0, _utils.printString)(_leaf.text);
            }
        }]);
    },
    // COMPAT
    range: function range(_range, options) {
        return PARSERS.leaf(_range, options);
    }
};

/*
 * Returns attributes (with or without key)
 */
function getAttributes(model, options) {
    var asShorthand = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var result = {};

    // type
    if (!asShorthand && model.type) {
        result.type = model.type;
    }

    // key
    if (options.preserveKeys && model.key) {
        result.key = model.key;
    }

    // data
    if (!asShorthand && !model.data.isEmpty()) {
        result.data = model.data.toJSON();
    } else {
        // Spread the data as individual attributes
        result = _extends({}, result, model.data.toJSON());
    }

    if (result.type && isDecorationMark(model)) {
        result.type = getModelType(result.type);
    }

    return result;
}

/*
 * Parse a Slate model to a Tag representation
 */
function parse(model, options) {
    var object = model.object || model.kind;
    var parser = PARSERS[object];
    if (!parser) {
        throw new Error('Unrecognized Slate model ' + object);
    }

    if (object === 'value' && model.decorations.size > 0) {
        var change = model.change();
        model.decorations.forEach(function (decoration) {
            change.addMarkAtRange(decoration, _extends({}, decoration.mark.toJSON(), {
                type: '__@' + decoration.mark.type + '@__'
            }), { normalize: false });
        });
        model = change.value;
    }
    return parser(model, options);
}

/*
 * True if the model can be print using the shorthand syntax 
 * (data spread into attributes)
 */
function canPrintAsShorthand(model) {
    var validAttributeKey = function validAttributeKey(key) {
        return (/^[a-zA-Z]/.test(key)
        );
    };

    return model.data.every(function (value, key) {
        return validAttributeKey(key);
    });
}

function isVoid(model, options) {
    if (!options.hyperscript) {
        return false;
    }

    var schema = options.hyperscript.schema;
    var object = model.object,
        type = model.type;


    var schemaObject = object + 's';
    var isVoidNode = !!schema && schema[schemaObject] && schema[schemaObject][type] && schema[schemaObject][type].isVoid;

    return isVoidNode;
}

function getTagName(model, options) {
    var tagName = getHyperscriptTag(model, options.hyperscript);

    return canPrintAsShorthand(model) ? tagName : model.object;
}

function getHyperscriptTag(model, hyperscript) {
    var modelType = getModelType(model);

    var objects = model.object + 's';
    if (!hyperscript || !hyperscript[objects]) {
        return modelType;
    }

    var tagNameMap = hyperscript[objects];

    var tagName = Object.keys(tagNameMap).find(function (tag) {
        return tagNameMap[tag] === modelType;
    });

    return tagName || modelType;
}

function isDecorationMark(mark) {
    return mark.object === 'mark' && /__@.+@__/.test(mark.type);
}

function getModelType(model) {
    if (!isDecorationMark(model)) {
        return model.type;
    }
    return model.type.replace(/__@(.+)@__/, '$1');
}

exports.default = parse;