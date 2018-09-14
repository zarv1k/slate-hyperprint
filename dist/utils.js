'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var charsToEscape = ['<', '>', '{', '}', "'", '"', '\n'];

function shouldBeEscaped(s) {
    return charsToEscape.some(function (char) {
        return s.includes(char);
    });
}

function preserveTrailingSpace(s) {
    var result = s;
    if (result === '') {
        return result;
    }
    if (result.trim() === '') {
        return '{\'' + result + '\'}';
    }

    if (result.endsWith(' ')) {
        result = result.replace(/^(.*\S)(\s*)$/, "$1{'$2'}");
    }

    if (result.startsWith(' ')) {
        result = result.replace(/^(\s*)(\S.*)$/, "{'$1'}$2");
    }

    return result;
}

function escape(s) {
    if (!shouldBeEscaped(s)) {
        return s;
    }

    return '{\'' + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + '\'}';
}

function printString(s) {
    return preserveTrailingSpace(escape(s));
}

exports.printString = printString;