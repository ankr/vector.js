# CLAUDE.md

Guidance for working in this repository.

## What this is

`@ankr/vector` is a small, dependency-free, "immutable" **2D** vector class, published to npm. It was written as a learning exercise for the underlying vector maths, so keep implementations explicit and readable (write the formula out instead of using clever abstractions).

## Layout

- `src/Vector.js`: the whole library. Exports `Vector` and `TAU` (`2π`).
- `index.js`: package entry point, re-exports `{ TAU, Vector }` from `src/Vector.js`.
- `test/Vector.js`: tests using the built-in `node:test` and `node:assert/strict`.
- `.github/workflows/`: CI, label enforcement, automated release, stale-bot.

## Commands

```sh
npm test            # runs `node --test` (auto-discovers test/*.js)
npm pack --dry-run  # check what gets published
```

There are no dependencies, no build step and no linter. CI runs `npm test` on Node 20.x.

## Conventions

- **ES modules only** (`"type": "module"`). Use `import`/`export` and include the `.js` extension in relative imports.
- **Style** (`.editorconfig`): 2-space indent, single quotes, LF line endings, final newline.
- **Every method gets a JSDoc block** with `@param`/`@return` types, matching the existing ones.
- **Immutability:** the constructor calls `Object.freeze(this)`. Every operation returns a **new** `Vector` and never mutates `this`. New methods must follow this rule. Assigning to `x`/`y` throws only because ES module code runs in strict mode; in sloppy mode the assignment would silently fail.
- **Naming:** whole-vector ops have short names (`add`, `sub`, `mul`, `div`, `negate`). Per-component variants add an `X`/`Y` suffix (`addX`, `mulY`, `negateX`, ...). Vector arguments are named `v` and scalar arguments `s`.
- **Screen coordinates (y-down):** `Vector.up` is `(0, -1)` and `Vector.down` is `(0, 1)`. Keep this in mind for anything involving direction or rotation.
- Static presets (`zero`, `up`, `down`, `left`, `right`, `random`) are **getters** that return a fresh instance on every access. `random` is a unit vector at a random angle.

## Maths notes and quirks

Check these before changing behaviour:

- `div(s)` throws when `s === 0`, but `divX`/`divY` do **not** guard against zero; they return `Infinity`/`NaN`.
- `unit()` is `this.div(this.mag())`, so normalizing the zero vector **throws**.
- `normal()` returns `(-y, x)`. That is a 90° counter-clockwise rotation in maths (y-up) coordinates, which looks clockwise on screen because y points down.
- `angle()` uses `Math.atan2(y, x)` and returns a value in `(-π, π]`. `fromAngle(a)` gives `(cos a, sin a)`, the inverse for unit vectors.
- `equals(v)` uses strict `===` on both components with **no epsilon**. Floating-point results (for example after `fromAngle`) rarely compare equal.
- `limit(l)` scales the vector down only when `mag > l` and never scales it up.
- `distance(v)` reimplements the magnitude formula inline instead of calling `this.sub(v).mag()`, which avoids allocating a temporary vector.
- Methods do not validate their arguments. Non-numbers or non-Vectors produce `NaN`.

## Tests

- Tests import from `../index.js` (the public entry point), not from `src/` directly.
- Use `equal`/`throws` from `node:assert/strict`. For floating-point results, the existing tests compare `toFixed(n)` strings.
- Not covered yet: `mulX`, `mulY`, `divX`, `divY`, `fromAngle`, `random`, `equals`, and `unit()` on the zero vector. The `limit` test uses random input.

## Release process

Releases are automated, so **don't run `npm version` or `npm publish` by hand**.

- Every PR to `main` must carry exactly one label: `major`, `minor`, `patch` or `skip-release` (enforced by `ensure-labels.yml`).
- When the PR is merged, `release.yml` runs `npm version <label>`, pushes the commit and tag to `main`, and runs `npm publish`. This is where the bare `1.0.x` version commits in the history come from.
- Published files: `package.json`'s `files` lists only `src/Vector.js`. npm also adds `index.js` (as `main`), `README.md` and `LICENSE` automatically.
