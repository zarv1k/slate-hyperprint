/** @jsx h */

import h from '../../../helpers/h'

const input = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
      <paragraph>
        Hel<cursor />lo, world!
      </paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph />
    <paragraph>
      Hel<cursor />lo, world!
    </paragraph>
  </document>
</value>
`

export { input, output }
