import { TauTongueInterpreter, type TauTongueConfig, type TauTongueResult } from './TauTongueInterpreter_v3.js';
import { calculateDigitalRoot, cipherCycle as pythagoreanCipherCycle, convertToNumbers } from '../pythagoreanUtils.js';
import archetypeFictionTypeMap from './archetype-fiction-type-map.json' with { type: 'json' };
import storyUnitSpecs from './story-unit-specs.json' with { type: 'json' };

// TypeScript interface for format data structure
export interface FormatData {
  format: string;
  unitHierarchy: string[];
  ranges: Record<string, [number, number]>;
  variability?: number;
}

// Type assertion for the JSON import
const typedArchetypeFictionTypeMap = archetypeFictionTypeMap as unknown as Record<string, FormatData>;

// Unit specification interface for recursive breakdown
export interface UnitSpec {
  unitType: string;        // "book", "act", "chapter", etc.
  wordCountRange: [number, number];
  childUnit?: string;      // What this unit breaks down into
  childUnitRange?: [number, number];
  variability?: number;    // ±% for this unit type
}

// Archetypal distribution matrix interfaces
export interface ArchetypalEntry {
  digitalRoot: number;
  count: number;
  symbols: string[];
  symbolNames: string[];
  resonance: string;
}

export interface ArchetypalMatrix {
  totalSymbols: number;
  entries: ArchetypalEntry[];
  dominantRoot: number;
  diversity: number; // How spread out the distribution is
}

// Core spine structure
export interface TauSpineNode {
  // Identity
  spark: string;
  numeroCipher: number[];
  resonance: number;
  equation: TauTongueResult;
  
  // Structural position
  unit: string;        // "Book", "Act", "Chapter", "Scene"
  unitId: number;      // 1, 2, 3, etc.
  depth: number;       // 0 = root, 1 = child, etc.
  
  // Archetypal analysis
  archetypalMatrix: ArchetypalMatrix;
  
  // Recursive structure - now lazy-loaded
  children: TauSpineNode[];
  hasChildren: boolean;  // Indicates if children can be generated
  childrenLoaded: boolean; // Indicates if children have been loaded
}

export interface TauSpineResult {
  spark: string;
  format: string;
  protoEquation: TauTongueResult;
  spine: TauSpineNode[];
  stats: {
    totalNodes: number;
    maxDepth: number;
    generationTime: number;
  };
}

export interface FlattenedScene {
  sceneNumber: number;
  equation: TauTongueResult;
  bookId?: number;
  actId?: number;
  chapterId?: number;
}

export interface FlattenedTauSpineResult {
  spark: string;
  format: string;
  protoEquation: TauTongueResult;
  scenes: FlattenedScene[];
  stats: {
    totalScenes: number;
    totalNodes: number;
    maxDepth: number;
    generationTime: number;
  };
}

export enum SpineFormat {
  SHORT = 6,
  NOVELETTE = 7,
  NOVELLA = 8,
  NOVEL = 9,
  EPIC = 11,
  SAGA = 22,
}

export class TauSpine extends TauTongueInterpreter {
  private readonly formatData: FormatData;
  
  private nodeCount = 0;
  private maxDepthReached = 0;
  private generatedResult: TauSpineResult | null = null;
  
  constructor(
    private spark: string,
    private format: SpineFormat,
    config: TauTongueConfig = {}
  ) {
    super(config);
    this.validateInputs();
    this.formatData = this.getFormatData(this.format);
  }
  
  /**
   * Get maximum depth based on format's unit hierarchy
   */
  private get maxDepth(): number {
    return this.formatData.unitHierarchy.length;
  }
  
  private validateInputs(): void {
    if (!this.spark || this.spark.length < 3 || this.spark.length > 512) {
      throw new Error('Spark must be between 3 and 512 characters');
    }
    if (!Object.values(SpineFormat).includes(this.format)) {
      throw new Error('Invalid spine format');
    }
  }
  
  /**
   * Generate the complete tau spine structure (lazy-compatible)
   */
  public async generate(lazyChildren: boolean = false): Promise<TauSpineResult> {
    const startTime = Date.now();
    this.nodeCount = 0;
    this.maxDepthReached = 0;
    
    const protoEquation = this.interpret(this.spark);
    
    const spine = await this.generateLevel(
      this.spark,
      this.formatData.unitHierarchy[0], // Start with the primary unit
      0, // depth
      this.formatData,
      lazyChildren
    );
    
    this.generatedResult = {
      spark: this.spark,
      format: this.formatData.format,
      protoEquation,
      spine,
      stats: {
        totalNodes: this.nodeCount,
        maxDepth: this.maxDepthReached,
        generationTime: Date.now() - startTime
      }
    };
    
    return this.generatedResult;
  }

