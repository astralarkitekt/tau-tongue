import { getSymbol, getSymbols } from './TauTongueSymbolMap.js';
import { renderTauSpiral, type TauInput } from './TauTongueRenderer.js';
import { calculateDigitalRoot, convertToNumbers as convertToNumbersPythagorean } from '../pythagoreanUtils.js';
import { guessPythagoreanWord } from '../phonemeCipher.js';
// import symbolMapData from './symbol-map.json';

export interface TauTongueResult {
  input: string;
  numeroCipher: number[];
  alphaCipher?: string[];
  digitalSum: number;
  resonance: string;
  resonanceMeaning: string;
  archetype: string;
  archetypeDescription: string;
  symbolicEquation: string;
  crucible: string;
  crucibleDescription: string;
  braid: BraidInterpretation[];
  inflectionPoints: InflectionPoint[];
  interpretation: string;
  wordCount: number;
  charCount: number;
  narrativeInterpretation: string;
}

export interface BraidInterpretation {
  equation: string;
  description: string;
}

export interface InflectionPoint {
  braidIndex: number;
  digitIndex: number;
  digit: string;
  interferenceDigit: string;
}

export interface RenderOptions {
  cycles?: number;
  width?: number;
  height?: number;
  padding?: number;
  noLabels?: boolean;
  noPoints?: boolean;
  strokeWidth?: number;
}

export class TauTongueInterpreter {
  private readonly archetypeMap: Record<number, string> = {
    1: 'The Dreamweaver',
    2: 'The Recursivist',
    3: 'The Architect',
    4: 'The Oracle',
    5: 'The Catalyst',
    6: 'The Empath',
    7: 'The Archivist',
    8: 'The Mechanist',
    9: 'The Alchemist',
    11: 'The Weaver of Fields',
    22: 'The Mask Maker'
  };

  private readonly archetypeDescriptions: Record<string, string> = {
    'The Dreamweaver': 'One who weaves dreams into reality, connecting the unseen world with the visible.',
    'The Recursivist': 'One who sees patterns within patterns, creating self-referential systems.',
    'The Architect': 'One who designs and builds structures, bringing order to chaos.',
    'The Oracle': 'One who sees beyond the veil of time, perceiving future potentials.',
    'The Catalyst': 'One who initiates change and transformation, sparking new possibilities.',
    'The Empath': 'One who resonates with the emotions and energies of others, creating harmony.',
    'The Archivist': 'One who preserves knowledge and wisdom, maintaining continuity through time.',
    'The Mechanist': 'One who understands systems and mechanisms, creating order through structure.',
    'The Alchemist': 'One who transmutes base elements into refined expressions, finding wholeness.',
    'The Weaver of Fields': 'One who perceives the interconnected nature of all fields of knowledge.',
    'The Mask Maker': 'One who crafts identities and personas, revealing deeper truths through illusion.'
  };

  private readonly resonanceDescriptions: Record<string, string> = {
    'SOURCE': 'The origin point; unified consciousness; the beginning of all things.',
    'DUALITY': 'The division into pairs; balance; reflection; cooperation.',
    'CREATION': 'The spark of manifestation; expression; creativity; growth.',
    'STRUCTURE': 'Framework; order; stability; the form that holds the content.',
    'CHANGE': 'Transformation; adaptation; evolution; the flow of life.',
    'HARMONY': 'Balance; integration; cooperation; resonant frequency.',
    'MYSTERY': 'The unknowable; depth; spirituality; hidden knowledge.',
    'POWER': 'Manifestation; authority; transformation; capacity to effect change.',
    'FULFILLMENT': 'Completion; wholeness; achievement; integration of parts.',
    'VISION': 'Expanded awareness; prophecy; insight; seeing beyond the veil.',
    'MASTERWORK': 'The great work; mastery of form; transcendent creation.'
  };

  private readonly symbolMap: string[] = getSymbols();

  /**
   * Convert text to numbers using Pythagorean numerology
   */
  private convertToNumbers(text: string): number[] {
    return convertToNumbersPythagorean(text)
      .split('')
      .filter(char => !isNaN(Number(char)) && parseInt(char) > 0)
      .map(Number);
  }

  /**
   * Get symbolic meaning for a number
   */
  private getSymbolicMeaning(n: number): string {
    const lexicon: Record<number, string> = {
      1: 'SOURCE',
      2: 'DUALITY',
      3: 'CREATION',
      4: 'STRUCTURE',
      5: 'CHANGE',
      6: 'HARMONY',
      7: 'MYSTERY',
      8: 'POWER',
      9: 'FULFILLMENT',
      11: 'VISION',
      22: 'MASTERWORK'
    };
    return lexicon[n] || 'UNKNOWN';
  }

