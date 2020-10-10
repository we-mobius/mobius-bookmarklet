/* eslint-disable no-undef */
importScripts('https://cdn.jsdelivr.net/npm/terser@5.3.2/dist/bundle.min.js')
onmessage = ({ data }) => {
  console.warn('[TerserWorker] onmessage: receives data', data)
  const { code, config } = data
  Terser.minify(code, config || { }).then(compressed => {
    console.warn('[TerserWorker] onmessage: compressed results', data)
    postMessage(JSON.stringify(compressed))
  })
}
