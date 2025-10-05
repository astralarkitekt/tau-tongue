// TauSpiralRenderer.ts - TypeScript Canvas Renderer for Taucule Spirals

interface TauInput {
  input: string;
  theme: number;
  cipher: number[];
  tauTongue: string;
  archetype: string;
  resonance: number;
}

function renderTauSpiral(
  canvas: any, // Node.js canvas or HTMLCanvasElement
  tau: TauInput,
  options: { cycles?: number; radiusUnit?: number; width?: number; height?: number; padding?: number; showLabels?: boolean; zoom?: number } = {}
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  // Default image size and padding
  const width = options.width || 800;
  const height = options.height || 800;
  const padding = options.padding ?? 16;
  const zoom = options.zoom ?? 1.0; // Default to no zoom
  canvas.width = width;
  canvas.height = height;

  const TAU_DEG = 360 / 11;
  const { theme, cipher, resonance } = tau;
  const cycles = options.cycles || tau.resonance;
  const showLabels = options.showLabels !== false; // Default to true for backward compatibility

  // Generate HSL color from resonance with high contrast
  const spiralHue = (resonance * TAU_DEG) % 360;
  const spiralColor = `hsl(${spiralHue}, 80%, 70%)`; // Higher lightness for visibility

  // Calculate max possible radius with proper scaling
  const maxDistance = Math.max(...cipher.map((dr) => Math.abs(theme - dr)), 1);
  
  // For world covers (zoom > 1.0), use FULL canvas to fill background
  // For project covers, use normal padding
  let availableRadius;
  if (zoom > 1.0) {
    // FILL THE ENTIRE CANVAS - no padding, use full dimensions
    availableRadius = Math.min(width, height) / 2 * zoom;
  } else {
    // Normal behavior with padding for project covers
    availableRadius = Math.min((width - 2 * padding), (height - 2 * padding)) / 2;
  }
  
  const radiusUnit = availableRadius / maxDistance; // Scale to achieve desired fill

  // Reset canvas
  ctx.clearRect(0, 0, width, height);

  // Ensure center is truly centered
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate positions
  let currentAngleDeg = theme * TAU_DEG;
  const angles: number[] = [currentAngleDeg];
  const distances: number[] = [];

  for (const dr of cipher) {
    currentAngleDeg += dr * TAU_DEG;
    angles.push(currentAngleDeg);
    distances.push(theme - dr);
  }

  // Convert angles to radians and compute spiral
  const spiralPoints: { x: number; y: number }[] = [];
  for (let cycle = 0; cycle < cycles; cycle++) {
    for (let i = 1; i < angles.length; i++) {
      const angleRad = ((angles[i] % 360) + 360) % 360 * (Math.PI / 180);
      const radius = Math.abs(distances[i - 1]) * radiusUnit;
      const finalAngle = angleRad + cycle * 2 * Math.PI;
      const x = centerX + Math.cos(finalAngle) * radius;
      const y = centerY + Math.sin(finalAngle) * radius;
      spiralPoints.push({ x, y });
    }
  }

  // Draw center point (theme)
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
  ctx.fillStyle = spiralColor; // Match the spiral color
  ctx.fill();
  
  if (showLabels) {
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${tau.theme} (${tau.archetype})`, centerX, centerY - 10);
  }

  // Draw spiral points with smooth Catmull-Rom spline
  ctx.strokeStyle = spiralColor;
  ctx.lineWidth = 2;
  drawCatmullRomSpline(ctx, spiralPoints);

  // Mark recursion nodes
  spiralPoints.forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = spiralColor;
    ctx.fill();
    
    if (showLabels) {
      ctx.fillText(`R${i + 1}`, pt.x, pt.y - 8);
    }
  });
}

// Helper: Catmull-Rom spline for smooth spiral
function drawCatmullRomSpline(ctx: CanvasRenderingContext2D, points: {x: number, y: number}[], numSegments = 16) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    for (let t = 0; t < numSegments; t++) {
      const s = t / numSegments;
      const s2 = s * s;
      const s3 = s2 * s;
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * s +
        (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * s2 +
        (-p0.x + 3*p1.x - 3*p2.x + p3.x) * s3
      );
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * s +
        (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * s2 +
        (-p0.y + 3*p1.y - 3*p2.y + p3.y) * s3
      );
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

export { renderTauSpiral, type TauInput };
