import { makeBrowserlikeIframeC, browserlikeIframeDriverManager } from 'MobiusUI'
import { randomString, asIs } from 'MobiusUtils'

export const LiteBrowser = source => {
  const LiteBrowserC = makeBrowserlikeIframeC({
    unique: `browserlike-iframe--${randomString(7)}`,
    children: null,
    componentToDriverMapper: asIs,
    driver: browserlikeIframeDriverManager.scope('app').driver,
    driverToComponentMapper: asIs,
    config: {}
  })
  return LiteBrowserC(source)
}