  /**
   * Reduce cipher to digital root
   */
  private reduceCipher(nums: number[]): number {
    const sum = nums.reduce((a, b) => a + b, 0);
    const digitalRoot = (n: number): number => {
      if (n === 11 || n === 22) return n;
      return n < 10 ? n : digitalRoot(n.toString().split('').reduce((a, b) => a + parseInt(b), 0));
    };
    return digitalRoot(sum);
  }

  /**
   * DEPRECATED: Generate symbolic operators equation
   */
  // private getSymbolicOperators(masterResonance: number, digits: number[]): string {
    
  //   const segments: string[] = [];
  //   let cursor = 0;
  //   let lastLength = masterResonance;
    
  //   while (cursor < digits.length) {
  //     const sliceLen = Math.max(1, lastLength + (lastLength % 2 === 0 ? -1 : 1));
  //     const chunk = digits.slice(cursor, cursor + sliceLen);
  //     if (chunk.length === 0) break;
  //     const index = parseInt(chunk.join('')) % this.symbolMap.length;
  //     const op = this.symbolMap[index];
  //     segments.push(this.wrap(op, chunk.join(',')));
  //     lastLength = chunk.length;
  //     cursor += sliceLen;
  //   }
    
  //   const outerOp = this.symbolMap[(digits.reduce((a, b) => a + b, 0) + masterResonance) % this.symbolMap.length];
  //   return this.wrap(outerOp, segments.join(','));
  // }

  private getSymbolicOperators(masterResonance: number, digits: number[]): string {
    const numeroCipher = [...digits]; // Create a proper copy
    const functions: string[] = [];
    let lastLength = masterResonance;

    while( digits.length > 0) {
      const selection = this.skipSelector(digits, lastLength, 0);
      const index = Number(BigInt(selection.result.join('')) % BigInt(this.symbolMap.length));
      const op = this.symbolMap[index];
      functions.push(this.wrap(op, selection.result.join(',')));
      digits = selection.digits;
      const digitalRoot = calculateDigitalRoot(selection.result.join(''));
      if(digitalRoot === null) {
        console.error("Digital root is null");
        throw new Error("Digital root is null");
      }
      lastLength = digitalRoot;
    }

    const outerOp = this.symbolMap[Number(BigInt(numeroCipher.join('')) % BigInt(this.symbolMap.length))];
    return this.wrap(outerOp, [ masterResonance, "[" + functions.join(',') + "]" ].join(','));
  }

  private wrap(func: string, args: string): string {
    return `${func}(${args})`;
  }

  /**
   * Skip selector for picking digits from the cipher to be used in the symbolic equation
   */
  private skipSelector(digits: number[], length: number, skipBy: number, startFromIndex: number = 0): { digits: number[], result: number[] } {
    const result: number[] = [];
    let index = startFromIndex;
    let skip = skipBy;
    if (startFromIndex < 0 || startFromIndex >= digits.length) {
      index = startFromIndex % digits.length;
    }

    if (length > digits.length) {
      length = digits.length;
    }

    while (result.length < length) {
      const currentResultLength = result.length;
      result.push(digits[index]);
      // filter the index out of the digits array
      digits = digits.filter((_, i) => i !== index);
      index = (index + skip) % digits.length;
      const digitalRoot = calculateDigitalRoot(result.reduce((a, b) => a + b, 0).toString());
      if(digitalRoot === null) {
        console.error("Digital root is null");
        throw new Error("Digital root is null");
      }
      skip = currentResultLength === 0 ? skipBy : skipBy + digitalRoot;
    }

    return {
      digits,
      result
    };
  }

  /**
   * Extract symbols from equation
   */
  private extractSymbols(equation: string): string[] {
    return Array.from(equation).filter(char => getSymbol(char));
  }

  /**
   * Generate symbolic interpretation of equation
   */
  private interpretEquation(equation: string): string {
    const symbols = this.extractSymbols(equation);
    if (symbols.length === 0) return "No recognizable symbols found.";
    
    let interpretation = "Your equation contains:\n\n";
    
    // Deduplicate symbols while preserving order
    const uniqueSymbols = Array.from(new Set(symbols));
    
    uniqueSymbols.forEach(symbol => {
      const desc = getSymbol(symbol);
      interpretation += `• ${symbol} (${desc.name}): ${desc.metaphoricalMeaning}\n`;
    });
    
    return interpretation;
  }

