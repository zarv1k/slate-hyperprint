/** @jsx h */

import h from '../../../helpers/h'

const input = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
      <paragraph>Hello, world!</paragraph>
    </document>
    <selection focused marks={[{ type: 'bold' }]}>
      <anchor path={[1, 0]} />
      <focus path={[1, 0]} />
    </selection>
  </value>
)

const output = `
<value>
  <document>
    <paragraph />
    <paragraph>Hello, world!</paragraph>
  </document>
  <selection focused marks={[{ type: 'bold' }]}>
    <anchor path={[1, 0]} />
    <focus path={[1, 0]} />
  </selection>
</value>
`

export { input, output }
