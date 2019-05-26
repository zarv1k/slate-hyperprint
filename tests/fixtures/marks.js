/** @jsx h */

import h from '../helpers/h'

const input = (
  <value>
    <document>
      <paragraph>
        <bold>Hello</bold> I am <bold>using bold </bold>
        <bold>
          <italic> and italic</italic>
        </bold>
        <italic> and just italic</italic>.
      </paragraph>
    </document>
  </value>
)

const output = `
<value>
  <document>
    <paragraph>
      <bold>Hello</bold> I am <bold>using bold </bold>
      <bold>
        <italic> and italic</italic>
      </bold>
      <italic> and just italic</italic>.
    </paragraph>
  </document>
</value>
`

export { input, output }
