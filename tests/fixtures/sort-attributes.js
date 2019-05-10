/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'
import { defaultHyperscript } from '../helpers/h'

const hyperscript = {
  ...defaultHyperscript,
  schema: {},
}

const options = {
  preserveKeys: true,
  hyperscript,
}

const h = createHyperscript(hyperscript)

const input = (
  <value>
    <document>
      <image data1 data2="2" a="b" key="key1" />
      <block type="image" key="key2" data={{ src: 'image.png' }} />
    </document>
  </value>
)

const output = `
<value>
  <document key="0">
    <image a="b" data1 data2="2" key="key1" />
    <image key="key2" src="image.png" />
  </document>
</value>
`

export { input, output, options }
