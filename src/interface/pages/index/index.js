import { of, map } from 'Libs/rx.js'
import { div } from 'MobiusUI'

const indexPage = source => {
  return {
    DOM: of(0).pipe(map(() => div('gggg')))
  }
}

export { indexPage }
