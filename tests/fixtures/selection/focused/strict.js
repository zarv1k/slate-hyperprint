/** @jsx h */

import h from '../../../helpers/h'

const options = {
  strict: true,
}

const input = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
      <paragraph>
        <anchor />
      </paragraph>
      <paragraph>
        H<focus />ello, world!
      </paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph>
      <text />
    </paragraph>
    <paragraph>
      <anchor />
    </paragraph>
    <paragraph>
      H<focus />ello, world!
    </paragraph>
  </document>
</value>
`

export { input, output, options }
