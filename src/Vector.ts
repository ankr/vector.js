export const TAU = Math.PI * 2;

/**
 * Simple immutable 2D vector
 *
 * Uses screen coordinates: y points down, so `Vector.up` is `(0, -1)`.
 */
export class Vector {
  // Vectors are frozen, so the presets can safely be shared instances
  static readonly #zero = new Vector(0, 0);
  static readonly #up = new Vector(0, -1);
  static readonly #down = new Vector(0, 1);
  static readonly #left = new Vector(-1, 0);
  static readonly #right = new Vector(1, 0);

  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    Object.freeze(this);
  }

  /**
   * Zero vector
   */
  static get zero(): Vector {
    return Vector.#zero;
  }

  /**
   * Up vector
   */
  static get up(): Vector {
    return Vector.#up;
  }

  /**
   * Down vector
   */
  static get down(): Vector {
    return Vector.#down;
  }

  /**
   * Left vector
   */
  static get left(): Vector {
    return Vector.#left;
  }

  /**
   * Right vector
   */
  static get right(): Vector {
    return Vector.#right;
  }

  /**
   * Unit vector in random direction
   */
  static random(): Vector {
    return Vector.fromAngle(TAU * Math.random());
  }

  /**
   * Unit vector from angle (in radians, measured from the X axis)
   */
  static fromAngle(angle: number): Vector {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  /**
   * Set X value
   */
  setX(x: number): Vector {
    return new Vector(x, this.y);
  }

  /**
   * Set Y value
   */
  setY(y: number): Vector {
    return new Vector(this.x, y);
  }

  /**
   * Add vector
   */
  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  /**
   * Add scalar to X
   */
  addX(s: number): Vector {
    return new Vector(this.x + s, this.y);
  }

  /**
   * Add scalar to Y
   */
  addY(s: number): Vector {
    return new Vector(this.x, this.y + s);
  }

  /**
   * Subtract vector
   */
  sub(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  /**
   * Subtract scalar from X
   */
  subX(s: number): Vector {
    return new Vector(this.x - s, this.y);
  }

  /**
   * Subtract scalar from Y
   */
  subY(s: number): Vector {
    return new Vector(this.x, this.y - s);
  }

  /**
   * Multiply with scalar
   */
  mul(s: number): Vector {
    return new Vector(this.x * s, this.y * s);
  }

  /**
   * Multiply X with scalar
   */
  mulX(s: number): Vector {
    return new Vector(this.x * s, this.y);
  }

  /**
   * Multiply Y with scalar
   */
  mulY(s: number): Vector {
    return new Vector(this.x, this.y * s);
  }

  /**
   * Divide by scalar
   *
   * @throws {Error} When dividing by zero
   */
  div(s: number): Vector {
    if (s === 0) {
      throw new Error('Can not divide vector with zero.');
    }

    return new Vector(this.x / s, this.y / s);
  }

  /**
   * Divide X by scalar
   *
   * @throws {Error} When dividing by zero
   */
  divX(s: number): Vector {
    if (s === 0) {
      throw new Error('Can not divide vector with zero.');
    }

    return new Vector(this.x / s, this.y);
  }

  /**
   * Divide Y by scalar
   *
   * @throws {Error} When dividing by zero
   */
  divY(s: number): Vector {
    if (s === 0) {
      throw new Error('Can not divide vector with zero.');
    }

    return new Vector(this.x, this.y / s);
  }

  /**
   * Get magnitude
   */
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get magnitude squared
   */
  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Normalize current vector
   *
   * The zero vector has no direction, so it is returned unchanged.
   */
  unit(): Vector {
    const mag = this.mag();

    if (mag === 0) {
      return Vector.zero;
    }

    return this.div(mag);
  }

  /**
   * Get normal vector
   *
   * Rotates the vector 90 degrees: (x, y) becomes (-y, x). This is
   * counter-clockwise in maths (y-up) coordinates, and therefore clockwise
   * on screen, where y points down (see `Vector.up`).
   */
  normal(): Vector {
    return new Vector(-this.y, this.x);
  }

  /**
   * Get dot product of current and given vector
   */
  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Negate vector values
   */
  negate(): Vector {
    return new Vector(-this.x, -this.y);
  }

  /**
   * Negate X value
   */
  negateX(): Vector {
    return new Vector(-this.x, this.y);
  }

  /**
   * Negate Y value
   */
  negateY(): Vector {
    return new Vector(this.x, -this.y);
  }

  /**
   * Test if vector equals current
   *
   * Each component may differ by at most `epsilon`, which defaults to 0
   * (exact match). Pass a small tolerance when comparing results of
   * floating-point calculations.
   */
  equals(v: Vector, epsilon = 0): boolean {
    return (
      (this.x === v.x || Math.abs(this.x - v.x) <= epsilon) &&
      (this.y === v.y || Math.abs(this.y - v.y) <= epsilon)
    );
  }

  /**
   * Swap vector values
   */
  swap(): Vector {
    return new Vector(this.y, this.x);
  }

  /**
   * Get angle from X axis, in radians within (-π, π]
   */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Distance to other vector
   */
  distance(v: Vector): number {
    const x = this.x - v.x;
    const y = this.y - v.y;

    return Math.sqrt(x * x + y * y);
  }

  /**
   * Limit magnitude to scalar
   *
   * @throws {RangeError} When the limit is negative
   */
  limit(l: number): Vector {
    if (l < 0) {
      throw new RangeError('Can not limit vector to a negative magnitude.');
    }

    const magSq = this.magSq();

    // Compare squared magnitudes to skip the square root when within the limit
    if (magSq <= l * l) {
      return this;
    }

    const mag = Math.sqrt(magSq);

    return new Vector((this.x * l) / mag, (this.y * l) / mag);
  }
}