  /**
   * Generate narrative interpretation
   */
  private generateNarrativeInterpretation(equation: string, resonance: string, digitalSum: number, archetype: string): string {
    const symbols = this.extractSymbols(equation);
    const uniqueSymbols = Array.from(new Set(symbols));
    
    return (
      `Your phrase resonates with the energy of ${resonance.toLowerCase()}, \n` +
      `represented by the digital root ${digitalSum}. This places you in the archetypal \n` +
      `realm of ${archetype}. The symbolic equation reveals a pattern of` +
      (uniqueSymbols.length > 0 ? ` ${getSymbol(uniqueSymbols[0]).metaphoricalMeaning.toLowerCase()}` : ' hidden meanings') +
      (uniqueSymbols.length > 1 ? ` interwoven with ${getSymbol(uniqueSymbols[1]).metaphoricalMeaning.toLowerCase()}` : '') +
      (uniqueSymbols.length > 2 ? `, culminating in ${getSymbol(uniqueSymbols[uniqueSymbols.length-1]).metaphoricalMeaning.toLowerCase()}` : '') +
      `.`
    );
  }

  /**
   * Main interpretation method - processes input and returns all computed values
   */
  public interpret(input: string): TauTongueResult {
    const numeroCipher = this.convertToNumbers(input);
    const digitalSum = this.reduceCipher(numeroCipher);
    const resonance = this.getSymbolicMeaning(digitalSum);
    const archetype = this.archetypeMap[digitalSum] || 'The Unknown';
    const symbolicEquation = this.getSymbolicOperators(digitalSum, numeroCipher);
    const interpretation = this.interpretEquation(symbolicEquation); // needs refactoring
    const narrativeInterpretation = this.generateNarrativeInterpretation(symbolicEquation, resonance, digitalSum, archetype); // needs refactoring
    
    const crucible = this.getCrucible(symbolicEquation, digitalSum, resonance, archetype);
    const crucibleDescription = this.getFunctionDescription(crucible);
    const braid = this.getBraid(symbolicEquation).split('\n').map(line => {
      return { "equation": line, "description": this.getFunctionDescription(line) }
    });

    // Calculate word and character counts
    const wordCount = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const charCount = input.length;

    // get a string of characters for name-generation from the braid
    const braidCipher = this.getBraid(symbolicEquation).replace(/(?!(?:11|22|[0-9]))[^]/g, '');
    const alphaCipher = guessPythagoreanWord(braidCipher, digitalSum, 1);

    const result: TauTongueResult = {
      input,
      numeroCipher,
      alphaCipher,
      digitalSum,
      resonance,
      resonanceMeaning: this.resonanceDescriptions[resonance] || 'Unknown resonance',
      archetype,
      archetypeDescription: this.archetypeDescriptions[archetype] || 'Unknown archetype',
      symbolicEquation,
      interpretation,
      crucible,
      crucibleDescription,
      braid,
      inflectionPoints: [], // Will be populated below
      wordCount,
      charCount,
      narrativeInterpretation
    };

    // Analyze interference patterns
    result.inflectionPoints = this.analyzeInterference(result);

    return result;
  }

  private getFunctionDescription(func: string): string {
    // slice the symbol from the function string (0, 1)
    const crucibleOperator = func.slice(0, 1);
    // get the metaphorical meaning of the operator
    const operatorSymbol = getSymbol(crucibleOperator);
    if (!operatorSymbol) {
      return `Unknown operator: ${crucibleOperator}`;
    }

    // get the arguments of the function and strip all non-numeric characters
    // e.g. "f(1) SOURCE The Dreamweaver" -> "1"
    const args = func
      .slice(2, func.indexOf(')'))
      .split(',')
      .map(arg => arg.trim())
      .filter(arg => /^\d+$/.test(arg));

    let description = `A ${operatorSymbol.metaphoricalMeaning.split('; ')[1]} (${crucibleOperator}) acting upon `;
    // if there is only one argument, just use it to map to the archetype and append to description
    if (args.length === 1) {
      const argSymbol = this.archetypeMap[parseInt(args[0])];
      // if the argument is not found in the archetype map, return a default message
      description += argSymbol ? argSymbol : `Unknown argument: ${args[0]}`;
    } else {
      // loop through and suffix each with " becoming " unless it's the last one
      for (let i = 0; i < args.length; i++) {
        const argSymbol = this.archetypeMap[parseInt(args[i])];
        if (argSymbol) {
          description += argSymbol;
          if (i < args.length - 1) {
            description += ' becoming ';
          }
        } else {
          description += `Unknown argument: ${args[i]}`;
        }
      }
    }
    return description;
  }

