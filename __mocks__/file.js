// fileTransformer.js
import path from 'path'

export default {
  process(src, filename) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
  }
}
