// Mapping of letters to numbers
export const numerologyMap: Record<string, number> = {
  A: 1,
  J: 1,
  S: 1,
  B: 2,
  K: 2,
  T: 2,
  C: 3,
  L: 3,
  U: 3,
  D: 4,
  M: 4,
  V: 4,
  E: 5,
  N: 5,
  W: 5,
  F: 6,
  O: 6,
  X: 6,
  G: 7,
  P: 7,
  Y: 7,
  H: 8,
  Q: 8,
  Z: 8,
  I: 9,
  R: 9,
};

export const convertToNumbers = (text: string): string => {
  // if the provided string contains NO letters and IS all numbers, return it as is
  if (/^[0-9\s]+$/.test(text)) {
    return text;
  }

  return text
    .toUpperCase()
    .split("")
    .map((char) => numerologyMap[char] || char)
    .join("");
};

/**
 * Low-level Pythagorean numerology configuration.
 * Derived automatically from {@link TauTongueConfig} — consumers
 * should not need to construct this directly.
 */
export interface PythagoreanConfig {
  /** Map of digital-root keys to archetype names. Keys that appear here are treated as valid reduction endpoints. */
  archetypes: Record<number, string>;
  /** Numbers that halt digital-root reduction (default: `[11, 22]`). */
  typalNumbers?: number[];
}

/** Default typal (master) numbers in classical Pythagorean numerology. */
export const DEFAULT_TYPAL_NUMBERS: number[] = [11, 22];

export const calculateDigitalRoot = (numStr: string, config?: PythagoreanConfig): number | null => {
  // Filter out non-numeric characters and convert to array of numbers
  const numbers = numStr
    .split('')
    .filter(char => !isNaN(parseInt(char)))
    .map(Number);

  if (numbers.length === 0) return null;

  const isValidRoot = (n: number): boolean => {
    if (config) {
      return config.archetypes[n] !== undefined ||
             (config.typalNumbers ?? DEFAULT_TYPAL_NUMBERS).includes(n);
    }
    return n < 10 || n === 11 || n === 22; // backward compat default
  };

  // Initial sum
  let sum = numbers.reduce((acc, curr) => acc + curr, 0);

  // Keep reducing until we get a valid root
  while (!isValidRoot(sum)) {
    sum = String(sum)
      .split('')
      .map(Number)
      .reduce((acc, curr) => acc + curr, 0);
  }

  return sum;
};

export function integerStringFromBase36(bs: string): string {
  let result = 0n;
  const base  = 36n;

  for (const ch of bs.toUpperCase()) {
    const code = ch.charCodeAt(0);
    // ‘0’–‘9’ → 0–9, ‘A’–‘Z’ → 10–35
    const digit =
      code >= 48 && code <= 57 ? BigInt(code - 48)
    : code >= 65 && code <= 90 ? BigInt(code - 65 + 10)
    : (() => { throw new Error(`Invalid base36 digit “${ch}”`) })();

    result = result * base + digit;
  }

  return result.toString();
}

/**
 * SHA-256 hash that works in both Node.js and browser environments
 */
async function sha256Hash(input: string): Promise<string> {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Node.js environment - dynamically import hash-wasm
  const { sha256 } = await import('hash-wasm');
  return sha256(input);
}

/**
 * Cipher cycling - evolve the numerical signature
 */
export const cipherCycle = async (numeroCipher: string, resonance: number, config?: PythagoreanConfig): Promise<string> => {

  const digits = numeroCipher.split('').map(Number);

  // create a sha256 hash of the input numeroCipher 
  const hash = await sha256Hash(numeroCipher);
  const BigIntHash = BigInt('0x' + hash);

  const evolved: number[] = [];
  
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    let newDigit = calculateDigitalRoot((BigIntHash / BigInt((digit + resonance + i) * resonance)).toString(), config);
    
    if (newDigit === null) {
      throw new Error(`Invalid digit encountered: ${digit}`);
    }

    if (!config) {
      if (newDigit === 11) newDigit = 2; // Treat master number 11 as 2
      if (newDigit === 22) newDigit = 4; // Treat master number 22 as 4
    } else {
      const typal = config.typalNumbers ?? DEFAULT_TYPAL_NUMBERS;
      if (typal.includes(newDigit) && config.archetypes[newDigit] === undefined) {
        // collapse typal numbers to single-digit equivalents
        while (newDigit > 9) {
          newDigit = String(newDigit).split('').map(Number).reduce((a, b) => a + b, 0);
        }
      }
    }
    
    evolved.push(newDigit);
  }
  
  return evolved.join('');
}



/**
 * Extract braid digits from a tau-tongue equation string.
 * @param equation - tau-tongue equation string
 * @returns Braid digits as a string
 */
export const extractBraidDigits = (equation: string): string => {
  // extract braid from equation (every digit between the [ and ] characters)
  const braidMatch = equation.match(/\[(.*?)\]/);
  return braidMatch ? braidMatch[1].replace(/\D/g, '') : '';
};