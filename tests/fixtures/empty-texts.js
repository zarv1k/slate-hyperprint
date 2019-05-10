/** @jsx h */

import h from '../helpers/h'

const options = {
  strict: true,
}

const space = ' '
const input = (
  <value>
    <document>
      <paragraph />
      <paragraph>{space}</paragraph>
      <paragraph>
        <text />
      </paragraph>
      <paragraph>
        <link>inlines are surrounded by empty texts</link>
      </paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph />
    <paragraph> </paragraph>
    <paragraph>
      <text />
    </paragraph>
    <paragraph>
      <link>inlines are surrounded by empty texts</link>
    </paragraph>
  </document>
</value>
`

export { input, output, options }
