# Vector.js

Simple immutable 2D vector class, written in TypeScript. Type declarations are included.

# Installation

```
$ npm install @ankr/vector
```

# Usage

See [tests](test/) for more info.
```
import { Vector } from '@ankr/vector';

const position = new Vector(3, 4);
const velocity = Vector.random().mul(2);

console.log(position.add(velocity).limit(10));
```
