export const fictionTypeMap = {
  "1": {
    format: "Axiom",
    structure: "None",
    notes: "Pure signal. One line.",
    wordCountRange: [5, 15],
    resonance:
      "The number 1 is associated with new beginnings, unity, and singular focus. An axiom, being a pure and concise statement, embodies the essence of oneness and clarity, making it a perfect fit for the number 1.",
  },
  "2": {
    format: "Koan",
    structure: "Binary paradox",
    notes: "Setup ↔ Collapse",
    wordCountRange: [8, 50],
    resonance:
      "The number 2 represents duality, balance, and paradox. A koan, with its binary paradox structure, perfectly embodies the energetic quality of the number 2, which is all about exploring opposites and finding harmony within contradiction.",
  },
  "3": {
    format: "Poem",
    structure: "Triplet form",
    notes: "A / B / Turn",
    wordCountRange: [10, 200],
    resonance:
      "The number 3 is creative, expressive, and associated with the triad of mind, body, and spirit. A poem, especially in a triplet form (A/B/Turn), aligns with this creative and expressive energy, as it often explores emotional and spiritual themes in a structured yet fluid manner.",
  },
  "4": {
    format: "Flash",
    structure: "Prologue or Epilogue + 3-part arc",
    notes: "Compact full arc with optional framing device.",
    wordCountRange: [500, 1000],
    resonance:
      "The number 4 is stable, practical, and associated with structure and foundation. A flash fiction with a prologue or epilogue paired with a clear 3-part arc provides a compact but solid narrative, resonating with the structured nature of the number 4.",
  },
  "5": {
    format: "Vignette",
    structure: "5-act structure",
    notes: "Freytag style: Exposition → Denouement",
    wordCountRange: [1000, 2500],
    resonance:
      "The number 5 is dynamic, adaptable, and associated with change and movement. A 5-act structure, following Freytag's pyramid, embodies this dynamic energy, as it involves rising and falling action, creating a sense of movement and transformation within the narrative.",
  },
  "6": {
    format: "Short",
    structure: "3-act structure, 2 parts per act",
    notes: "6 total narrative beats; tightly structured and harmonized.",
    wordCountRange: [2500, 7500],
    resonance:
      "The number 6 is harmonious, nurturing, and associated with balance and resolution. A 3-act structure with 2 parts per act allows a short story to express a full narrative while maintaining emotional coherence and balance, aligning with the nurturing and harmonious qualities of the number 6.",
  },
  "7": {
    format: "Novelette",
    structure: "7-chapter structural braid",
    notes: "Each chapter = one recursive beat",
    wordCountRange: [7500, 17500],
    resonance:
      "The number 7 is mystical, introspective, and associated with spiritual growth and inner wisdom. A 7-chapter structural braid for a novelette resonates with this energy, as each chapter can delve deeper into the narrative, exploring complex themes and promoting introspection and growth.",
  },
  "8": {
    format: "Novella",
    structure: "Prologue + (6-act structure | 3-act structure x2) + Epilogue",
    notes: "Two full arcs with mirrored framing; nested transformation.",
    wordCountRange: [17500, 40000],
    resonance:
      "The number 8 is powerful, authoritative, and associated with abundance and manifestation. A novella structured with a prologue, two mirrored 3-act arcs, and an epilogue reflects the completeness and recursive power of 8, aligning with its authoritative and manifesting energy.",
  },
  "9": {
    format: "Novel",
    structure: "3x3 grid: 3 arcs of 3 acts each",
    notes: "Classic Hero's Journey matrix",
    wordCountRange: [40000, 110000],
    resonance:
      "The number 9 is compassionate, universal, and associated with completion and closure. A 3x3 grid structure for a novel embodies this energy, as it creates a complex and interwoven narrative that explores multiple arcs and acts, ultimately leading to a sense of completion and universal resonance.",
  },
  "11": {
    format: "Epic",
    structure: "Nested interlocks of Flash + Vignette + Short",
    notes: "Sub-narratives bound inside arcs",
    wordCountRange: [110000, 250000],
    resonance:
      "The number 11 is masterful, intuitive, and associated with illumination and enlightenment. Nesting interlocks of flash, vignette, and short stories within an epic structure creates a complex and expansive narrative that can illuminate deeper truths and promote enlightenment, resonating with the masterful and intuitive qualities of the number 11.",
  },
  "22": {
    format: "Saga",
    structure: "6-act structure, 4 parts per act",
    notes: "24 total narrative beats; ideal for trilogies and long-form myth.",
    wordCountRange: [250000, 999999],
    resonance:
      "The number 22 is master builder, practical, and associated with turning visions into reality. A 6-act structure with 4 parts per act creates a large-scale narrative with precision and depth, ensuring that the vision of the saga is realized in a practical and structured manner, aligning with the master builder energy of the number 22.",
  },
};

// should be able to return an entry in fictionTypeMap by matching the input format to the format property
export const getByFormat = (format: string) => {
  return Object.values(fictionTypeMap).find((entry) => entry.format === format);
};

export const getByResonance = (n: string) => {
  // return the entry in fictionType map whose key === resonance
  return fictionTypeMap[n as keyof typeof fictionTypeMap];
};

export const cipherCycle = (numeroCipher: string, resonance: number): string => {
    const digits: number[] = numeroCipher.split('').map(char => parseInt(char, 10));
    const extension: (number | string)[] = [];
  
    for (let i = 0; i < digits.length; i++) {
      const d = digits[i];
      let newDigit = (d + resonance) % 12;
  
      if (newDigit === 0) {
        newDigit = resonance;
      } else if (newDigit === 10) {
        newDigit = 11;
      } else if (newDigit === 11) {
        newDigit = 22;
      }
  
      const newRes = newDigit + (d % 10);
      extension.push(newRes);
    }
  
  return extension.join("");
};
