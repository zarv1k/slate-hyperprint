/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import ReactDOM from 'react-dom'
import Slate from 'slate'
import hyperprint from '../dist/'

import INITIAL_VALUE from './value'

class Website extends React.Component {
  state = {
    input: JSON.stringify(INITIAL_VALUE.toJSON(), null, 2),
  }

  onChange = event => {
    this.setState(
      {
        input: event.target.value,
      },
      () => Prism.highlightAll() // eslint-disable-line
    )
  }

  render() {
    const { input } = this.state

    let value
    try {
      value = Slate.Value.fromJSON(JSON.parse(input))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      value = Slate.Value.create()
    }

    return (
      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            href="https://github.com/zarv1k/slate-hyperprint"
          >
            <pre>
              <code>@zarv1k/slate-hyperprint</code>
            </pre>
          </a>
        </header>
        <section className="App-body">
          <div className="left-side">
            <h3>Input a Slate JSON representation</h3>
            <textarea autoFocus value={input} onChange={this.onChange} />
          </div>
          <div className="right-side">
            <h3>Get the hyperscript representation</h3>
            <pre>
              <code className="language-jsx">{hyperprint(value)}</code>
            </pre>
          </div>
        </section>
        <footer className="App-footer">
          <a
            className="App-version"
            href="https://www.npmjs.com/package/@zarv1k/slate-hyperprint"
          >
            v3.1.0
          </a>
        </footer>
      </div>
    )
  }
}

ReactDOM.render(<Website />, document.getElementById('example')) // eslint-disable-line
