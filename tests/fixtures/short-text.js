/** @jsx h */

import h from '../helpers/h'

const input = (
  <value data={{ololo:'trololo'}}>
    <document>
      <paragraph>Short text.</paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph>Short text.</paragraph>
  </document>
</value>
`

export { input, output }
