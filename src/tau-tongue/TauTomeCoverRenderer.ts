// TauTomeCoverRenderer.ts - Extended Canvas Renderer for Book Covers

import { renderTauSpiral, type TauInput } from './TauTongueRenderer.js';
import { createCanvas } from 'canvas';

interface TomeCoverOptions {
  title: string;
  context?: 'PROJECT' | 'WORLD'; // Context for conditional rendering
  width?: number;
  height?: number;
  padding?: number;
  spiralCycles?: number;
}

function renderTauTomeCover(
  canvas: any, // Node.js canvas or HTMLCanvasElement
  tau: TauInput,
  options: TomeCoverOptions
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  // Cover dimensions
  const width = options.width || 1600;
  const height = options.height || 2560;
  const padding = options.padding || 80;
  const context = options.context || 'PROJECT'; // Default to book covers
  canvas.width = width;
  canvas.height = height;

  const TAU_DEG = 360 / 11;
  
  // Generate hue from input content hash for better color variation
  let inputHash = 0;
  const inputString = tau.input || tau.tauTongue || options.title;
  for (let i = 0; i < inputString.length; i++) {
    inputHash = ((inputHash << 5) - inputHash) + inputString.charCodeAt(i);
    inputHash = inputHash & inputHash; // Convert to 32-bit integer
  }
  
  // Combine input hash with resonance for more varied colors
  const spiralHue = (Math.abs(inputHash) + (tau.resonance * TAU_DEG)) % 360;
  
  // Calculate colors
  const backgroundColor = `hsla(${spiralHue}, 100%, 11.1%, 1)`;
  const textColor = `hsla(${spiralHue}, 11.1%, 100%, 1)`;
  
  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // Create temporary canvas for spiral rendering
  // For both PROJECT and WORLD covers: make spiral larger than canvas to ensure full coverage
  const spiralScale = context === 'PROJECT' ? 3 : 1.33; // Project covers: 3x, World covers: 2x for better centering
  const spiralHeight = (height - padding * 2) * spiralScale;
  const spiralWidth = width * spiralScale;
  const spiralCanvas = createCanvas(spiralWidth, spiralHeight);
  
  // Render spiral at calculated size
  renderTauSpiral(spiralCanvas as any, tau, {
    width: spiralWidth,
    height: spiralHeight,
    padding: padding,
    cycles: options.spiralCycles || tau.resonance,
    showLabels: false, // Clean spiral for covers
    zoom: context === 'WORLD' ? 1.33 : 1.0 // 133% scaling for world covers
  });
  
  // Draw spiral centered to fill entire background
  const topTwoThirdsHeight = Math.floor(height * 2/3);
  const spiralCenterY = topTwoThirdsHeight / 2; // Center of top 2/3
  
  if (context === 'PROJECT') {
    // For book covers: center the massive spiral so it bleeds beyond boundaries
    const spiralX = -(spiralWidth - width) / 2; // Center horizontally
    const spiralYOffset = spiralCenterY - (spiralHeight / 2); // Center spiral on target point
    ctx.drawImage(spiralCanvas, spiralX, spiralYOffset);
  } else {
    // For world covers: CENTER the spiral to fill entire canvas with no negative space
    const spiralX = -(spiralWidth - width) / 2; // Center horizontally
    const spiralYOffset = -(spiralHeight - height) / 2; // Center vertically on ENTIRE canvas
    ctx.drawImage(spiralCanvas, spiralX, spiralYOffset);
  }
  
  // Render "EPIC ENGINE" header only for PROJECT covers
  if (context === 'PROJECT') {
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.font = '72px Orbitron, monospace';
    ctx.fillText('TAU-TOME', width - padding, padding);
  }
  
  // Calculate header space to avoid collision
  const headerHeight = 24 + padding * 2; // Font size + padding buffer
  
  // Setup text rendering (OVERLAID ON TOP OF SPIRAL)
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  
  // Convert title to uppercase and create character grid
  const titleUpper = options.title.toUpperCase();
  const chars = titleUpper.split('');
  
  // Create grid lines using spaces and hyphens as line breaks
  const gridLines: string[][] = [];
  let currentLine: string[] = [];
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    
    // If it's a space or hyphen, add current char and break line
    if (char === ' ' || char === '-') {
      if (char === '-') {
        currentLine.push(char); // Include hyphen in current line
      }
      if (currentLine.length > 0) {
        gridLines.push([...currentLine]);
        currentLine = [];
      }
    } else {
      currentLine.push(char);
    }
  }
  
  // Add remaining characters as final line
  if (currentLine.length > 0) {
    gridLines.push(currentLine);
  }
  
  // Calculate available text dimensions (accounting for header space)
  const constrainedTextWidth = (width - (padding * 2)) * 0.77; // Use 88% of available width
  const availableHeight = height - headerHeight - (padding * 2); // Reserve space for header
  
  // Find optimal font size based on character width
  let fontSize = 110; // Increased by 10px
  ctx.font = `${fontSize}px Adamina, serif`;
  
  // Use 'M' as reference character for sizing (widest typical character)
  const charWidth = ctx.measureText('M').width;
  
  // Find the longest line to determine max characters needed
  const maxCharsInLine = Math.max(...gridLines.map(line => line.length));
  
  // Scale font size so max line fits in 88% width with expanded spacing
  const neededWidth = maxCharsInLine * charWidth;
  if (neededWidth > constrainedTextWidth) {
    fontSize = (fontSize * constrainedTextWidth) / neededWidth;
  }
  
  // Also check if text block height fits in available space
  let lineHeight = fontSize * 1.5; // Slightly more spacing for grid effect
  let totalTextHeight = gridLines.length * lineHeight;
  
  // If text is too tall, scale down font size to fit height
  if (totalTextHeight > availableHeight) {
    const heightScale = availableHeight / totalTextHeight;
    fontSize = fontSize * heightScale;
    lineHeight = fontSize * 1.4;
    totalTextHeight = gridLines.length * lineHeight;
  }
  
  ctx.font = `${fontSize}px Adamina, serif`;
  
  // Position starting from bottom-left corner with double padding from bottom
  const startY = height - (padding * 2) - totalTextHeight + lineHeight;
  
  // Render each grid line with pseudo-justification
  gridLines.forEach((line, index) => {
    const y = startY + (index * lineHeight);
    
    if (line.length === 1) {
      // Single character - just left align
      ctx.fillText(line[0], padding, y);
         } else {
               // Multiple characters - distribute evenly across 88% width
       const totalSpacing = constrainedTextWidth;
       const charSpacing = totalSpacing / (line.length - 1);
       
       line.forEach((char, charIndex) => {
         const x = padding + (charIndex * charSpacing);
         ctx.fillText(char, x, y);
       });
     }
  });
}