  /**
   * Generate children for a specific node (for lazy loading)
   */
  public async generateChildren(node: TauSpineNode): Promise<TauSpineNode[]> {
    if (node.childrenLoaded || !node.hasChildren) {
      return node.children;
    }

    const braid = BigInt(this.extractArchetypalBraid(node.equation.symbolicEquation)) % BigInt("9".repeat(node.equation.numeroCipher.length));
    if (braid === BigInt(0)) {
      node.hasChildren = false;
      return [];
    }

    // Get the child unit type from the node's unit
    const childUnitType = this.getUnitSpec(node.unit.toLowerCase(), this.formatData).childUnit;
    if (!childUnitType) {
      node.hasChildren = false;
      return [];
    }

    node.children = await this.generateLevel(
      braid.toString(),
      childUnitType,
      node.depth + 1,
      this.formatData,
      true // Always lazy for recursive calls
    );
    
    node.childrenLoaded = true;
    return node.children;
  }

  /**
   * Flatten the spine to return only proto-equation and scene equations
   * Auto-loads all children if lazy loading was used
   */
  public flatten(): FlattenedTauSpineResult {
    if (!this.generatedResult) {
      throw new Error('Must call generate() before flatten()');
    }

    // Ensure all children are loaded
    this.ensureFullyLoaded(this.generatedResult.spine);

    // Collect all scene equations
    const scenes = this.collectScenes(this.generatedResult.spine);

    return {
      spark: this.generatedResult.spark,
      format: this.generatedResult.format,
      protoEquation: this.generatedResult.protoEquation,
      scenes,
      stats: {
        totalScenes: scenes.length,
        totalNodes: this.generatedResult.stats.totalNodes,
        maxDepth: this.generatedResult.stats.maxDepth,
        generationTime: this.generatedResult.stats.generationTime
      }
    };
  }

  /**
   * Ensure all nodes in the tree have their children loaded
   */
  private ensureFullyLoaded(nodes: TauSpineNode[]): void {
    for (const node of nodes) {
      if (node.hasChildren && !node.childrenLoaded) {
        this.generateChildren(node);
      }
      if (node.children.length > 0) {
        this.ensureFullyLoaded(node.children);
      }
    }
  }

  /**
   * Recursively collect all scene equations from the spine tree
   */
  private collectScenes(
    nodes: TauSpineNode[],
    parentContext: { bookId?: number; actId?: number; chapterId?: number } = {},
    sceneCounter: { count: number } = { count: 0 }
  ): FlattenedScene[] {
    const scenes: FlattenedScene[] = [];

    for (const node of nodes) {
      // Update context based on current node's unit type
      const currentContext = { ...parentContext };
      if (node.unit === 'Book') currentContext.bookId = node.unitId;
      if (node.unit === 'Act') currentContext.actId = node.unitId;
      if (node.unit === 'Chapter') currentContext.chapterId = node.unitId;

      if (node.unit === 'Scene') {
        // Leaf node - this is a scene
        sceneCounter.count++;
        const scene: FlattenedScene = {
          sceneNumber: sceneCounter.count,
          equation: node.equation,
        };
        
        // Add parent IDs only if they exist
        if (currentContext.bookId !== undefined) scene.bookId = currentContext.bookId;
        if (currentContext.actId !== undefined) scene.actId = currentContext.actId;
        if (currentContext.chapterId !== undefined) scene.chapterId = currentContext.chapterId;
        
        scenes.push(scene);
      } else if (node.children.length > 0) {
        // Non-leaf - recurse to find scenes
        scenes.push(...this.collectScenes(node.children, currentContext, sceneCounter));
      }
    }

    return scenes;
  }
  
