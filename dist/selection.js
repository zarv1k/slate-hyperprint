'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Checks is selection at initial position: it is collapsed and is before the first character of the first text node
 *
 * @param value
 * @returns {boolean}
 */
var isSelectionAtStartOfDocument = exports.isSelectionAtStartOfDocument = function isSelectionAtStartOfDocument(_ref) {
    var selection = _ref.selection,
        document = _ref.document;
    return selection.isCollapsed && selection.anchor.offset === 0 && selection.focus.offset === 0 && selection.anchor.isAtStartOfNode(document.getFirstText());
};

/**
 * Builds the open part of the selection marker text.
 * Ensures that selection markers will not cause issues in hyperprint output for documents that have already includes selection markers as real texts.
 * If document text contains open or close part of the selection marker, function appends '@' and tries to make open/close marker texts unique in the document.
 * @param {Value} value
 * @param {string} open
 * @returns {string}
 */
var selectionOpenMarker = function selectionOpenMarker(value) {
    var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '__@';

    var text = value.document.text;
    var close = [].concat(_toConsumableArray(open)).reverse().join('');

    return text.includes(open) || text.includes(close) ? selectionOpenMarker(value, open + '@') : open;
};

/**
 * Insert selection tag markers
 *
 * The easiest way to print focused selection tags (anchor, focus, cursor) is to add them explicitly into the document as texts.
 * This function inserts special text strings that will be replaced by focused selection tags while printing the document.
 * It also saves selection marker open tag into the options for replacement while printing leaf nodes.
 * @param {Value} value
 * @param {Options} options
 * @returns {Value}
 */
var insertFocusedSelectionTagMarkers = exports.insertFocusedSelectionTagMarkers = function insertFocusedSelectionTagMarkers(value, options) {
    var selection = value.selection;
    var isCollapsed = selection.isCollapsed,
        isBlurred = selection.isBlurred,
        isForward = selection.isForward,
        anchor = selection.anchor;


    if (isBlurred) {
        return value;
    }

    var open = selectionOpenMarker(value);
    var close = [].concat(_toConsumableArray(open)).reverse().join('');

    var tags = isForward ? ['focus', 'anchor'] : ['anchor', 'focus'];

    if (isCollapsed) {
        tags = ['cursor'];
    }

    var change = value.change();

    change.call(function (ch) {
        return tags.forEach(function (tag) {
            var _ref2 = selection[tag] || anchor,
                path = _ref2.path,
                offset = _ref2.offset;

            ch.insertTextByPath(path, offset, '' + open + tag + close);
        });
    });

    // selectionMarker in options saved only for internal usage
    options.selectionMarker = open;

    return change.value;
};

/**
 * Prints focused selection tags with escaping texts around them
 *
 * @param {string} s
 * @param {string} marker
 * @param {Function} escape
 * @returns {string}
 */
var printFocusedSelection = exports.printFocusedSelection = function printFocusedSelection(s, marker, escape) {
    var open = marker;
    var close = marker.split('').reverse().join('');

    var selection = new RegExp(open + '(focus|anchor|cursor)' + close);
    var splitter = new RegExp('(' + open + '(?:focus|anchor|cursor)' + close + ')');

    return s.split(splitter).map(function (text) {
        return selection.test(text) ? text.replace(selection, '<$1 />') : escape(text);
    }).join('');
};