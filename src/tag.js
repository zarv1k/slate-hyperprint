import printAttribute from './attributes'

/*
 * Represents a printable JSX tag
 */

class Tag {
  constructor(args = {}) {
    const { name, children, attributes, selfClosingPair } = args

    this.name = name || ''
    this.children = children || []
    this.attributes = attributes || {}
    this.selfClosingPair = selfClosingPair || false

    return this
  }

  static create(...args) {
    return new Tag(...args)
  }

  // Print this tag
  print(options) {
    const { name, children, attributes } = this

    const stringifiedAttrs = Object.keys(attributes)
      .sort()
      .map(key => printAttribute(key, attributes[key]))

    const openingTagInner = [name].concat(stringifiedAttrs).join(' ')

    const printedChildren = children
      .map(child => child.print(options))
      // Filter out empty strings
      .filter(Boolean)

    if (printedChildren.length === 0) {
      return `<${openingTagInner} />`
    }

    if (this.selfClosingPair) {
      return [
        `<${openingTagInner} />`,
        printedChildren.join(''),
        `<${openingTagInner} />`,
      ].join('')
    }

    return [
      `<${openingTagInner}>`,
      printedChildren.join(''),
      `</${name}>`,
    ].join('')
  }
}

export default Tag
