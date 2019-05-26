/** @jsx h */

import h from '../../../helpers/h'

const input = (
  <value>
    <document>
      <paragraph>
        <cursor />Hello, world!
      </paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph>
      <cursor />Hello, world!
    </paragraph>
  </document>
</value>
`

export { input, output }
