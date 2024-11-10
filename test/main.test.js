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
      expect(transformTest('scope/case1.js').code).toMatchSnapshot()
    })
  })

  describe('unused', () => {
    it('condition false expression', () => {
      expect(transformTest('unused/condition-false-expression.js').code).toMatchInlineSnapshot(`
        "const isX = false;
        const A = {};
        const A2 = {};
        const A3 = {};
        const A4 = {};
        const A5 = {},
          A51 = {};"
      `)
    })

    it('condition false literal expression', () => {
      expect(transformTest('unused/condition-false-literal-expression.js').code).toMatchInlineSnapshot(`
        "const A = {};
        const A2 = {};
        const A3 = {};
        const A4 = {},
          A41 = {};"
      `)
    })

    it('if false statement', () => {
      expect(transformTest('unused/if-false-statement.js').code).toMatchInlineSnapshot(`
        "const isX = false;
        {}
        {}
        {}
        if (x && 2 && true) {} else {}"
      `)
    })

    it('if false literal statement', () => {
      expect(transformTest('unused/if-false-literal-statement.js').code).toMatchInlineSnapshot(`
        "{}
        {}
        {}
        if (x && 2 && true) {} else {}"
      `)
    })

    it('condition true expression', () => {
      expect(transformTest('unused/condition-true-expression.js').code).toMatchInlineSnapshot(`
        "const isX = true;
        const A = {};
        const A2 = {};
        const A3 = {};
        const A4 = {};
        const A5 = {},
          A51 = {};"
      `)
    })

    it('condition true literal expression', () => {
      expect(transformTest('unused/condition-true-literal-expression.js').code).toMatchInlineSnapshot(`
        "const A = {};
        const A2 = {};
        const A3 = {};
        const A4 = {},
          A41 = {};"
      `)
    })

    it('if true statement', () => {
      expect(transformTest('unused/if-true-statement.js').code).toMatchInlineSnapshot(`
        "const isX = true;
        {}
        {}
        {}
        {}"
      `)
    })

    it('if true literal statement', () => {
      expect(transformTest('unused/if-true-literal-statement.js').code).toMatchInlineSnapshot(`
        "{}
        {}
        {}
        {}
        {}"
      `)
    })

    it('fix case1', () => {
      expect(transformTest('unused/fix-case1.js').code).toMatchInlineSnapshot(`
        "const isWeb = false;
        const isMiniApp = true;
        if (isTaobao && isUniApp && isShowUniAppTab && isdowngrade) {
          type = 'tab';
        } else if (isTaobao && isUniApp && isShowUniAppTab) {
          type = 'holder';
        }"
      `)
    })
  })

  describe('used', () => {
    it('condition-slide-effects-false-expression', function() {
      expect(transformTest('used/condition-slide-effects-false-expression.js').code).toMatchSnapshot()
    })

    it('condition-slide-effects-false-literal-expression', function() {
      expect(transformTest('used/condition-slide-effects-false-literal-expression.js').code).toMatchSnapshot()
    })

    it('if-slide-effects-false-statement', function() {
      expect(transformTest('used/if-slide-effects-false-statement.js').code).toMatchSnapshot()
    })

    it('if-slide-effects-false-literal-statement', function() {
      expect(transformTest('used/if-slide-effects-false-literal-statement.js').code).toMatchSnapshot()
    })

    it('condition-slide-effects-true-expression', function() {
      expect(transformTest('used/condition-slide-effects-true-expression.js').code).toMatchSnapshot()
    })

    it('condition-slide-effects-true-literal-expression', function() {
      expect(transformTest('used/condition-slide-effects-true-literal-expression.js').code).toMatchSnapshot()
    })

    it('if-slide-effects-true-statement', function() {
      expect(transformTest('used/if-slide-effects-true-statement.js').code).toMatchSnapshot()
    })

    it('if-slide-effects-true-literal-statement', function() {
      expect(transformTest('used/if-slide-effects-true-literal-statement.js').code).toMatchSnapshot()
    })
  })
})
