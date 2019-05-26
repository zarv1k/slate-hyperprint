/** @jsx h */

import h from '../helpers/h'

const input = (
  <value>
    <document>
      <paragraph>
        Hello, <highlight key="hl" />world<highlight key="hl" />!
      </paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph>
      Hello, <highlight key="hl" />world<highlight key="hl" />!
    </paragraph>
  </document>
</value>
`

export { input, output }
