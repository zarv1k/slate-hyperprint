/** @jsx h */

import h from '../../../helpers/h'

const input = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
      <paragraph>
        H<anchor />
        <focus />ello, world!
      </paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph />
    <paragraph>
      H<cursor />ello, world!
    </paragraph>
  </document>
</value>
`

export { input, output }
