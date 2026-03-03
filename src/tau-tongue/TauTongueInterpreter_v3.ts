import { DEFAULT_SYMBOL_MAP, type SymbolDefinition } from "./TauTongueSymbolMap.js";
import { renderTauSpiral, type TauInput } from "./TauTongueRenderer.js";
import {
  calculateDigitalRoot,
  convertToNumbers as convertToNumbersPythagorean,
  type PythagoreanConfig,
  DEFAULT_TYPAL_NUMBERS,
} from "../pythagoreanUtils.js";
// import symbolMapData from './symbol-map.json';

export interface TauTongueResult {
  input: string;
  numeroCipher: number[];
  digitalSum: number;
  resonance: string;
  resonanceMeaning: string;
  archetype: string;
  archetypeDescription: string;
  symbolicEquation: string;
  crucible: string;
  crucibleDescription: string;
  antagonist: TauTongueAntagonist;
  braid: BraidInterpretation[];
  inflectionPoints: InflectionPoint[];
  interpretation: string;
  wordCount: number;
  charCount: number;
  narrativeInterpretation: string;
}

export interface TauTongueAntagonist {
  braid: string;
  description: string;
  crucible: string;
  archetype: string;
  archetypeDescription: string;
  resonance: string;
  resonanceMeaning: string;
}

export interface BraidInterpretation {
  equation: string;
  description: string;
  hasInflectionPoint?: boolean;
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

export enum SceneFunction {
  ACTION = "action",
  EXPOSITION = "exposition",
  DIALOGUE = "dialogue",
  REFLECTION = "reflection",
  FLASHBACK = "flashback",
  CALLBACK = "callback",
  TRANSITION = "transition",
}

export interface NarrativePalette {
  dominant: SceneFunction;
  dominantWeight: number;
  secondary: SceneFunction | null;
  secondaryWeight: number | null;
  texture: { function: SceneFunction; weight: number }[];
  crucible: number;
}

// --- Exported default maps ---

/** Default archetype map — digital root → archetype name (BraidCraft system). */
export const DEFAULT_ARCHETYPE_MAP: Record<number, string> = {
  1: "The Dreamweaver",
  2: "The Recursivist",
  3: "The Architect",
  4: "The Oracle",
  5: "The Catalyst",
  6: "The Empath",
  7: "The Archivist",
  8: "The Mechanist",
  9: "The Alchemist",
  11: "The Weaver of Fields",
  22: "The Mask Maker",
};

/** Default archetype descriptions — archetype name → prose description (BraidCraft system). */
export const DEFAULT_ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  "The Dreamweaver":
    "One who weaves dreams into reality, connecting the unseen world with the visible.",
  "The Recursivist":
    "One who sees patterns within patterns, creating self-referential systems.",
  "The Architect":
    "One who designs and builds structures, bringing order to chaos.",
  "The Oracle":
    "One who sees beyond the veil of time, perceiving future potentials.",
  "The Catalyst":
    "One who initiates change and transformation, sparking new possibilities.",
  "The Empath":
    "One who resonates with the emotions and energies of others, creating harmony.",
  "The Archivist":
    "One who preserves knowledge and wisdom, maintaining continuity through time.",
  "The Mechanist":
    "One who understands systems and mechanisms, creating order through structure.",
  "The Alchemist":
    "One who transmutes base elements into refined expressions, finding wholeness.",
  "The Weaver of Fields":
    "One who perceives the interconnected nature of all fields of knowledge.",
  "The Mask Maker":
    "One who crafts identities and personas, revealing deeper truths through illusion.",
};

/** Default resonance map — digital root → resonance name (BraidCraft system). */
export const DEFAULT_RESONANCE_MAP: Record<number, string> = {
  1: "SOURCE",
  2: "DUALITY",
  3: "CREATION",
  4: "STRUCTURE",
  5: "CHANGE",
  6: "HARMONY",
  7: "MYSTERY",
  8: "POWER",
  9: "FULFILLMENT",
  11: "VISION",
  22: "MASTERWORK",
};

