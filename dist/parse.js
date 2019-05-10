'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _tag = require('./tag');

var _tag2 = _interopRequireDefault(_tag);

var _utils = require('./utils');

var _decoration = require('./decoration');

var _selection2 = require('./selection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// All Tag parsers
var PARSERS = {
  value: function value(_value, options) {
    var children = [].concat(_toConsumableArray(parse(_value.document, options)), _toConsumableArray(_value.selection.marks && _value.selection.marks.size || (0, _selection2.isSelectionSet)(_value.selection) && _value.selection.isBlurred && !(0, _selection2.isSelectionAtStartOfDocument)(_value) ? PARSERS.selection(_value.selection, options, (0, _selection2.isSelectionAtStartOfDocument)(_value)) : []));
    return [_tag2.default.create({
      name: 'value',
      attributes: getAttributes(_value, options),
      children: children
    })];
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
    var leaves = _text.getLeaves();
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
      print: function print(o) {
        return (0, _utils.printString)(_leaf.text, o);
      }
    }]);
  },
  selection: function selection(_selection, options, initial) {
    var children = options.preserveKeys || !initial ? [].concat(_toConsumableArray(PARSERS.point(_selection.anchor, options, 'anchor')), _toConsumableArray(PARSERS.point(_selection.focus, options, 'focus'))) : [];
    var attributes = _extends({}, _selection.isFocused ? { focused: true } : {}, _selection.marks !== null && _selection.marks.size ? {
      marks: _selection.marks.map(function (m) {
        return _extends({
          type: m.type
        }, m.data.size ? { data: m.data.toJSON() } : {});
      }).toJS()
    } : {});
    return Object.keys(attributes).length || children.length ? [_tag2.default.create({
      name: 'selection',
      attributes: attributes,
      children: children
    })] : [];
  },
  point: function point(_point, options, name) {
    return [_tag2.default.create({
      name: name,
      attributes: _extends({}, _point.offset !== 0 ? { offset: _point.offset } : {}, options.preserveKeys ? { key: _point.key } : { path: _point.path.toArray() })
    })];
  }

  /*
   * Returns attributes (with or without key)
   */

};function getAttributes(model, options) {
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

  if (result.type && (0, _decoration.isDecorationMark)(model)) {
    result.type = (0, _decoration.getModelType)(result.type);
  }

  return result;
}

/*
 * Parse a Slate model to a Tag representation
 */

function parse(model, options) {
  var object = model.object;
  var parser = PARSERS[object];

  if (!parser) {
    throw new Error('Unrecognized Slate model ' + object);
  }

  if (object === 'value') {
    if (model.decorations.size > 0) {
      model = (0, _decoration.applyDecorationMarks)(model);
    }

    if (model.selection.isFocused) {
      model = (0, _selection2.insertFocusedSelectionTagMarkers)(model, options);
    }
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

/**
 * Checks if the model if void node via hyperscript options schema object
 * @param {Block | Inline} model
 * @param {Options} options
 * @returns {boolean}
 */

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

/**
 * Returns hyperscript tag according to createHyperscript() factory options
 * @param {SlateModel} model
 * @param {Object | undefined} hyperscript
 * @returns {string}
 */

function getHyperscriptTag(model, hyperscript) {
  var modelType = (0, _decoration.getModelType)(model);

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

exports.default = parse;