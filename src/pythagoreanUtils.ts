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

export const calculateDigitalRoot = (numStr: string): number | null => {
  // Filter out non-numeric characters and convert to array of numbers
  const numbers = numStr
    .split('')
    .filter(char => !isNaN(parseInt(char)))
    .map(Number);

  if (numbers.length === 0) return null;

  // Initial sum
  let sum = numbers.reduce((acc, curr) => acc + curr, 0);

  // Preserve master numbers 11 and 22
  if (sum === 11 || sum === 22) return sum;

  // Keep reducing until we get a single digit
  while (sum > 9) {
    sum = String(sum)
      .split('')
      .map(Number)
      .reduce((acc, curr) => acc + curr, 0);

    // Preserve if master number arises during reduction
    if (sum === 11 || sum === 22) return sum;
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
export const cipherCycle = async (numeroCipher: string, resonance: number): Promise<string> => {

  const digits = numeroCipher.split('').map(Number);

  // create a sha256 hash of the input numeroCipher 
  const hash = await sha256Hash(numeroCipher);
  const BigIntHash = BigInt('0x' + hash);

  const evolved: number[] = [];
  
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    let newDigit = calculateDigitalRoot((BigIntHash / BigInt((digit + resonance + i) * resonance)).toString());
    
    if (newDigit === null) {
      throw new Error(`Invalid digit encountered: ${digit}`);
    }

    if (newDigit === 11) newDigit = 2; // Treat master number 11 as 2
    if (newDigit === 22) newDigit = 4; // Treat master number 22 as 4
    
    evolved.push(newDigit);
  }
  
  return evolved.join('');
}

// export const calculatePythagoreanNumber = (input: string | number): number => {
//   let numStr = String(input).match(/\d/g)?.join('') || ''; // only keep the digits
//   // continually sum the digits until a single digit is reached
//   while (numStr.length > 1) {
//     // if not a master number, sum the digits
//     if (numStr !== '11' && numStr !== '22' && numStr !== '33') {
//       numStr = numStr.split('').reduce((acc, char) => acc + parseInt(char), 0).toString();
//     }
//   }
//   return parseInt(numStr);
// };

// export const guessPythagoreanWord = (input: string | number): string => {
//   // create a word by turning the input numbers into the corresponding letters
//   const word = input.toString().split('').map(char => Object.keys(numerologyMap).find((key) => numerologyMap[key] === parseInt(char)) || char).join('');
//   return word;
// };

// export const guessPythagoreanWord = (input: string | number, augment: number = 0): string => {
//   const words = input.toString().split(" ");
//   const guessedWords: string[] = [];
//   words.forEach((word) => {
//     const digitalRoot = calculateDigitalRoot(word);
//     // for each letter in the word, get it's possible letters from the numerologyMap
//     let wordGuess = "";
//     word.split("").forEach((letter) => {
//       if(letter === "0") {
//         wordGuess += "0";
//         return;
//       }
//       // get the key of the matches in the numerologyMap
//       const matches = Object.keys(numerologyMap).filter((key) => numerologyMap[key] === parseInt(letter));
//       if(digitalRoot) {
//         // then, cycle through the matches, using the digitalRoot to select the correct letter
//         const selectedLetter = matches[(digitalRoot + augment) % matches.length];
//         wordGuess += selectedLetter;
//       } else {
//         wordGuess += letter;
//       }
//     });

//     guessedWords.push(wordGuess);


//   });
//   return guessedWords.join(" ");
// };

// uses numerocipher to influence output selected characters
export const guessPythagoreanWord = (input: string | number, augment: number = 0): string => {
  const words = input.toString().split(" ");
  const guessedWords: string[] = [];
  
  // Pre-calculate a distribution pattern from the entire input
  const fullDigitSequence = input.toString().replace(/\s/g, '').split('').map(Number);
  
  words.forEach((word, wordIndex) => {
    const digitalRoot = calculateDigitalRoot(word);
    let wordGuess = "";
    let globalLetterIndex = 0;
    
    // Calculate starting position in global sequence
    for(let i = 0; i < wordIndex; i++) {
      globalLetterIndex += words[i].length;
    }
    
    word.split("").forEach((letter) => {
      if(letter === "0") {
        wordGuess += "0";
        globalLetterIndex++;
        return;
      }
      
      const matches = Object.keys(numerologyMap).filter((key) => 
        numerologyMap[key] === parseInt(letter)
      );
      
      if(digitalRoot && matches.length > 0) {
        // Use surrounding context for selection
        const prevDigit = fullDigitSequence[globalLetterIndex - 1] || 0;
        const nextDigit = fullDigitSequence[globalLetterIndex + 1] || 0;
        const currentDigit = parseInt(letter);
        
        const contextualSeed = (
          digitalRoot + 
          augment +
          prevDigit * 5 +
          nextDigit * 7 +
          currentDigit * 11 +
          globalLetterIndex * 3
        );
        
        const selectedLetter = matches[contextualSeed % matches.length];
        wordGuess += selectedLetter;
      } else {
        wordGuess += letter;
      }
      
      globalLetterIndex++;
    });

    guessedWords.push(wordGuess);
  });
  
  return guessedWords.join(" ");
};

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