/** Default resonance descriptions — resonance name → prose description (BraidCraft system). */
export const DEFAULT_RESONANCE_DESCRIPTIONS: Record<string, string> = {
  SOURCE:
    "The origin point; unified consciousness; the beginning of all things.",
  DUALITY: "The division into pairs; balance; reflection; cooperation.",
  CREATION: "The spark of manifestation; expression; creativity; growth.",
  STRUCTURE: "Framework; order; stability; the form that holds the content.",
  CHANGE: "Transformation; adaptation; evolution; the flow of life.",
  HARMONY: "Balance; integration; cooperation; resonant frequency.",
  MYSTERY: "The unknowable; depth; spirituality; hidden knowledge.",
  POWER:
    "Manifestation; authority; transformation; capacity to effect change.",
  FULFILLMENT: "Completion; wholeness; achievement; integration of parts.",
  VISION: "Expanded awareness; prophecy; insight; seeing beyond the veil.",
  MASTERWORK: "The great work; mastery of form; transcendent creation.",
};

/** Default mapping from digital root → narrative scene function (BraidCraft system). */
export const DEFAULT_ARCHETYPE_FUNCTION_MAP: Record<number, SceneFunction> = {
  1: SceneFunction.EXPOSITION, // Dreamweaver
  2: SceneFunction.CALLBACK, // Recursivist
  3: SceneFunction.ACTION, // Architect
  4: SceneFunction.REFLECTION, // Oracle
  5: SceneFunction.ACTION, // Catalyst
  6: SceneFunction.DIALOGUE, // Empath
  7: SceneFunction.FLASHBACK, // Archivist
  8: SceneFunction.ACTION, // Mechanist
  9: SceneFunction.TRANSITION, // Alchemist
  11: SceneFunction.EXPOSITION, // Weaver of Fields
  22: SceneFunction.DIALOGUE, // Mask Maker
};

// --- Config interface ---

/**
 * Configuration object for the Tau-Tongue symbolic pipeline.
 *
 * Every field is optional — omitted fields fall back to the BraidCraft defaults.
 * Supply a complete config to operate the pipeline within an entirely custom
 * symbolic system (archetypes, resonances, operator algebra, typal numbers).
 *
 * @example
 * ```ts
 * const alchemical: TauTongueConfig = {
 *   archetypeMap: { 1: 'Sol', 2: 'Luna', 3: 'Mercurius', ... },
 *   resonanceMap: { 1: 'CALCINATION', 2: 'DISSOLUTION', ... },
 *   typalNumbers: [7, 12],
 * };
 * const interpreter = new TauTongueInterpreter(alchemical);
 * ```
 */
export interface TauTongueConfig {
  /** Digital root → archetype name. Keys define valid reduction endpoints. */
  archetypeMap?: Record<number, string>;
  /** Archetype name → prose description. */
  archetypeDescriptions?: Record<string, string>;
  /** Digital root → resonance label (e.g. `"SOURCE"`, `"CALCINATION"`). */
  resonanceMap?: Record<number, string>;
  /** Resonance label → prose description. */
  resonanceDescriptions?: Record<string, string>;
  /** Digital root → narrative scene function (used by TauSpine). */
  archetypeFunctionMap?: Record<number, SceneFunction>;
  /** Custom operator algebra — symbol → {@link SymbolDefinition}. */
  symbolMap?: Record<string, SymbolDefinition>;
  /** Numbers that halt digital-root reduction (default: `[11, 22]`). */
  typalNumbers?: number[];
}

export class TauTongueInterpreter {
  protected readonly archetypeMap: Record<number, string>;
  protected readonly archetypeDescriptions: Record<string, string>;
  protected readonly resonanceMap: Record<number, string>;
  protected readonly resonanceDescriptions: Record<string, string>;
  protected readonly ARCHETYPE_FUNCTION_MAP: Record<number, SceneFunction>;
  protected readonly pythagoreanConfig: PythagoreanConfig;
  protected readonly symbolMapData: Record<string, SymbolDefinition>;

  private readonly symbolKeys: string[];

