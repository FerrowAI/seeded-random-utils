const { Mulberry32, Xoshiro128 } = require('../dist/index');

console.log('=== seeded-random-utils demo ===\n');

// Test determinism: same seed = same sequence
const gen1 = new Mulberry32(42);
const val1 = gen1.float();
const int1 = gen1.int(1, 100);

const gen2 = new Mulberry32(42);
const val2 = gen2.float();
const int2 = gen2.int(1, 100);

console.log('Determinism test (Mulberry32):');
console.log('Match float:', val1 === val2);
console.log('Match int:', int1 === int2);

// Test different seeds give different results
const gen3 = new Mulberry32(123);
const val3 = gen3.float();
console.log('Different seed differs:', val1 !== val3);

// Test Xoshiro128
const gen4 = new Xoshiro128(42);
const picks = [gen4.pick(['a', 'b', 'c']), gen4.float().toFixed(2), gen4.int(1, 10)];
console.log('Xoshiro128 pick/float/int:', picks);

// Test shuffle
const arr = [1, 2, 3, 4, 5];
const gen5 = new Mulberry32(999);
const shuffled = gen5.shuffle(arr);
console.log('Shuffled array differs from original:', JSON.stringify(shuffled) !== JSON.stringify(arr));

console.log('✓ Demo complete');
