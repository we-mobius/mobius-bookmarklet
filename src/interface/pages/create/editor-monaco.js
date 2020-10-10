import {
  makeMonacoEditorC,
  monacoDriverManager
} from 'MobiusUI'
import { randomString, asIs } from 'MobiusUtils'

export const MonacoEditor = source => {
  const MonacoEditorC = makeMonacoEditorC({
    unique: `monaco-editor--${randomString(7)}`,
    children: null,
    componentToDriverMapper: asIs,
    driver: monacoDriverManager.scope('app').driver.event,
    driverToComponentMapper: asIs,
    config: {}
  })
  return MonacoEditorC(source)
}
