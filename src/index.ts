/**
 * Deterministic random number generators from a seed.
 */

export interface PRNGState {
  seed: number;
  advance(): void;
  float(): number;
}

/**
 * Mulberry32 PRNG: 32-bit seed, fast, low statistical quality.
 */
export class Mulberry32 {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0; // Ensure 32-bit
  }

  /**
   * Generate next random 32-bit integer.
   */
  nextInt(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generate random float [0, 1).
   */
  float(): number {
    return this.nextInt();
  }

  /**
   * Generate random integer [min, max] inclusive.
   */
  int(min: number, max: number): number {
    return Math.floor(this.float() * (max - min + 1)) + min;
  }

  /**
   * Pick random item from array.
   */
  pick<T>(items: T[]): T {
    return items[Math.floor(this.float() * items.length)];
  }

  /**
   * Weighted pick (items with weights).
   */
  weightedPick<T>(items: T[], weights: number[]): T {
    const sum = weights.reduce((a, b) => a + b, 0);
    let rand = this.float() * sum;
    for (let i = 0; i < items.length; i++) {
      rand -= weights[i];
      if (rand <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  /**
   * Fisher-Yates shuffle.
   */
  shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.float() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Sample n items without replacement.
   */
  sample<T>(items: T[], n: number): T[] {
    const shuffled = this.shuffle(items);
    return shuffled.slice(0, n);
  }

  /**
   * Gaussian (normal) distribution via Box-Muller.
   */
  gaussian(): number {
    const u1 = this.float();
    const u2 = this.float();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  /**
   * Fork: return new generator with independent seed.
   */
  fork(childSeed: number): Mulberry32 {
    return new Mulberry32(this.seed ^ childSeed);
  }
}

/**
 * Xoshiro128** PRNG: 128-bit state, better statistical quality.
 */
export class Xoshiro128 {
  private state: [number, number, number, number];

  constructor(seed: number) {
    // Initialize state from single seed
    let s = seed >>> 0;
    this.state = [s, s, s, s];
    // Advance a few times to break correlation
    for (let i = 0; i < 8; i++) this.next();
  }

  private next(): number {
    const s = this.state;
    const result = Math.imul(s[1] * 5, 1) >>> 0;
    const t = (s[1] << 9) | (s[1] >>> 23);

    s[2] ^= s[0];
    s[3] ^= s[1];
    s[1] ^= s[2];
    s[0] ^= s[3];
    s[2] ^= t;
    s[3] = ((s[3] << 11) | (s[3] >>> 21)) >>> 0;

    return result / 4294967296;
  }

  /**
   * Generate random float [0, 1).
   */
  float(): number {
    return this.next();
  }

  /**
   * Generate random integer [min, max] inclusive.
   */
  int(min: number, max: number): number {
    return Math.floor(this.float() * (max - min + 1)) + min;
  }

  /**
   * Pick random item.
   */
  pick<T>(items: T[]): T {
    return items[Math.floor(this.float() * items.length)];
  }

  /**
   * Shuffle array.
   */
  shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.float() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Fork with independent seed.
   */
  fork(childSeed: number): Xoshiro128 {
    const gen = new Xoshiro128(childSeed);
    return gen;
  }
}