  constructor(config: TauTongueConfig = {}) {
    this.archetypeMap = config.archetypeMap ?? DEFAULT_ARCHETYPE_MAP;
    this.archetypeDescriptions = config.archetypeDescriptions ?? DEFAULT_ARCHETYPE_DESCRIPTIONS;
    this.resonanceMap = config.resonanceMap ?? DEFAULT_RESONANCE_MAP;
    this.resonanceDescriptions = config.resonanceDescriptions ?? DEFAULT_RESONANCE_DESCRIPTIONS;
    this.ARCHETYPE_FUNCTION_MAP = config.archetypeFunctionMap ?? DEFAULT_ARCHETYPE_FUNCTION_MAP;
    this.symbolMapData = config.symbolMap ?? DEFAULT_SYMBOL_MAP;
    this.symbolKeys = Object.keys(this.symbolMapData);

    // Derived — consumer never touches this
    this.pythagoreanConfig = {
      archetypes: this.archetypeMap,
      typalNumbers: config.typalNumbers ?? DEFAULT_TYPAL_NUMBERS,
    };
  }

  /**
   * Get all symbol keys from the injected symbol map
   */
  public getSymbols(): string[] {
    return [...this.symbolKeys];
  }

  /**
   * Look up a symbol definition from the injected symbol map
   */
  public getSymbol(symbol: string): SymbolDefinition | undefined {
    return this.symbolMapData[symbol];
  }

  /**
   * Convert text to numbers using Pythagorean numerology
   */
  private convertToNumbers(text: string): number[] {
    return convertToNumbersPythagorean(text)
      .split("")
      .filter((char) => !isNaN(Number(char)) && parseInt(char) > 0)
      .map(Number);
  }

  /**
   * Get symbolic meaning for a number
   */
  protected getSymbolicMeaning(n: number): string {
    return this.resonanceMap[n] || "UNKNOWN";
  }

  /**
   * Reduce cipher to digital root
   */
  private reduceCipher(nums: number[]): number {
    const sum = nums.reduce((a, b) => a + b, 0);
    const result = calculateDigitalRoot(sum.toString(), this.pythagoreanConfig);
    if (result === null) {
      throw new Error("Digital root is null");
    }
    return result;
  }

  private getSymbolicOperators(
    masterResonance: number,
    digits: number[]
  ): string {
    const numeroCipher = [...digits]; // Create a proper copy
    const functions: string[] = [];
    let lastLength = masterResonance;

    while (digits.length > 0) {
      const selection = this.skipSelector(digits, lastLength, 0);
      const index = Number(
        BigInt(selection.result.join("")) % BigInt(this.symbolKeys.length)
      );
      const op = this.symbolKeys[index];
      functions.push(this.wrap(op, selection.result.join(",")));
      digits = selection.digits;
      const digitalRoot = calculateDigitalRoot(selection.result.join(""), this.pythagoreanConfig);
      if (digitalRoot === null) {
        console.error("Digital root is null");
        throw new Error("Digital root is null");
      }
      lastLength = digitalRoot;
    }

    const outerOp =
      this.symbolKeys[
        Number(BigInt(numeroCipher.join("")) % BigInt(this.symbolKeys.length))
      ];
    return this.wrap(
      outerOp,
      [masterResonance, "[" + functions.join(",") + "]"].join(",")
    );
  }

  private wrap(func: string, args: string): string {
    return `${func}(${args})`;
  }

  /**
   * Skip selector for picking digits from the cipher to be used in the symbolic equation
   */
  private skipSelector(
    digits: number[],
    length: number,
    skipBy: number,
    startFromIndex: number = 0
  ): { digits: number[]; result: number[] } {
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
      const digitalRoot = calculateDigitalRoot(
        result.reduce((a, b) => a + b, 0).toString(),
        this.pythagoreanConfig
      );
      if (digitalRoot === null) {
        console.error("Digital root is null");
        throw new Error("Digital root is null");
      }
      skip = currentResultLength === 0 ? skipBy : skipBy + digitalRoot;
    }

