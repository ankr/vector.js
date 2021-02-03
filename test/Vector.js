import * as mocha from '../node_modules/mocha/index.js';
import * as chai from '../node_modules/chai/index.js';

const assert = chai.default.assert;
const should = chai.default.should();
const expect = chai.default.expect;

describe('when something happens', () => {
  it('add should do something', () => {
    assert.equal(3, 3);
  });
});
