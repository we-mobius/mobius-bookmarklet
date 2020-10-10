import {
  div, span, a,
  makeMiddleRowAdaptiveLayoutE, makeMiddleColAdaptiveLayoutE,
  withFullPct,
  monacoDriverManager, browserlikeIframeDriverManager
} from 'MobiusUI'
import { randomString } from 'MobiusUtils'
import { MonacoEditor } from 'Interface/pages/create/editor-monaco.js'
import { terserWorkerDriverManager } from 'Interface/drivers/worker-terser.driver.js'
import { of, combineLatest, map, mapTo, take, startWith, switchMap, switchMapTo } from 'Libs/rx.js'

// monacoDriverManager.scope('app').driver.event,
export const Editor = source => {
  const monacoEditor = MonacoEditor(source)
  const unique = `editor--${randomString(7)}`
  const intent$s = {
    run: source.DOM.select(`.js_${unique}__run`).events('click').pipe(
      switchMapTo(combineLatest([
        browserlikeIframeDriverManager.scope('app').driver.window(),
        monacoDriverManager.scope('app').driver.editor()
      ]).pipe(take(1))),
      map(([{ window }, editor]) => {
        console.warn(window, editor)
        const code = editor.getValue()
        try {
          window.Function(code)()
        } catch (error) {
          console.warn(error)
        }
      }),
      startWith(1),
      mapTo(1)
    ),
    gen: source.DOM.select(`.js_${unique}__gen`).events('click').pipe(
      switchMapTo(monacoDriverManager.scope('app').driver.editor()),
      map(editor => {
        const code = editor.getValue()
        console.warn(code)
        return code
      }),
      switchMap(code => {
        return terserWorkerDriverManager.scope('app').driver.minify(of({ code }))
      }),
      map(compressed => {
        const { code } = JSON.parse(compressed)
        return `javascript:(function(){${encodeURIComponent(code)}})()`
      }),
      startWith('https://developer.mozilla.org/')
    )
  }

  return {
    DOM: combineLatest([monacoEditor.DOM, intent$s.run, intent$s.gen]).pipe(
      map(([monacoEditor, run, bookmarklet]) => {
        const runBtnSelector = '.mobius-margin-x--r-small.mobius-text--bold.mobius-cursor--pointer.hover_mobius-text--primary.mobiuse'
        const bookmarkletBtnSelector = '.mobius-border--all.mobius-rounded--base.mobius-padding-x--r-small.mobius-margin-x--r-small.mobius-cursor--pointer.hover_mobius-text--primary'

        return makeMiddleRowAdaptiveLayoutE({
          top: makeMiddleColAdaptiveLayoutE({
            selector: '.mobius-width--100.mobius-padding-y--small',
            children: {
              left: div(
                '.mobius-layout__horizontal.mobius-select--none',
                [
                  div(`.js_${unique}__run${runBtnSelector}`, [span('.mobius-icon.mobius-icon-arrow-right--head-bare-solid.mobius-margin-right--r-xs.mobius-events--none'), span('.mobius-events--none', 'RUN')]),
                  div(`.js_${unique}__gen${runBtnSelector}`, [span('.mobius-icon.mobius-icon-cube--bare.mobius-margin-right--r-xs.mobius-events--none'), span('.mobius-events--none', 'GENERATE')]),
                  a(
                    `.js_${unique}__applet${bookmarkletBtnSelector}`,
                    {
                      props: { href: bookmarklet }
                    },
                    [span('.mobius-icon.mobius-icon-logo-applet.mobius-margin-right--r-xs'), span('Bookmarklet')]
                  )
                ]
              )
            },
            config: { withAbsMidWrapper: false }
          }),
          middle: withFullPct(monacoEditor)
        })
      })
    )
  }
}
