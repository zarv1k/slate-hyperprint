/** @jsx h */

import h from '../../../helpers/h'

const options = { strict: true }

const input = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
      <paragraph>Hello, world!</paragraph>
    </document>
    <selection>
      <anchor path={[0, 0]} />
      <focus offset={1} path={[1, 0]} />
    </selection>
  </value>
)

const output = `
<value>
  <document>
    <paragraph>
      <text />
    </paragraph>
    <paragraph>Hello, world!</paragraph>
  </document>
  <selection>
    <anchor path={[0, 0]} />
    <focus offset={1} path={[1, 0]} />
  </selection>
</value>
`

export { input, output, options }
