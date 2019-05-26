# @zarv1k/slate-hyperprint

[![NPM](https://img.shields.io/npm/v/@zarv1k/slate-hyperprint.svg)](https://www.npmjs.com/package/@zarv1k/slate-hyperprint)

A library to convert Slate models to their slate-hyperscript representation.

You can use `@zarv1k/slate-hyperprint` as a library to:

- Improve the output of unit tests by comparing hyperscript strings instead of JSON values.
- Facilitate debugging and console logging of Slate values.

# Setup

```
yarn add @zarv1k/slate-hyperprint [--dev]
```

# Usage

```js
import Slate from 'slate';
import hyperprint from '@zarv1k/slate-hyperprint';

console.log(
  hyperprint(
    Slate.Value.create({
      document: Slate.Document.create({
        nodes: [
          Slate.Block.create({
            type: 'paragraph',
            data: { a: 1 },
            nodes: [
              Slate.Text.create('Hello')
            ]
          }
        )]
      })
    })
  )
);
// <value>
//   <document>
//     <paragraph a={1}>
//       Hello
//     </paragraph>
//   </document>
// </value>

hyperprint.log(...)
// Equivalent to console.log(hyperprint(...))
```

# Options

`slate-hyperprint` accepts an option object:

```js
hyperprint(value, options)
```

- `preserveData: boolean = false`
  True to print Slate Value's data
- `preserveKeys: boolean = false`
  True to print node keys
- `strict: boolean = false`
  True to preserve empty texts and other things that the formatting would
  otherwise omit. Useful when using hyperprint compare values in tests, because
  the output is stricter.
- `prettier: Object = { semi: false, singleQuote: true, tabWidth: 2 }`
  Prettier config to use when formatting the output JSX.

# Test

```
yarn test
```

# Build

```
yarn build
```

# Thanks

- Original library [repo](https://github.com/GitbookIO/slate-hyperprint)
- The React equivalent [react-element-to-jsx-string](https://github.com/algolia/react-element-to-jsx-string) is and will remain a great source of inspiration.

