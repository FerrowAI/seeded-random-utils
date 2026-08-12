# seeded-random-utils

Deterministic random number generators (Mulberry32, Xoshiro128) with sampling, shuffle, weighted pick, and gaussian.

## What & Why

Generate reproducible randomness from a seed for tests, simulations, and procedural generation. Two PRNGs: Mulberry32 (fast, lower quality) and Xoshiro128 (better statistics). Same seed produces identical sequences; fork for independent substreams.

## API

```typescript
export class Mulberry32 { constructor(seed: number); float(): number; int(min, max): number; pick(items): T; shuffle(items): T[]; sample(items, n): T[]; gaussian(): number; fork(childSeed): Mulberry32 }
export class Xoshiro128 { similar methods }
```

## Install

```bash
npm install seeded-random-utils
```

## Quick Start

```typescript
import { Mulberry32 } from 'seeded-random-utils';

const gen = new Mulberry32(42);
console.log(gen.float()); // 0.627...
console.log(gen.int(1, 10)); // 5

const gen2 = new Mulberry32(42);
console.log(gen2.float()); // 0.627... (same)

const colors = ['red', 'green', 'blue'];
console.log(gen.pick(colors)); // 'blue'
console.log(gen.shuffle(colors)); // shuffled
```

## Limits

- Not cryptographically secure; do not use for security.
- Mulberry32 has lower statistical quality; use Xoshiro128 for simulations requiring better distribution.
- Gaussian is approximate via Box-Muller transform.

---
Part of the [ferrow-toolkit](https://github.com/Ruzylo-cloud/ferrow-toolkit) collection · Sponsored by [Ferrow](https://ferrow.ai)
