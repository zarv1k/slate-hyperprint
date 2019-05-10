/** @jsx h */
/* eslint-disable react/void-dom-elements-no-children */
import h, { defaultHyperscript, defaultSchema } from '../helpers/h'

const options = {
  preserveKeys: true,
  hyperscript: {
    ...defaultHyperscript,
    schema: defaultSchema,
  },
}

const input = (
  <value>
    <document key="a">
      <paragraph key="b">
        <link key="c" src="source">
          <text key="g">Some link</text>
        </link>
        <text key="d">Hello </text>
        <text key="e">
          <bold>there</bold>
        </text>
      </paragraph>
      <image key="f" src="image.png" />
    </document>
  </value>
)

const output = `
<value>
  <document key="a">
    <paragraph key="b">
      <link key="c" src="source">
        <text key="g">Some link</text>
      </link>
      <text key="d">Hello </text>
      <text key="e">
        <bold>there</bold>
      </text>
    </paragraph>
    <image key="f" src="image.png" />
  </document>
</value>
`

export { input, output, options }