  private getCrucible(symbolicEquation: string, digitalSum: number, resonance: string, archetype: string): string {
    // get the crucible operator from the symbolic equation
    const crucibleOperator = symbolicEquation.slice(0, 1);
    const masterResonance = digitalSum;
    const theme = resonance;

    return `${crucibleOperator}(${masterResonance}) ${theme}, ${archetype}`;
  }

  private getBraid(symbolicEquation: string): string {
    // the braid is enclosed in square brackets and includes everything between the square brackets
    const braid = symbolicEquation.slice(symbolicEquation.indexOf('[') + 1, symbolicEquation.indexOf(']')).replace(/\),/g, ")\n");
    return braid;
  }

  /**
   * Analyze interference between braid functions and the interference wave
   */
  public analyzeInterference(result: TauTongueResult): InflectionPoint[] {
    const inflectionPoints: InflectionPoint[] = [];
    const interferenceWave = this.getInterferenceWave(result);
    
    if (!interferenceWave || !result.braid || result.braid.length === 0) {
      return inflectionPoints;
    }

    // Loop through each braid function
    result.braid.forEach((braid, braidIndex) => {
      // Extract numeric digits 1-9 from the braid equation
      const braidDigits = braid.equation
        .split('')
        .filter(char => /[1-9]/.test(char));
      
      // Compare each digit with the interference wave
      braidDigits.forEach((digit, digitIndex) => {
        // Wrap around interference wave if braid is longer
        const interferenceIndex = digitIndex % interferenceWave.length;
        const interferenceDigit = interferenceWave[interferenceIndex];
        
        // Check for match
        if (digit === interferenceDigit) {
          inflectionPoints.push({
            braidIndex,
            digitIndex,
            digit,
            interferenceDigit
          });
        }
      });
    });

    return inflectionPoints;
  }

  /**
   * Calculate the Braid Interference Wave
   */
  public getInterferenceWave(result: TauTongueResult): string {
    if (!result.braid || result.braid.length === 0) {
      return '';
    }

    // Find the braid with the most parameters (longest equation)
    const longestBraid = result.braid.reduce((longest, current) => 
      current.equation.length > longest.equation.length ? current : longest
    );
    
    // Step 1: Filter to numbers 1-9 only (no zeroes)
    const numbersOnly = longestBraid.equation
      .split('')
      .filter(char => /[1-9]/.test(char))
      .join('');
    
    // Step 2: Explode into single character array
    const digitArray = numbersOnly.split('');
    
    // Step 3: Calculate digital root for each digit multiplied by equation's digital sum
    const equationDigitalSum = result.digitalSum;
    const transformedDigits = digitArray.map(digit => {
      const currentDigit = parseInt(digit);
      const product = equationDigitalSum * currentDigit;
      const digitalRoot = calculateDigitalRoot(product.toString());
      return digitalRoot?.toString() || digit;
    });
    
    // Step 4: Join the array
    return transformedDigits.join('');
  }

  /**
   * Render the tau spiral on a canvas
   */
  public render(canvas: HTMLCanvasElement, result: TauTongueResult, options: RenderOptions = {}): void {
    if (result.numeroCipher.length === 0) {
      // Clear canvas if no input
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Prepare TauInput for the renderer
    const tauInput: TauInput = {
      input: result.input,
      theme: result.digitalSum,
      cipher: result.numeroCipher,
      tauTongue: result.symbolicEquation,
      archetype: result.archetype,
      resonance: result.digitalSum
    };

    // Get the actual rendered size of the canvas container
    const container = canvas.parentElement;
    const width = options.width || (container ? container.clientWidth : 800);
    const height = options.height || (container ? container.clientHeight : 800);
    
    // Set canvas dimensions to match container
    canvas.width = width;
    canvas.height = height;
    
    // Render with the provided options
    renderTauSpiral(canvas, tauInput, { 
      cycles: options.cycles || result.digitalSum, 
      width, 
      height, 
      padding: options.padding || Math.min(width, height) * 0.05, // 5% padding relative to size
      
    });
  }
} 