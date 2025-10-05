// phonemicGenerator.ts

// Reverse mapping: number to possible letters
const reverseNumerologyMap: { [key: number]: string[] } = {
  1: ['A', 'J', 'S'],
  2: ['B', 'K', 'T'],
  3: ['C', 'L', 'U'],
  4: ['D', 'M', 'V'],
  5: ['E', 'N', 'W'],
  6: ['F', 'O', 'X'],
  7: ['G', 'P', 'Y'],
  8: ['H', 'Q', 'Z'],
  9: ['I', 'R']
};

const calculateDigitalRoot = (input: string): number => {
  const sum = input.split('').reduce((acc, char) => {
    const num = parseInt(char);
    return isNaN(num) ? acc : acc + num;
  }, 0);
  
  if (sum === 11 || sum === 22) return sum;
  return sum < 10 ? sum : calculateDigitalRoot(sum.toString());
};

const isVowel = (char: string): boolean => 'AEIOUYW'.includes(char.toUpperCase());

const getCharacterType = (char: string): 'vowel' | 'consonant' | 'other' => {
  if (isVowel(char)) return 'vowel';
  if (/[BCDFGHJKLMNPQRSTVXZ]/i.test(char)) return 'consonant';
  return 'other';
};



const selectCharacterBySyllable = (
  options: string[],
  seed: number,
  expectedType: 'vowel' | 'consonant' | 'any',
  context: { prev?: string; position: number }
): string => {
  // Filter by expected type
  let filteredOptions = options;
  if (expectedType !== 'any') {
    filteredOptions = options.filter(char => getCharacterType(char) === expectedType);
  }
  
  // If no options match, fall back to all options
  if (filteredOptions.length === 0) {
    filteredOptions = options;
  }
  
  // Avoid repetition
  if (context.prev) {
    const nonRepeating = filteredOptions.filter(char => char !== context.prev);
    if (nonRepeating.length > 0) {
      filteredOptions = nonRepeating;
    }
  }
  
  // Deterministic selection
  const index = ((seed * 7919) % filteredOptions.length + filteredOptions.length) % filteredOptions.length;
  return filteredOptions[index];
};



const generateSinglePhonemeticName = (numeroCipher: string, augment: number = 0): string => {
  if (!numeroCipher || numeroCipher.length === 0) return '';
  
  const digitalRoot = calculateDigitalRoot(numeroCipher);
  let result = '';
  
  for (let i = 0; i < numeroCipher.length; i++) {
    const digit = parseInt(numeroCipher[i]);
    if (isNaN(digit) || digit === 0) {
      result += numeroCipher[i];
      continue;
    }
    
    const options = reverseNumerologyMap[digit] || [];
    if (options.length === 0) {
      result += numeroCipher[i];
      continue;
    }
    
    // Determine what type of character we want based on position in syllable
    let expectedType: 'vowel' | 'consonant' | 'any' = 'any';
    const positionInSyllable = i % 3; // Simple 3-beat syllable pattern
    
    if (positionInSyllable === 0) {
      expectedType = result.length === 0 ? 'consonant' : 'any'; // Prefer consonants at start
    } else if (positionInSyllable === 1) {
      expectedType = 'vowel'; // Prefer vowels in middle
    } else {
      expectedType = 'consonant'; // Prefer consonants at end
    }
    
    const seed = (digitalRoot * 13) + (augment * 97) + (i * 17) + (digit * 23);
    const context = {
      prev: result[result.length - 1],
      position: i
    };
    
    const selectedChar = selectCharacterBySyllable(options, seed, expectedType, context);
    result += selectedChar;
  }
  
  return result;
};


/**
 * Generate multiple phonemic variations from a numerocipher
 * @param input - The numerocipher string
 * @param augment - Base augment value for variation
 * @param results - Number of results to generate (default: 10)
 * @returns Array of phonemic strings
 */
export const guessPythagoreanWord = (
  input: string, 
  augment: number = 0, 
  results: number = 10
): string[] => {
  const variations: string[] = [];
  
  for (let i = 0; i < results; i++) {
    const currentAugment = augment + (i * 13); // Larger step between variations
    const variation = generateSinglePhonemeticName(input, currentAugment);
    variations.push(variation);
  }
  
  return variations;
};