import { getSymbol } from './TauTongueSymbolMap.js';
import { renderTauSpiral, type TauInput } from './TauTongueRenderer.js';
import { convertToNumbers as convertToNumbersPythagorean } from '../pythagoreanUtils.js';

export interface TauTongueResult {
  input: string;
  flatCipher: number[];
  digitalSum: number;
  resonance: string;
  resonanceMeaning: string;
  archetype: string;
  archetypeDescription: string;
  symbolicEquation: string;
  interpretation: string;
  wordCount: number;
  charCount: number;
  narrativeInterpretation: string;
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

  private readonly symbolMap: string[] = Array.from(
    '•∀∁∂∃∄∆∇∈∉∋∌∏∐∑−∓∔∕∖∗∘∙√∝∞∟∠∡∢∣∤∥∦∧∨∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿⬠⧉⧬⨳⨂⎉⧖⧗'
  );

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
   * Generate symbolic operators equation
   */
  private getSymbolicOperators(sum: number, digits: number[]): string {
    const wrap = (func: string, args: string) => `${func}(${args})`;
    const segments: string[] = [];
    let cursor = 0;
    let lastLength = sum;
    
    while (cursor < digits.length) {
      const sliceLen = Math.max(1, lastLength + (lastLength % 2 === 0 ? -1 : 1));
      const chunk = digits.slice(cursor, cursor + sliceLen);
      if (chunk.length === 0) break;
      const index = parseInt(chunk.join('')) % this.symbolMap.length;
      const op = this.symbolMap[index];
      segments.push(wrap(op, chunk.join(',')));
      lastLength = chunk.length;
      cursor += sliceLen;
    }
    
    const outerOp = this.symbolMap[(digits.reduce((a, b) => a + b, 0) + sum) % this.symbolMap.length];
    return wrap(outerOp, segments.join(','));
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
      if (!desc) return;
      interpretation += `• ${symbol} (${desc.name}): ${desc.metaphoricalMeaning}\n`;
    });
    
    return interpretation;
  }

  /**
   * Generate narrative interpretation
   */
  private generateNarrativeInterpretation(input: string, equation: string, resonance: string, digitalSum: number, archetype: string): string {
    const symbols = this.extractSymbols(equation);
    const uniqueSymbols = Array.from(new Set(symbols));
    
    return (
      `Your phrase "${input}" resonates with the energy of ${resonance.toLowerCase()}, \n` +
      `represented by the digital root ${digitalSum}. This places you in the archetypal \n` +
      `realm of ${archetype}. The symbolic equation reveals a pattern of` +
      (uniqueSymbols.length > 0 ? ` ${getSymbol(uniqueSymbols[0])?.metaphoricalMeaning.toLowerCase() ?? 'hidden meanings'}` : ' hidden meanings') +
      (uniqueSymbols.length > 1 ? ` interwoven with ${getSymbol(uniqueSymbols[1])?.metaphoricalMeaning.toLowerCase() ?? ''}` : '') +
      (uniqueSymbols.length > 2 ? `, culminating in ${getSymbol(uniqueSymbols[uniqueSymbols.length-1])?.metaphoricalMeaning.toLowerCase() ?? ''}` : '') +
      `.`
    );
  }

  /**
   * Main interpretation method - processes input and returns all computed values
   */
  public interpret(input: string): TauTongueResult {
    const flatCipher = this.convertToNumbers(input);
    const digitalSum = this.reduceCipher(flatCipher);
    const resonance = this.getSymbolicMeaning(digitalSum);
    const archetype = this.archetypeMap[digitalSum] || 'The Unknown';
    const symbolicEquation = this.getSymbolicOperators(digitalSum, flatCipher);
    const interpretation = this.interpretEquation(symbolicEquation);
    const narrativeInterpretation = this.generateNarrativeInterpretation(input, symbolicEquation, resonance, digitalSum, archetype);
    
    // Calculate word and character counts
    const wordCount = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const charCount = input.length;

    return {
      input,
      flatCipher,
      digitalSum,
      resonance,
      resonanceMeaning: this.resonanceDescriptions[resonance] || 'Unknown resonance',
      archetype,
      archetypeDescription: this.archetypeDescriptions[archetype] || 'Unknown archetype',
      symbolicEquation,
      interpretation,
      wordCount,
      charCount,
      narrativeInterpretation
    };
  }

  /**
   * Render the tau spiral on a canvas
   */
  public render(canvas: HTMLCanvasElement, result: TauTongueResult, options: RenderOptions = {}): void {
    if (result.flatCipher.length === 0) {
      // Clear canvas if no input
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Prepare TauInput for the renderer
    const tauInput: TauInput = {
      input: result.input,
      theme: result.digitalSum,
      cipher: result.flatCipher,
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