/** @jsx h */

import h from '../helpers/h'

const options = { preserveData: true }

const input = (
  <value ololo="trololo" azaza="tratata">
    <document>
      <paragraph ololo="trololo">Short text.</paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph ololo="trololo">Short text.</paragraph>
  </document>
</value>
`

export { input, output, options }
