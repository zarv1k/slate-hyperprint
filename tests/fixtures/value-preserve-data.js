/** @jsx h */

import h from "../helpers/h";
const options = { preserveData: true };
const input = (
  <value data={{ ololo: "trololo" }}>
    <document>
      <paragraph ololo="trololo">Short text.</paragraph>
    </document>
  </value>
);

const output = `
<value ololo="trololo">
  <document>
    <paragraph ololo="trololo">Short text.</paragraph>
  </document>
</value>
`;

export { input, output, options };
