import { indexPage } from 'Interface/pages/index/index.js'
import { createPage } from 'Interface/pages/create/create.js'

const app = source => {
  return createPage(source)
}

export { app }