  /**
   * Generate nodes at a specific hierarchical level (unit-based recursive breakdown)
   */
  private async generateLevel(
    parentSpark: string,
    unitType: string,
    depth: number,
    formatData: FormatData,
    lazyChildren: boolean = false
  ): Promise<TauSpineNode[]> {
    if (depth >= this.maxDepth) return [];
    if (this.nodeCount > 10000) return [];
    
    this.maxDepthReached = Math.max(this.maxDepthReached, depth);
    
    // Get unit specification for this level
    const unitSpec = this.getUnitSpec(unitType, formatData);
    
    // Calculate how many units of this type we can create
    const unitCount = this.calculateChildUnitCount(unitSpec, parentSpark, formatData);
    if (unitCount <= 0) return [];
    
    let currentSpark = await this.cipherCycle(this.extractNumeroCipher(parentSpark).join(''), calculateDigitalRoot(this.extractNumeroCipher(parentSpark).join(''), this.pythagoreanConfig)!);
    const nodes: TauSpineNode[] = [];
    
    for (let i = 0; i < unitCount; i++) {
      // Generate unique equation for this unit
      const nodeSpark = await this.evolveSparkForNode(currentSpark, i, depth);
      const unitEquation = this.generateUnitEquation(nodeSpark);
      const numeroCipher = this.extractNumeroCipher(nodeSpark);
      const resonance = calculateDigitalRoot(numeroCipher.join(''), this.pythagoreanConfig)!;
      
      // Create the node
      const node: TauSpineNode = {
        spark: nodeSpark,
        numeroCipher,
        resonance,
        equation: unitEquation,
        unit: this.capitalize(unitType),
        unitId: i + 1,
        depth,
        archetypalMatrix: this.extractArchetypalMatrix(unitEquation.symbolicEquation),
        children: [],
        hasChildren: false,
        childrenLoaded: false
      };
      
      // Check if this unit can have children
      const canHaveChildren = unitSpec.childUnit && this.formatData.unitHierarchy.includes(unitSpec.childUnit);
      if (canHaveChildren && unitSpec.childUnit) {
        node.hasChildren = true;
        if (!lazyChildren) {
          // Recursively generate children
          node.children = await this.generateLevel(
            nodeSpark,
            unitSpec.childUnit,
            depth + 1,
            this.formatData,
            lazyChildren
          );
          node.childrenLoaded = true;
        }
      }
      
      nodes.push(node);
      this.nodeCount++;
      
      // Update spark for next sibling
      currentSpark = nodeSpark;
    }
    
    return nodes;
  }

  /**
   * Generate unit equation for a specific unit type
   */
  private generateUnitEquation(spark: string): TauTongueResult {
    // Use the evolved spark directly - uniqueness comes from evolveSparkForNode
    return this.interpret(spark);
  }

  /**
   * Calculate how many child units to create
   */
  private calculateChildUnitCount(
    unitSpec: UnitSpec,
    parentSpark: string,
    formatData: FormatData
  ): number {
    // Get the range for this unit type from the format's ranges
    const unitRange = formatData.ranges[unitSpec.unitType];
    if (unitRange) {
      const [min, max] = unitRange as [number, number];
      const numeroCipher = this.extractNumeroCipher(parentSpark);
      if (numeroCipher.length === 0) return min;
      
      const mod = BigInt(numeroCipher.join('')) % BigInt(max - min + 1);
      return Number(mod) + min;
    }
    
    // If this unit has a specific child unit range, use it
    if (unitSpec.childUnitRange) {
      const [min, max] = unitSpec.childUnitRange;
      const numeroCipher = this.extractNumeroCipher(parentSpark);
      if (numeroCipher.length === 0) return min;
      
      const mod = BigInt(numeroCipher.join('')) % BigInt(max - min + 1);
      return Number(mod) + min;
    }
    
    // Default fallback - use minimum from word count range
    return Math.max(1, unitSpec.wordCountRange[0] / 1000); // Rough estimate
  }
  
  /**
   * Evolve spark for each node for true variability
   */
  private  async evolveSparkForNode(
    baseSpark: string,
    index: number,
    depth: number
  ): Promise<string> {
    // Use cipherCycle and add index/depth for more entropy
    const base = baseSpark + String(index) + String(depth);
    const numeroCipher = this.extractNumeroCipher(base);
    const resonance = calculateDigitalRoot(numeroCipher.join(''), this.pythagoreanConfig)!;
    return await this.cipherCycle(numeroCipher.join(''), resonance);
  }
  
  /**
   * Extract numerical braid from tau-tongue equation
   * This is the core of your elegant architecture!
   */
  private extractArchetypalBraid(equation: string): string {
    // Extract the bracketed function parameters
    const matches = equation.match(/\[(.*?)\]/g);
    if (!matches || matches.length === 0) return '';
    
    // Get the first bracketed group and extract numbers
    const firstMatch = matches[0];
    const content = firstMatch.slice(1, -1); // Remove [ and ]
    const numbers = content.replace(/[^0-9,]/g, ''); // Keep only numbers and commas
    
    // Return concatenated numbers as the archetypal braid
    return numbers.replace(/,/g, '');
  }
  
