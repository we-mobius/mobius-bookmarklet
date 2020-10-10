import { makeBaseDriver } from 'MobiusUI'
import { ofType, makeBaseScopeManager } from 'MobiusJS'
import { hardDeepMerge } from 'MobiusUtils'
import { Subject } from 'Libs/rx.js'

const getWorker = (() => {
  const worker = {}
  return () => {
    if (!worker.terser) {
      worker.terser = new Worker(URL.createObjectURL(new Blob([`
      importScripts('https://cdn.jsdelivr.net/npm/terser@5.3.2/dist/bundle.min.js')
      onmessage = ({ data }) => {
        console.warn('[TerserWorker] onmessage: receives data', data)
        const { code, config } = data
        Terser.minify(code, config || { }).then(compressed => {
          console.warn('[TerserWorker] onmessage: compressed results', data)
          postMessage(JSON.stringify(compressed))
        })
      }
    `], { type: 'text/javascript' })))
    }
    return worker.terser
  }
})()

export const makeTerserWorkerDriver = () => {
  // @see: https://terser.org/docs/api-reference
  const defaultMinifyOptions = {
    ecma: 8,
    parse: {
      bare_returns: true,
      html5_comments: true
    },
    compress: {
      arrows: true,
      arguments: false,
      booleans: true,
      booleans_as_integers: false,
      collapse_vars: true,
      comparisons: true,
      computed_props: true,
      conditionals: true,
      dead_code: false,
      defaults: true,
      directives: true,
      drop_console: false,
      drop_debugger: true,
      evaluate: true,
      expression: true,
      global_defs: {},
      hoist_funs: false,
      hoist_props: true,
      hoist_vars: false,
      if_return: true,
      inline: true,
      join_vars: true,
      keep_classnames: false,
      keep_fargs: true,
      keep_fnames: false,
      keep_infinity: true,
      loops: true,
      module: true,
      negate_iife: true,
      passes: 1,
      properties: true,
      pure_funcs: null,
      pure_getters: 'strict',
      reduce_funcs: true,
      reduce_vars: true,
      sequences: true,
      side_effects: true,
      switches: true,
      toplevel: false,
      top_retain: null,
      typeofs: false,
      unsafe: false,
      unsafe_arrows: false,
      unsafe_comps: false,
      unsafe_Function: false,
      unsafe_math: false,
      unsafe_methods: false,
      unsafe_proto: false,
      unsafe_regexp: false,
      unsafe_undefined: false,
      unused: false, // NOTE:
      warnings: false
    },
    mangle: {
      eval: false,
      keep_classnames: false,
      keep_fnames: false,
      module: true,
      reserved: [],
      toplevel: true,
      safari10: true,
      properties: {
        builtins: false,
        debug: false,
        keep_quoted: false,
        regex: null,
        reserved: []
      }
    },
    module: true,
    output: {
      ascii_only: false,
      beautify: false,
      braces: true,
      comments: false,
      indent_level: 2,
      indent_start: 0,
      inline_script: true,
      keep_quoted_props: false,
      max_line_len: false,
      preamble: null,
      quote_keys: false,
      quote_style: 1,
      safari10: true,
      semicolons: true,
      shebang: true,
      webkit: false,
      wrap_iife: false
    },
    sourceMap: false,
    toplevel: true,
    nameCache: null,
    ie8: false,
    keep_classnames: false,
    keep_fnames: false,
    safari10: true
  }
  getWorker().onmessage = mes => {
    const { data } = mes
    console.warn(data)
    _minifyOutMid$.next(data)
  }
  const minifyIn$ = {
    next: ({ code = '', config = {} } = {}) => {
      config = hardDeepMerge(defaultMinifyOptions, config)
      getWorker().postMessage({ code, config })
    },
    error: () => {},
    complete: () => {}
  }
  const _minifyOutMid$ = new Subject()
  const minifyOut$ = _minifyOutMid$
  const minifyOutShare$ = minifyOut$

  const observers = {
    minify: minifyIn$
  }
  const observables = {
    minify: minifyOutShare$
  }

  const minifyDriverMaker = makeBaseDriver(
    () => ofType('minify', observers),
    () => ofType('minify', observables)
  )

  return {
    observers,
    observables,
    maker: {
      minify: minifyDriverMaker
    },
    driver: {
      minify: minifyDriverMaker()
    }
  }
}

export const terserWorkerDriverManager = makeBaseScopeManager()
terserWorkerDriverManager.registerScope('app', makeTerserWorkerDriver())
