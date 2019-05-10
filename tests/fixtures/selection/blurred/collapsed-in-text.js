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
      <anchor path={[1, 0]} />
      <focus path={[1, 0]} />
    </selection>
  </value>
)

// console.log('selection', JSON.stringify(input.toJSON(options), null, 2))

const output = `
<value>
  <document>
    <paragraph>
      <text />
    </paragraph>
    <paragraph>Hello, world!</paragraph>
  </document>
  <selection>
    <anchor path={[1, 0]} />
    <focus path={[1, 0]} />
  </selection>
</value>
`

export { input, output, options }
