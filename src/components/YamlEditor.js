
import * as React from 'react'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-yaml'
import 'prismjs/themes/prism-coy.css'
import Editor from 'react-simple-code-editor'
import './YamlEditor.css'

const hightlightWithLineNumbers = (input, language) =>
  highlight(input, language)
    .split('\n')
    .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
    .join('\n')

/**
 * An editor for modifying Yaml.
 *
 * @param {Object} config
 * @param {string} config.value - the string state value
 * @param {Function} config.onChange - the update state function
 */
const YamlEditor = ({ value = '', onChange = () => {} }) => {
  return <Editor
      className="editor"
      value={value}
      onValueChange={onChange}
      highlight={code => hightlightWithLineNumbers(code, languages.yaml)}
      tabSize={2}
      padding={10}
      textareaId="codeArea"
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: '14px'
      }}
    />
}

export default YamlEditor
