import { describe, it } from 'node:test';
import { equal, throws } from 'node:assert/strict';

import { Vector } from '../index.js';

describe('Vector properties', () => {
  it('should be immutable', () => {
    const v = new Vector(1, 2);

    throws(() => (v.x = 2));
    throws(() => (v.y = 3));
  });
});

describe('Constructor', () => {
  it('should create from two numbers', () => {
    const v = new Vector(1, 2);

    equal(v.x, 1);
    equal(v.y, 2);
  });
});

describe('Static methods', () => {
  it('should have static methods for directions', () => {
    const up = Vector.up;
    equal(up.x, 0);
    equal(up.y, -1);

    const down = Vector.down;
    equal(down.x, 0);
    equal(down.y, 1);

    const left = Vector.left;
    equal(left.x, -1);
    equal(left.y, 0);

    const right = Vector.right;
    equal(right.x, 1);
    equal(right.y, 0);

    const zero = Vector.zero;
    equal(zero.x, 0);
    equal(zero.y, 0);
  });

  it('should create unit vector from angle', () => {
    const v = Vector.fromAngle(Math.PI / 2);

    equal(v.x.toFixed(3), '0.000');
    equal(v.y, 1);
    equal(Vector.fromAngle(0).equals(Vector.right), true);
  });

  it('should create random unit vector', () => {
    const v = Vector.random;

    equal(v.mag().toFixed(3), '1.000');
  });
});

describe('Vector', () => {
  it('should have basic setters for x and y', () => {
    const v = new Vector(2, 2);

    const x = v.setX(10);
    equal(x.x, 10);
    equal(x.y, 2);

    const y = v.setY(5);
    equal(y.x, 2);
    equal(y.y, 5);
  });

  it('should be able to add vectors and scalars', () => {
    const v1 = new Vector(2, 3);
    const v2 = v1.add(new Vector(4, 5));

    equal(v2.x, 6);
    equal(v2.y, 8);

    const v3 = v2.addX(10);
    equal(v3.x, 16);
    equal(v3.y, 8);

    const v4 = v2.addY(5);
    equal(v4.x, 6);
    equal(v4.y, 13);
  });

  it('should be able to subtract vectors and scalars', () => {
    const v1 = new Vector(2, 3);
    const v2 = v1.sub(new Vector(4, 5));

    equal(v2.x, -2);
    equal(v2.y, -2);

    const v3 = v2.subX(10);
    equal(v3.x, -12);
    equal(v3.y, -2);

    const v4 = v2.subY(5);
    equal(v4.x, -2);
    equal(v4.y, -7);
  });

  it('should be able to multiple with scalar', () => {
    const v1 = new Vector(3, 4);
    const v2 = v1.mul(3);

    equal(v2.x, 9);
    equal(v2.y, 12);

    const v3 = v1.mulX(2);
    equal(v3.x, 6);
    equal(v3.y, 4);

    const v4 = v1.mulY(2);
    equal(v4.x, 3);
    equal(v4.y, 8);
  });

  it('should be able to divide with scalar', () => {
    const v1 = new Vector(3, 4.5);
    const v2 = v1.div(3);

    equal(v2.x, 1);
    equal(v2.y, 1.5);

    const v3 = v1.divX(3);
    equal(v3.x, 1);
    equal(v3.y, 4.5);

    const v4 = v1.divY(3);
    equal(v4.x, 3);
    equal(v4.y, 1.5);
  });

  it('should throw error when dividing with zero', () => {
    const v1 = new Vector(3, 4);
    throws(() => v1.div(0));
    throws(() => v1.divX(0));
    throws(() => v1.divY(0));
  });

  it('should be able to calculate magnitude', () => {
    const v1 = new Vector(3, 4);
    equal(v1.mag(), 5);
    equal(v1.magSq(), 25);
  });

  it('should be able to normalize vector', () => {
    const v1 = new Vector(3, 4);
    equal(v1.unit().mag(), 1);
  });

  it('should return zero vector when normalizing zero vector', () => {
    const v = Vector.zero.unit();

    equal(v.x, 0);
    equal(v.y, 0);
  });

  it('should test equality', () => {
    const v1 = new Vector(3, 5);

    equal(v1.equals(new Vector(3, 5)), true);
    equal(v1.equals(new Vector(3, 6)), false);
    equal(v1.equals(new Vector(4, 5)), false);
  });

  it('should test equality within epsilon', () => {
    const v1 = new Vector(0.1 + 0.2, 1);
    const v2 = new Vector(0.3, 1);

    equal(v1.equals(v2), false);
    equal(v1.equals(v2, 1e-9), true);
    equal(v1.equals(new Vector(0.4, 1), 1e-9), false);
  });

  it('should be able to get the normal to a vector', () => {
    const v1 = new Vector(3, 4);
    const n = v1.normal();

    equal(n.x, -4);
    equal(n.y, 3);
  });

  it('should return the dot product for two vectors', () => {
    const v1 = new Vector(3, 5);
    const d = v1.dot(new Vector(4, 2));

    equal(d, 22);
  });

  it('should negate vector components', () => {
    const v1 = new Vector(3, 5);
    const v2 = v1.negate();

    equal(v2.x, -3);
    equal(v2.y, -5);

    const v3 = v1.negateX();
    equal(v3.x, -3);
    equal(v3.y, 5);

    const v4 = v1.negateY();
    equal(v4.x, 3);
    equal(v4.y, -5);
  });

  it('should swap components', () => {
    const v1 = new Vector(3, 5);
    const v2 = v1.swap();

    equal(v2.x, 5);
    equal(v2.y, 3);
  });

  it('should return angle', () => {
    const v = new Vector(1, 1);
    const a = v.angle();

    equal(a, Math.PI / 4);
  });

  it('should negate values', () => {
    const v1 = new Vector(3, 5);
    const v2 = v1.negate();

    equal(v2.x, -3);
    equal(v2.y, -5);
  });

  it('should calculate distance to other vector', () => {
    const v1 = new Vector(3, 5);
    const d = v1.distance(new Vector(4, 8));

    equal(d.toFixed(3), '3.162');
  });

  it('should limit vector magnitude', () => {
    const v1 = new Vector(300, 400);
    const v2 = v1.limit(2);

    equal(v2.mag(), 2);
    equal(v2.x, 1.2);
    equal(v2.y, 1.6);
  });

  it('should not change vector shorter than limit', () => {
    const v1 = new Vector(3, 4);
    const v2 = v1.limit(10);

    equal(v2.x, 3);
    equal(v2.y, 4);
  });
});