  /**
   * Cipher cycling - evolve the numerical signature
   */
  private async cipherCycle(numeroCipher: string, resonance: number): Promise<string> {
    return await pythagoreanCipherCycle(numeroCipher, resonance, this.pythagoreanConfig);
  }
  
  /**
   * Extract numero cipher from spark
   */
  private extractNumeroCipher(spark: string): number[] {
    return convertToNumbers(spark)
      .split('')
      .filter(char => !isNaN(Number(char)) && parseInt(char) > 0)
      .map(Number);
  }
  
  /**
   * Get format data for the current spine format
   */
  private getFormatData(format: SpineFormat): FormatData {
    const formatKey = format.toString() as keyof typeof typedArchetypeFictionTypeMap;
    return typedArchetypeFictionTypeMap[formatKey];
  }

  /**
   * Get unit specification by merging base specs with format-specific data
   */
  private getUnitSpec(unitType: string, formatData: FormatData): UnitSpec {
    // Get base unit spec from story-unit-specs.json
    const baseSpec = storyUnitSpecs[unitType as keyof typeof storyUnitSpecs];
    if (!baseSpec) {
      throw new Error(`No base spec found for unit type: ${unitType}`);
    }

    // Create unit spec with base word count range
    const unitSpec: UnitSpec = {
      unitType,
      wordCountRange: baseSpec as [number, number],
      variability: formatData.variability ?? 0.1
    };

    // Get the next unit in the hierarchy from this format's unitHierarchy
    const currentIndex = formatData.unitHierarchy.indexOf(unitType);
    if (currentIndex >= 0 && currentIndex < formatData.unitHierarchy.length - 1) {
      const nextUnitType = formatData.unitHierarchy[currentIndex + 1];
      unitSpec.childUnit = nextUnitType;
      
      // Get child unit range from this format's ranges
      if (formatData.ranges[nextUnitType]) {
        unitSpec.childUnitRange = formatData.ranges[nextUnitType] as [number, number];
      }
    }

    return unitSpec;
  }

   /**
    * Extract archetypal distribution matrix from symbolic equation
    */
   private extractArchetypalMatrix(equation: string): ArchetypalMatrix {
     // Initialize braid-level digital roots from config
     const allRoots = Object.keys(this.archetypeMap).map(Number);
     const rootGroups: Map<number, { symbols: Set<string>, names: Set<string>, count: number }> = new Map();
     
     // Initialize all roots with empty data
     allRoots.forEach(root => {
       rootGroups.set(root, { symbols: new Set(), names: new Set(), count: 0 });
     });

           // Extract all bracketed function calls (braids)
      const functionCalls = equation.match(/\[(.*?)\]/g);
      if (functionCalls) {
        functionCalls.forEach(call => {
          const content = call.slice(1, -1); // Remove [ and ]
          
          // Filter out everything that's NOT a digit 1-9, then split by character
          const digits = content.replace(/[^1-9]/g, '').split('');
          
          // Count each digit occurrence
          digits.forEach(digit => {
            const digitNum = parseInt(digit);
            if (digitNum >= 1 && digitNum <= 9) {
              const group = rootGroups.get(digitNum)!;
              group.count++;
            }
          });
        });
      }

     // Find symbols that resonate with each digital root
     const symbolsInEquation = Array.from(equation).filter(char => {
       const symbolData = this.getSymbol(char);
       return symbolData !== undefined;
     });
     
     symbolsInEquation.forEach(symbol => {
       const symbolData = this.getSymbol(symbol);
       if (symbolData) {
         const symbolBraid = symbol.charCodeAt(0).toString();
         const symbolDigitalRoot = calculateDigitalRoot(symbolBraid, this.pythagoreanConfig);
         if(symbolDigitalRoot === null) {
           console.error("Symbol digital root is null");
           throw new Error("Symbol digital root is null");
         }
         
         if (rootGroups.has(symbolDigitalRoot)) {
           const group = rootGroups.get(symbolDigitalRoot)!;
           group.symbols.add(symbol);
           group.names.add(symbolData.name);
         }
       }
     });

     // Convert to entries array (always show all roots)
     const entries: ArchetypalEntry[] = allRoots.map(digitalRoot => {
       const group = rootGroups.get(digitalRoot)!;
       return {
         digitalRoot,
         count: group.count,
         symbols: Array.from(group.symbols),
         symbolNames: Array.from(group.names),
         resonance: this.getSymbolicMeaning(digitalRoot)
       };
     });

     // Find dominant root (highest count, with highest value winning ties)
     const maxCount = Math.max(...entries.map(e => e.count));
     const dominantRoot = entries
       .filter(e => e.count === maxCount)
       .reduce((max, entry) => entry.digitalRoot > max ? entry.digitalRoot : max, 0);

     // Calculate diversity (spread of counts)
     const counts = entries.map(e => e.count);
     const diversity = counts.length > 0 ? Math.max(...counts) - Math.min(...counts) : 0;

     return {
       totalSymbols: counts.reduce((sum, count) => sum + count, 0),
       entries,
       dominantRoot,
       diversity
     };
   }

