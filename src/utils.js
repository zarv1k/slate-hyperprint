import { printFocusedSelection } from './selection'

const charsToEscape = ['<', '>', '{', '}', "'", '"', '\n', '\r']

function shouldBeEscaped(s) {
  return charsToEscape.some(char => s.includes(char))
}

function preserveTrailingSpace(s) {
  let result = s

  if (result === '') {
    return result
  }

  if (result.trim() === '') {
    return `{'${result}'}`
  }

  if (result.endsWith(' ')) {
    result = result.replace(/^(.*\S)(\s*)$/, "$1{'$2'}")
  }

  if (result.startsWith(' ')) {
    result = result.replace(/^(\s*)(\S.*)$/, "{'$1'}$2")
  }

  return result
}

function escape(s) {
  if (!shouldBeEscaped(s)) {
    return s
  }

  return `{'${s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')}'}`
}

function printString(s, options) {
  const selectionMarker = options.selectionMarker

  s = selectionMarker
    ? printFocusedSelection(s, selectionMarker, escape)
    : escape(s)
  return preserveTrailingSpace(s)
}

export { printString }