// function breakTextIntoLines(text: string, maxCharsPerLine: number): string[] {
//   const words = text.split(' ');
//   const lines: string[] = [];
//   let currentLine = '';
  
//   for (const word of words) {
//     const testLine = currentLine ? `${currentLine} ${word}` : word;
    
//     if (testLine.length <= maxCharsPerLine) {
//       currentLine = testLine;
//     } else {
//       if (currentLine) {
//         lines.push(currentLine);
//         currentLine = word;
//       } else {
//         // Handle single word longer than max chars
//         lines.push(word.substring(0, maxCharsPerLine));
//         currentLine = word.substring(maxCharsPerLine);
//       }
//     }
//   }
  
//   if (currentLine) {
//     lines.push(currentLine);
//   }
  
//   return lines;
// }

// function calculateOptimalFontSize(
//   ctx: CanvasRenderingContext2D,
//   lines: string[],
//   maxWidth: number,
//   maxHeight: number
// ): number {
//   let fontSize = 120; // Start with large font
//   const minFontSize = 24;
  
//   while (fontSize > minFontSize) {
//     ctx.font = `${fontSize}px Adamina, serif`;
    
//     // Check if all lines fit within width
//     const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    
//     // Check if total height fits
//     const lineHeight = fontSize * 1.2;
//     const totalHeight = lines.length * lineHeight;
    
//     if (maxLineWidth <= maxWidth && totalHeight <= maxHeight) {
//       return fontSize;
//     }
    
//     fontSize -= 4;
//   }
  
//   return minFontSize;
// }

export { renderTauTomeCover, type TomeCoverOptions }; 