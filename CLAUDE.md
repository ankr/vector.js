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
- **Immutability:** the constructor calls `Object.freeze(this)`. Every operation returns a **new** `Vector` and never mutates `this`. New methods must follow this rule. Assigning to `x`/`y` throws a `TypeError` only when the *calling* code runs in strict mode (ES modules always do). In sloppy-mode scripts the assignment is silently ignored. This is a known limitation: only a `Proxy` could make it always throw, and that would slow down every property access.
- **Naming:** whole-vector ops have short names (`add`, `sub`, `mul`, `div`, `negate`). Per-component variants add an `X`/`Y` suffix (`addX`, `mulY`, `negateX`, ...). Vector arguments are named `v` and scalar arguments `s`.
- **Screen coordinates (y-down):** `Vector.up` is `(0, -1)` and `Vector.down` is `(0, 1)`. Keep this in mind for anything involving direction or rotation.
- **No runtime type checks:** argument types are left to typing, not checked on every call. Only invalid *values* are guarded (division by zero, negative `limit`).
- Static presets (`zero`, `up`, `down`, `left`, `right`) are **getters** that return a shared, cached instance (private static fields). That is safe only because vectors are frozen. `Vector.random` is also a getter but returns a new random unit vector on every access.
- Since vectors are immutable, a method may return `this` when the result would be unchanged (see `limit`).

## Tests

- Tests import from `../index.js` (the public entry point), not from `src/` directly.
- Use `equal`/`throws` from `node:assert/strict`. For floating-point results, the existing tests compare `toFixed(n)` strings.
- Every public method has a test. Keep tests deterministic: use fixed inputs, and for `Vector.random` only assert properties (for example magnitude 1).

## Release process

Releases are automated, so **don't run `npm version` or `npm publish` by hand**.

- Every PR to `main` must carry exactly one label: `major`, `minor`, `patch` or `skip-release` (enforced by `ensure-labels.yml`).
- When the PR is merged, `release.yml` runs `npm version <label>`, pushes the commit and tag to `main`, and runs `npm publish`. This is where the bare `1.0.x` version commits in the history come from.
- Published files: `package.json`'s `files` lists only `src/Vector.js`. npm also adds `index.js` (as `main`), `README.md` and `LICENSE` automatically.
