/** @jsx h */

import h from '../../../helpers/h'

const input = (
  <value>
    <document>
      <paragraph />
      <paragraph>Hello, world!</paragraph>
    </document>
    <selection focused marks={[{ type: 'bold' }]} />
  </value>
)

const output = `
<value>
  <document>
    <paragraph />
    <paragraph>Hello, world!</paragraph>
  </document>
  <selection focused marks={[{ type: 'bold' }]} />
</value>
`

export { input, output }