    return {
      digits,
      result,
    };
  }

  /**
   * Extract symbols from equation
   */
  private extractSymbols(equation: string): string[] {
    return Array.from(equation).filter((char) => this.getSymbol(char));
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

    uniqueSymbols.forEach((symbol) => {
      const desc = this.getSymbol(symbol);
      if (!desc) return;
      interpretation += `• ${symbol} (${desc.name}): ${desc.metaphoricalMeaning}\n`;
    });

    return interpretation;
  }

  /**
   * Generate narrative interpretation
   */
  private generateNarrativeInterpretation(
    equation: string,
    resonance: string,
    digitalSum: number,
    archetype: string
  ): string {
    const symbols = this.extractSymbols(equation);
    const uniqueSymbols = Array.from(new Set(symbols));

    return (
      `Your phrase resonates with the energy of ${resonance.toLowerCase()}, \n` +
      `represented by the digital root ${digitalSum}. This places you in the archetypal \n` +
      `realm of ${archetype}. The symbolic equation reveals a pattern of` +
      (uniqueSymbols.length > 0
        ? ` ${this.getSymbol(uniqueSymbols[0])?.metaphoricalMeaning.toLowerCase() ?? "hidden meanings"}`
        : " hidden meanings") +
      (uniqueSymbols.length > 1
        ? ` interwoven with ${this.getSymbol(
            uniqueSymbols[1]
          )?.metaphoricalMeaning.toLowerCase() ?? ""}`
        : "") +
      (uniqueSymbols.length > 2
        ? `, culminating in ${this.getSymbol(
            uniqueSymbols[uniqueSymbols.length - 1]
          )?.metaphoricalMeaning.toLowerCase() ?? ""}`
        : "") +
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
    const archetype = this.archetypeMap[digitalSum] || "The Unknown";
    const symbolicEquation = this.getSymbolicOperators(
      digitalSum,
      numeroCipher
    );
    const interpretation = this.interpretEquation(symbolicEquation); // needs refactoring
    const narrativeInterpretation = this.generateNarrativeInterpretation(
      symbolicEquation,
      resonance,
      digitalSum,
      archetype
    ); // needs refactoring

    const crucible = this.getCrucible(
      symbolicEquation,
      digitalSum,
      resonance,
      archetype
    );
    const crucibleDescription = this.getFunctionDescription(crucible);
    const braid = this.getBraid(symbolicEquation)
      .split("\n")
      .map((line) => {
        return {
          equation: line,
          description: this.getFunctionDescription(line),
        };
      });

    const antagonist = this.getAntagonist(symbolicEquation);

    // Calculate word and character counts
    const wordCount =
      input.trim() === "" ? 0 : input.trim().split(/\s+/).length;
    const charCount = input.length;

    const result: TauTongueResult = {
      input,
      numeroCipher,
      digitalSum,
      resonance,
      resonanceMeaning:
        this.resonanceDescriptions[resonance] || "Unknown resonance",
      archetype,
      archetypeDescription:
        this.archetypeDescriptions[archetype] || "Unknown archetype",
      symbolicEquation,
      interpretation,
      crucible,
      crucibleDescription,
      antagonist,
      braid,
      inflectionPoints: [], // Will be populated below
      wordCount,
      charCount,
      narrativeInterpretation,
    };

    // Analyze interference patterns
    result.inflectionPoints = this.analyzeInterference(result);

    return result;
  }

  public getFunctionDescription(func: string): string {
    // slice the symbol from the function string (0, 1)
    const crucibleOperator = func.slice(0, 1);
    // get the metaphorical meaning of the operator
    const operatorSymbol = this.getSymbol(crucibleOperator);
    if (!operatorSymbol) {
      return `Unknown operator: ${crucibleOperator}`;
    }

    // get the arguments of the function and strip all non-numeric characters
    // e.g. "f(1) SOURCE The Dreamweaver" -> "1"
    const args = func
      .slice(2, func.indexOf(")"))
      .split(",")
      .map((arg) => arg.trim())
      .filter((arg) => /^\d+$/.test(arg));

    let description = `A ${
      operatorSymbol.metaphoricalMeaning.split("; ")[1]
    } (${crucibleOperator}) acting upon `;
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
            description += " becoming ";
          }
        } else {
          description += `Unknown argument: ${args[i]}`;
        }
      }
    }
    return description;
  }

  public getCrucible(
    symbolicEquation: string,
    digitalSum: number,
    resonance: string,
    archetype: string
  ): string {
    // get the crucible operator from the symbolic equation
    const crucibleOperator = symbolicEquation.slice(0, 1);
    const masterResonance = digitalSum;
    const theme = resonance;

    const crucible = `${crucibleOperator}(${masterResonance})`;
    const description = this.getFunctionDescription(crucible);

    return crucible + " - " + description;
  }

  public getMicroCrucible(braidFunction: string): string {
    const operator = braidFunction.slice(0, 1);
    const braidDigits = braidFunction
      .split("")
      .filter((char) => /[1-9]/.test(char))
      .map(Number)
      .join("");
    const digitalRoot = calculateDigitalRoot(braidDigits, this.pythagoreanConfig);
    if (digitalRoot === null) {
      console.error("Digital root is null");
      throw new Error("Digital root is null");
    }

    const resonance = this.getSymbolicMeaning(digitalRoot);
    const archetype = this.archetypeMap[digitalRoot] || "The Unknown";

    return this.getCrucible(braidFunction, digitalRoot, resonance, archetype);
  }

  public getAntagonist(symbolicEquation: string): TauTongueAntagonist {
    // the antagonist is the LONGEST braid function in the symbolic equation
    const braid = this.getBraid(symbolicEquation).split("\n");
    let longestFunction = "";
    braid.forEach((func) => {
      if (func.length > longestFunction.length) {
        longestFunction = func;
      }
    });

    // get all digits from the longest function
    const antagonistDigits = longestFunction
      .split("")
      .filter((char) => /[1-9]/.test(char))
      .map(Number)
      .join("");

    const digitalRoot = calculateDigitalRoot(antagonistDigits, this.pythagoreanConfig);
    const resonance = this.getSymbolicMeaning(digitalRoot || 0);
    const resonanceMeaning =
      this.resonanceDescriptions[resonance] || "Unknown resonance";
    const archetype = this.archetypeMap[digitalRoot || 0] || "The Unknown";
    const archetypeDescription =
      this.archetypeDescriptions[archetype] || "Unknown archetype";

    return {
      braid: longestFunction,
      description: this.getFunctionDescription(longestFunction),
      crucible: this.getCrucible(
        longestFunction,
        digitalRoot || 0,
        resonance,
        archetype
      ),
      archetype,
      archetypeDescription,
      resonance,
      resonanceMeaning,
    };
  }

  private getBraid(symbolicEquation: string): string {
    // the braid is enclosed in square brackets and includes everything between the square brackets
    const braid = symbolicEquation
      .slice(symbolicEquation.indexOf("[") + 1, symbolicEquation.indexOf("]"))
      .replace(/\),/g, ")\n");
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
        .split("")
        .filter((char) => /[1-9]/.test(char));

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
            interferenceDigit,
          });
          result.braid[braidIndex].hasInflectionPoint = true;
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
      return "";
    }

    // Find the braid with the most parameters (longest equation)
    const longestBraid = result.braid.reduce((longest, current) =>
      current.equation.length > longest.equation.length ? current : longest
    );

    // Step 1: Filter to numbers 1-9 only (no zeroes)
    const numbersOnly = longestBraid.equation
      .split("")
      .filter((char) => /[1-9]/.test(char))
      .join("");

    // Step 2: Explode into single character array
    const digitArray = numbersOnly.split("");

    // Step 3: Calculate digital root for each digit multiplied by equation's digital sum
    const equationDigitalSum = result.digitalSum;
    const transformedDigits = digitArray.map((digit) => {
      const currentDigit = parseInt(digit);
      const product = equationDigitalSum * currentDigit;
      const digitalRoot = calculateDigitalRoot(product.toString(), this.pythagoreanConfig);
      return digitalRoot?.toString() || digit;
    });

    // Step 4: Join the array
    return transformedDigits.join("");
  }

  /**
   * Extract narrative palette from a braid string
   * Analyzes the distribution of scene functions and determines narrative composition
   */
  public extractNarrativePalette(braid: string): NarrativePalette {
    // Extract numerical digits from braid (1-9 only)
    const braidNumbers = this.extractBraidNumbers(braid);
    
    if (braidNumbers.length === 0) {
      throw new Error("No valid braid numbers found in braid string");
    }
    
    // Calculate crucible (digital root of braid numbers)
    const crucibleDigits = braidNumbers.join('');
    const crucible = calculateDigitalRoot(crucibleDigits, this.pythagoreanConfig);
    if (crucible === null) {
      throw new Error("Could not calculate crucible from braid");
    }
    
    // Count occurrences of each scene function
    const counts: Record<SceneFunction, number> = {
      [SceneFunction.ACTION]: 0,
      [SceneFunction.EXPOSITION]: 0,
      [SceneFunction.DIALOGUE]: 0,
      [SceneFunction.REFLECTION]: 0,
      [SceneFunction.FLASHBACK]: 0,
      [SceneFunction.CALLBACK]: 0,
      [SceneFunction.TRANSITION]: 0
    };
    
    braidNumbers.forEach(n => {
      const fn = this.ARCHETYPE_FUNCTION_MAP[n];
      if (fn) counts[fn]++;
    });
    
    // Convert to weights (percentages)
    const total = braidNumbers.length;
    const weights = Object.fromEntries(
      Object.entries(counts).map(([fn, count]) => [fn, count / total])
    ) as Record<SceneFunction, number>;
    
    // Sort by weight descending
    const sorted = Object.entries(weights)
      .filter(([_, weight]) => weight > 0)
      .sort((a, b) => b[1] - a[1]);
    
    // Determine dominant (use crucible for tiebreaking)
    const maxWeight = Math.max(...Object.values(weights));
    const tiedFunctions = Object.entries(weights)
      .filter(([_, weight]) => weight === maxWeight)
      .map(([fn]) => fn as SceneFunction);
    
    let dominant: SceneFunction;
    if (tiedFunctions.length === 1) {
      dominant = tiedFunctions[0];
    } else {
      // Tiebreak using crucible's scene function
      const crucibleFunction = this.ARCHETYPE_FUNCTION_MAP[crucible];
      dominant = tiedFunctions.includes(crucibleFunction) 
        ? crucibleFunction 
        : tiedFunctions[0];
    }
    
    const dominantWeight = weights[dominant];
    
    // Find secondary (>=20% weight and not dominant)
    const secondaryEntry = sorted.find(([fn, weight]) => 
      fn !== dominant && weight >= 0.20
    );
    
    // Texture = everything else with >0 weight
    const texture = sorted
      .filter(([fn]) => fn !== dominant && fn !== secondaryEntry?.[0])
      .filter(([_, weight]) => weight > 0)
      .map(([fn, weight]) => ({ 
        function: fn as SceneFunction, 
        weight 
      }));
    
    return {
      dominant,
      dominantWeight,
      secondary: secondaryEntry ? secondaryEntry[0] as SceneFunction : null,
      secondaryWeight: secondaryEntry ? secondaryEntry[1] : null,
      texture,
      crucible
    };
  }

  /**
   * Extract numerical digits (1-9) from braid string
   */
  private extractBraidNumbers(braid: string): number[] {
    // Extract all digits 1-9 from braid (no 11/22 at braid level)
    return braid
      .split('')
      .filter(char => /[1-9]/.test(char))
      .map(char => parseInt(char));
  }

  /**
   * Render the tau spiral on a canvas
   */
  public render(
    canvas: HTMLCanvasElement,
    result: TauTongueResult,
    options: RenderOptions = {}
  ): void {
    if (result.numeroCipher.length === 0) {
      // Clear canvas if no input
      const ctx = canvas.getContext("2d");
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
      resonance: result.digitalSum,
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
      showLabels: options.noLabels === true ? false : true,
    });
  }
}
