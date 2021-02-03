import * as mocha from '../node_modules/mocha/index.js';
import * as chai from '../node_modules/chai/index.js';
import Vector from '../index.js';

// Setup chai to work with es6 modules
const assert = chai.default.assert;
const should = chai.default.should();
const expect = chai.default.expect;

// This should also be detected as a Vector
class ChildVector extends Vector {}

// List of values that should not be detected as Vectors
const notVectors = [
  null,
  undefined,
  '',
  'foo',
  1,
  0,
  -1,
  {},
  new String('foo'),
  new Number(1),
];

describe('Vector properties', () => {
  it('should be immutable', () => {
    const v = new Vector(1, 2);

    expect(() => v.x = 2).to.throw();
    expect(() => v.y = 3).to.throw();
  });
});

describe('Constructor', () => {
  it('should create from two numbers', () => {
    const v = new Vector(1, 2);

    expect(v.x).to.equal(1);
    expect(v.y).to.equal(2);
  });
});

describe('Static methods', () => {
  it('should have static methods for directions', () => {
    const up = Vector.up;
    expect(up.x).to.equal(0);
    expect(up.y).to.equal(-1);

    const down = Vector.down;
    expect(down.x).to.equal(0);
    expect(down.y).to.equal(1);

    const left = Vector.left;
    expect(left.x).to.equal(-1);
    expect(left.y).to.equal(0);

    const right = Vector.right;
    expect(right.x).to.equal(1);
    expect(right.y).to.equal(0);

    const zero = Vector.zero;
    expect(zero.x).to.equal(0);
    expect(zero.y).to.equal(0);
  });
});

describe("Vector", () => {
  it('should have basic setters for x and y', () => {
    const v = new Vector(2, 2);

    const x = v.setX(10);
    expect(x.x).to.equal(10);
    expect(x.y).to.equal(2);

    const y = v.setY(5);
    expect(y.x).to.equal(2);
    expect(y.y).to.equal(5);
  });

  it('should be able to add vectors and scalars', () => {
    const v1 = new Vector(2, 3);
    const v2 = v1.add(new Vector(4, 5));

    expect(v2.x).to.equal(6);
    expect(v2.y).to.equal(8);

    const v3 = v2.addX(10);
    expect(v3.x).to.equal(16);
    expect(v3.y).to.equal(8);

    const v4 = v2.addY(5);
    expect(v4.x).to.equal(6);
    expect(v4.y).to.equal(13);
  });

  it('should be able to subtract vectors and scalars', () => {
    const v1 = new Vector(2, 3);
    const v2 = v1.sub(new Vector(4, 5));

    expect(v2.x).to.equal(-2);
    expect(v2.y).to.equal(-2);

    const v3 = v2.subX(10);
    expect(v3.x).to.equal(-12);
    expect(v3.y).to.equal(-2);

    const v4 = v2.subY(5);
    expect(v4.x).to.equal(-2);
    expect(v4.y).to.equal(-7);
  });

  it('should be able to multiple with scalar', () => {
    const v1 = new Vector(3, 4);
    const v2 = v1.mul(3);

    expect(v2.x).to.equal(9);
    expect(v2.y).to.equal(12);
  });

  it('should be able to divide with scalar', () => {
    const v1 = new Vector(3, 4.5);
    const v2 = v1.div(3);

    expect(v2.x).to.equal(1);
    expect(v2.y).to.equal(1.5);
  });

  it('should be able to calculate magnitude', () => {
    const v1 = new Vector(3, 4);
    expect(v1.mag()).to.equal(5);
    expect(v1.magSq()).to.equal(25);
  });

  it('should be able to normalize vector', () => {
    const v1 = new Vector(3, 4);
    expect(v1.unit().mag()).to.equal(1);
  });

  it('should be able to get the normal to a vector', () => {
    const v1 = new Vector(3, 4);
    const n = v1.normal();

    expect(n.x).to.equal(-4);
    expect(n.y).to.equal(3);
  });

  it('should return the dot product for two vectors', () => {
    const v1 = new Vector(3, 5);
    const d = v1.dot(new Vector(4, 2));

    expect(d).to.equal(22);
  });

  it('should negate vector components', () => {
    const v1 = new Vector(3, 5);
    const v2 = v1.negate();

    expect(v2.x).to.equal(-3);
    expect(v2.y).to.equal(-5);

    const v3 = v1.negateX();
    expect(v3.x).to.equal(-3);
    expect(v3.y).to.equal(5);

    const v4 = v1.negateY();
    expect(v4.x).to.equal(3);
    expect(v4.y).to.equal(-5);
  });

  it('should swap components', () => {
    const v1 = new Vector(3, 5);
    const v2 = v1.swap();

    expect(v2.x).to.equal(5);
    expect(v2.y).to.equal(3);
  });

  it('should negate values', () => {
    const v1 = new Vector(3, 5);
    const v2 = v1.negate();

    expect(v2.x).to.equal(-3);
    expect(v2.y).to.equal(-5);
  });

  it('should calculate distance to other vector', () => {
    const v1 = new Vector(3, 5);
    const d = v1.distance(new Vector(4, 8));

    expect(d.toFixed(3)).to.equal('3.162');
  });

  it('should limit vector magnitude', () => {
    const v1 = new Vector(
      Math.random() * 1000,
      Math.random() * 1000
    );
    const v2 = v1.limit(2);

    expect(v2.mag().toFixed(1)).to.equal('2.0');
  });
});
