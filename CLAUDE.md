# CLAUDE.md

Guidance for working in this repository.

## What this is

`@ankr/vector` is a small, dependency-free, immutable **2D** vector class written in TypeScript, published to npm as compiled ESM with type declarations. It was written as a learning exercise for the underlying vector maths, so keep implementations explicit and readable (write the formula out instead of using clever abstractions).

## Layout

- `src/Vector.ts`: the whole library. Exports `Vector` and `TAU` (`2π`).
- `src/index.ts`: package entry point, re-exports `{ TAU, Vector }`.
- `test/Vector.test.ts`: tests using the built-in `node:test` and `node:assert/strict`.
- `tsconfig.json`: type-checks `src/` and `test/` (no output). `tsconfig.build.json` extends it and compiles only `src/` to `dist/` with `.d.ts` files.
- `dist/`: build output, git-ignored, the only directory that gets published.
- `.github/workflows/`: CI, label enforcement, automated release, stale-bot.

## Commands

```sh
npm ci              # install dev dependencies (typescript, @types/node)
npm run typecheck   # tsc over src/ and test/
npm test            # node --test on test/**/*.test.ts, no build needed
npm run build       # tsc -p tsconfig.build.json → dist/
npm pack --dry-run  # check what gets published (runs the build via `prepack`)
```

Tests run the `.ts` sources directly using Node's built-in type stripping, so local development needs **Node >= 22.18** (CI uses Node 24). There are no runtime dependencies and no linter. CI runs typecheck, tests and build.

## Conventions

- **ES modules only** (`"type": "module"`). Relative imports use the **`.ts`** extension (`./Vector.ts`); `rewriteRelativeImportExtensions` turns them into `.js` in `dist/`.
- **Erasable TypeScript only** (`erasableSyntaxOnly`): no `enum`, `namespace`, parameter properties or other syntax that Node's type stripping can't handle. Use `import type` for type-only imports (`verbatimModuleSyntax`).
- **Style** (`.editorconfig`): 2-space indent, single quotes, LF line endings, final newline.
- **Every method gets a short doc comment** describing what it does. Types live in the signature, not in JSDoc tags; use `@throws` for errors.
- **Immutability:** `x` and `y` are `readonly` (compile time), and the constructor calls `Object.freeze(this)` (runtime, for JS users). Every operation returns a **new** `Vector` and never mutates `this`. New methods must follow this rule. At runtime, assigning to `x`/`y` throws a `TypeError` only when the *calling* code runs in strict mode. In sloppy-mode scripts the assignment is silently ignored. This is a known limitation: only a `Proxy` could make it always throw, and that would slow down every property access.
- **Naming:** whole-vector ops have short names (`add`, `sub`, `mul`, `div`, `negate`). Per-component variants add an `X`/`Y` suffix (`addX`, `mulY`, `negateX`, ...). Vector arguments are named `v` and scalar arguments `s`.
- **Screen coordinates (y-down):** `Vector.up` is `(0, -1)` and `Vector.down` is `(0, 1)`. Keep this in mind for anything involving direction or rotation.
- **No runtime type checks:** argument types are enforced by TypeScript, not checked on every call. Only invalid *values* are guarded (division by zero, negative `limit`).
- Static presets (`zero`, `up`, `down`, `left`, `right`) are **getters** that return a shared, cached instance (private static fields). That is safe only because vectors are frozen. `Vector.random()` is a static **method** (not a getter) because it returns a new random unit vector on every call.
- Since vectors are immutable, a method may return `this` when the result would be unchanged (see `limit`).

## Tests

- Tests import from `../src/index.ts` (the public entry point), not from `src/Vector.ts` directly.
- Tests are type-checked too. When a test deliberately does something the types forbid (for example assigning to a `readonly` field), mark the line with `// @ts-expect-error <reason>`.
- Use `equal`/`throws` from `node:assert/strict`. For floating-point results, the existing tests compare `toFixed(n)` strings.
- Every public method has a test. Keep tests deterministic: use fixed inputs, and for `Vector.random()` only assert properties (for example magnitude 1).

## Release process

Releases are automated, so **don't run `npm version` or `npm publish` by hand**.

- Every PR to `main` must carry exactly one label: `major`, `minor`, `patch` or `skip-release` (enforced by `ensure-labels.yml`).
- When the PR is merged, `release.yml` runs `npm version <label>`, pushes the commit and tag to `main`, and runs `npm publish`. This is where the bare `1.0.x` version commits in the history come from.
- Publishing uses **npm trusted publishing (OIDC)**: no npm token is stored, and `release.yml` must stay the workflow configured as trusted publisher on npmjs.com. Provenance requires `package.json`'s `repository.url` to match the GitHub repo (`ankr/vector.js`, lowercase).
- If the version bump was pushed but `npm publish` failed, **don't re-run the failed job** (it would bump again). Run the workflow manually (`gh workflow run release.yml`), which publishes the current version on `main` without bumping.
- `npm publish` builds `dist/` through the `prepack` script, so the release workflow has no separate build step. Published files: `dist/` (`files`), plus `package.json`, `README.md` and `LICENSE`, which npm always includes. `exports` points both `types` and `default` at `dist/index.*`.
