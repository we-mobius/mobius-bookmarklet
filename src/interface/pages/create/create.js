import { map, combineLatest } from 'Libs/rx.js'
import {
  div, span,
  makeLayerLayoutE,
  makeMiddleRowAdaptiveLayoutE, makeMiddleColAdaptiveLayoutE,
  withFullPct
} from 'MobiusUI'
import { LiteBrowser } from 'Interface/pages/create/browser-lite.js'
import { Editor } from 'Interface/pages/create/editor.js'

const createPage = source => {
  const liteBrowser = LiteBrowser(source)
  const editor = Editor(source)
  return {
    DOM: combineLatest([liteBrowser.DOM, editor.DOM]).pipe(
      map(([liteBrowser, editor]) => {
        return makeLayerLayoutE({
          children: [
            makeMiddleRowAdaptiveLayoutE({
              children: {
                top: makeMiddleColAdaptiveLayoutE({
                  selector: '.mobius-width--100.mobius-padding--base.mobius-shadow--normal',
                  left: [
                    span('🔮'), span('.mobius-text--primary.mobius-padding-x--xs', ' Thoughts Bookmarklet')
                  ]
                }),
                middle: div(
                  '.mobius-size--fullpct.mobius-display--flex.mobius-layout__row',
                  [
                    div(
                      '.mobius-width--50.mobius-padding--xs',
                      withFullPct(liteBrowser)
                    ),
                    div(
                      '.mobius-width--50.mobius-padding--xs',
                      withFullPct(editor)
                    )
                  ])
              }
            })
          ],
          config: {
            stretchingChildren: true
          }
        })
      }))
  }
}

export { createPage }
