const { expect } = require('chai')
const {doSomething} = require('../index')

describe('dummy test', () => {

  it('should add 2', () => {
    expect(doSomething(2)).to.be.equal(4)
  })
})