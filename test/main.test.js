const nps = require('path')
const fs = require('fs')
const { transform } = require('@babel/core')

function fixture(name) {
  return nps.join(__dirname, 'fixture', name)
}

function read(name) {
  return fs.readFileSync(fixture(name), { encoding: 'utf8' })
}

function transformTest(name, opts, { plugins = [], ...rest } = {}) {
  return transform(read(name), {
    plugins: [[require('../src'), opts]].concat(plugins),
    babelrc: false,
    ...rest
  })
}

describe('main', function() {
  describe('scope', () => {
    it('case 1', function() {
      expect(transformTest('scope/func.js').code).toMatchSnapshot()
    })
  })

  // describe('unused', () => {
  //   it('JSX', () => {
  //     expect(
  //       transformTest('unused/JSX.js', {}, { presets: [require.resolve('@babel/preset-react')] }).code
  //     ).toMatchSnapshot()
  //   })

  //   it('VariableDeclarator', () => {
  //     expect(transformTest('unused/VariableDeclarator.js', {}).code).toMatchSnapshot()
  //   })

  //   it('MemberExpression', () => {
  //     expect(transformTest('unused/MemberExpression.js').code).toMatchInlineSnapshot(`
  //       "const ref = {};
  //       const x = ref.Tab;"
  //     `)
  //   })

  // })

  // describe('used', () => {
  //   it('JSX', function() {
  //     expect(transformTest('used/JSX.js', {}, { presets: ['@babel/preset-react'] }).code).toMatchInlineSnapshot(`
  //       "import Tab from 'tab';
  //       const comp = /*#__PURE__*/React.createElement(Tab, null);"
  //     `)
  //   })

  //   it('ObjectProperty-computed', function() {
  //     expect(transformTest('used/ObjectProperty-computed.js', {}).code).toMatchInlineSnapshot(`
  //       "import Tab from 'tab';
  //       export const x = {
  //         [Tab]: 'abc',
  //         ...{
  //           a: '2'
  //         }
  //       };"
  //     `)
  //   })

  // })
})