   /**
    * Extract master archetypal matrix from symbolic equation (includes typal numbers)
    */
   public extractMasterArchetypalMatrix(equation: string): ArchetypalMatrix {
     // Initialize braid-level digital roots from config
     const allRoots = Object.keys(this.archetypeMap).map(Number);
     const rootGroups: Map<number, { symbols: Set<string>, names: Set<string>, count: number }> = new Map();
     
     // Initialize all roots with empty data
     allRoots.forEach(root => {
       rootGroups.set(root, { symbols: new Set(), names: new Set(), count: 0 });
     });

     // Extract all bracketed function calls (braids)
     const functionCalls = equation.match(/\[(.*?)\]/g);
     if (functionCalls) {
       functionCalls.forEach(call => {
         const content = call.slice(1, -1); // Remove [ and ]
         
         // Filter out everything that's NOT a digit 1-9, then split by character
         const digits = content.replace(/[^1-9]/g, '').split('');
         
         // Count each digit occurrence
         digits.forEach(digit => {
           const digitNum = parseInt(digit);
           if (digitNum >= 1 && digitNum <= 9) {
             const group = rootGroups.get(digitNum)!;
             group.count++;
           }
         });
       });
     }

     // Find symbols that resonate with each digital root
     const symbolsInEquation = Array.from(equation).filter(char => {
       const symbolData = this.getSymbol(char);
       return symbolData !== undefined;
     });
     
     symbolsInEquation.forEach(symbol => {
       const symbolData = this.getSymbol(symbol);
       if (symbolData) {
         const symbolBraid = symbol.charCodeAt(0).toString();
         const symbolDigitalRoot = calculateDigitalRoot(symbolBraid, this.pythagoreanConfig);
         if(symbolDigitalRoot === null) {
           console.error("Symbol digital root is null");
           throw new Error("Symbol digital root is null");
         }
         if (rootGroups.has(symbolDigitalRoot)) {
           const group = rootGroups.get(symbolDigitalRoot)!;
           group.symbols.add(symbol);
           group.names.add(symbolData.name);
         }
       }
     });

     // Convert to entries array (always show all roots)
     const entries: ArchetypalEntry[] = allRoots.map(digitalRoot => {
       const group = rootGroups.get(digitalRoot)!;
       return {
         digitalRoot,
         count: group.count,
         symbols: Array.from(group.symbols),
         symbolNames: Array.from(group.names),
         resonance: this.getSymbolicMeaning(digitalRoot)
       };
     });

     // Find dominant root (highest count, with highest value winning ties)
     const maxCount = Math.max(...entries.map(e => e.count));
     const dominantRoot = entries
       .filter(e => e.count === maxCount)
       .reduce((max, entry) => entry.digitalRoot > max ? entry.digitalRoot : max, 0);

     // Calculate diversity (spread of counts)
     const counts = entries.map(e => e.count);
     const diversity = counts.length > 0 ? Math.max(...counts) - Math.min(...counts) : 0;

     return {
       totalSymbols: counts.reduce((sum, count) => sum + count, 0),
       entries,
       dominantRoot,
       diversity
     };
   }

  /**
   * Utility: capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export convenience function
export async function createTauSpine(spark: string, format: SpineFormat, config: TauTongueConfig = {}, lazyChildren: boolean = false): Promise<TauSpineResult> {
  const spine = new TauSpine(spark, format, config);
  return await spine.generate(lazyChildren);
}

/**
 * Get the hierarchical path for a flattened scene
 * @param scene The flattened scene
 * @param separator Optional separator (default: ' › ')
 * @returns A human-readable path string like "Book 1 › Act 2 › Chapter 3 › Scene 4"
 */
export function getPath(scene: FlattenedScene, separator: string = ' › '): string {
  const parts: string[] = [];
  
  if (scene.bookId !== undefined) parts.push(`Book ${scene.bookId}`);
  if (scene.actId !== undefined) parts.push(`Act ${scene.actId}`);
  if (scene.chapterId !== undefined) parts.push(`Chapter ${scene.chapterId}`);
  parts.push(`Scene ${scene.sceneNumber}`);
  
  return parts.join(separator);
}