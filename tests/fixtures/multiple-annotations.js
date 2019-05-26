/** @jsx h */

import h from '../helpers/h'

const input = (
  <value>
    <document>
      <paragraph>
        <highlight key="a1" hey="ho" />Hello<highlight key="a1" hey="ho" />,{' '}
        <highlight key="a2" />world<highlight key="a2" />!
      </paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph>
      <highlight hey="ho" key="a1" />Hello<highlight hey="ho" key="a1" />,{' '}
      <highlight key="a2" />world<highlight key="a2" />!
    </paragraph>
  </document>
</value>
`

export { input, output }
