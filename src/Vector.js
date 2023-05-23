const TAU = Math.PI * 2;

export { TAU };

/**
 * Simple "immutable" vector class
 */
export class Vector {
  /**
   * Constructor
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;

    Object.freeze(this);
  }

  /**
   * Zero vector
   *
   * @return {Vector}
   */
  static get zero() {
    return new Vector(0, 0);
  }

  /**
   * Up vector
   *
   * @return {Vector}
   */
  static get up() {
    return new Vector(0, -1);
  }

  /**
   * Down vector
   *
   * @return {Vector}
   */
  static get down() {
    return new Vector(0, 1);
  }

  /**
   * Left vector
   *
   * @return {Vector}
   */
  static get left() {
    return new Vector(-1, 0);
  }

  /**
   * Right vector
   *
   * @return {Vector}
   */
  static get right() {
    return new Vector(1, 0);
  }

  /**
   * Unit vector in random direction
   *
   * @return {Vector}
   */
  static get random() {
    return Vector.fromAngle(TAU * Math.random());
  }

  /**
   * Unit vector from angle
   *
   * @return {Vector}
   */
  static fromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  /**
   * Set X value
   *
   * @param {number} x
   * @return {Vector}
   */
  setX(x) {
    return new Vector(x, this.y);
  }

  /**
   * Set Y value
   *
   * @param {number} y
   * @return {Vector}
   */
  setY(y) {
    return new Vector(this.x, y);
  }

  /**
   * Add vector
   *
   * @param {Vector} v
   * @return {Vector}
   */
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  /**
   * Add scalar to X
   *
   * @param {number} s
   * @return {Vector}
   */
  addX(s) {
    return new Vector(this.x + s, this.y);
  }

  /**
   * Add scalar to Y
   *
   * @param {number} s
   * @return {Vector}
   */
  addY(s) {
    return new Vector(this.x, this.y + s);
  }

  /**
   * Subtract vector
   *
   * @param {Vector} v
   * @return {Vector}
   */
  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  /**
   * Subtract scalar from X
   *
   * @param {number} s
   * @return {Vector}
   */
  subX(s) {
    return new Vector(this.x - s, this.y);
  }

  /**
   * Subtract scalar from Y
   *
   * @param {number} s
   * @return {Vector}
   */
  subY(s) {
    return new Vector(this.x, this.y - s);
  }

  /**
   * Multiply with scalar
   *
   * @param {number} s
   * @return {Vector}
   */
  mul(s) {
    return new Vector(this.x * s, this.y * s);
  }

  /**
   * Multiply X with scalar
   *
   * @param {number} s
   * @return {Vector}
   */
  mulX(s) {
    return new Vector(this.x * s, this.y);
  }

  /**
   * Multiply Y with scalar
   *
   * @param {number} s
   * @return {Vector}
   */
  mulY(s) {
    return new Vector(this.x, this.y * s);
  }

  /**
   * Divide by scalar
   *
   * @param {number} s
   * @return {Vector}
   */
  div(s) {
    if (s === 0) {
      throw new Error('Can not divide vector with zero.');
    }

    return new Vector(this.x / s, this.y / s);
  }

  /**
   * Divide X by scalar
   *
   * @param {number} s
   * @return {Vector}
   */
  divX(s) {
    return new Vector(this.x / s, this.y);
  }

  /**
   * Divide Y by scalar
   *
   * @param {number} s
   * @return {Vector}
   */
  divY(s) {
    return new Vector(this.x, this.y / s);
  }

  /**
   * Get magnitude
   *
   * @return {number}
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get magnitude squared
   *
   * @return {number}
   */
  magSq() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Normalize current vector
   *
   * @return {Vector}
   */
  unit() {
    return this.div(this.mag());
  }

  /**
   * Get normal vector
   *
   * @return {Vector}
   */
  normal() {
    return new Vector(-this.y, this.x);
  }

  /**
   * Get dot product of current and given vector
   *
   * @param {Vector} v
   * @return {number}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Negate vector values
   *
   * @return {Vector}
   */
  negate() {
    return new Vector(-this.x, -this.y);
  }

  /**
   * Negate X value
   *
   * @return {Vector}
   */
  negateX() {
    return new Vector(-this.x, this.y);
  }

  /**
   * Negate Y value
   *
   * @return {Vector}
   */
  negateY() {
    return new Vector(this.x, -this.y);
  }

  /**
   * Test if vector equals current
   *
   * @param {Vector} v
   * @return {boolean}
   */
  equals(v) {
    return this.x === v.x && this.y === v.y;
  }

  /**
   * Swap vector values
   *
   * @return {Vector}
   */
  swap() {
    return new Vector(this.y, this.x);
  }

  /**
   * Get angle from X axis.
   *
   * @return {number}
   */
  angle() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Distance to other vector
   *
   * @param {Vector} v
   * @return {number}
   */
  distance(v) {
    const x = this.x - v.x;
    const y = this.y - v.y;

    return Math.sqrt(x * x + y * y);
  }

  /**
   * Limit magnitude to scalar
   *
   * @param {number} l
   * @return {Vector}
   */
  limit(l) {
    const mag = this.mag();
    let x = this.x;
    let y = this.y;

    if (mag > l) {
      x = (x * l) / mag;
      y = (y * l) / mag;
    }

    return new Vector(x, y);
  }
}
