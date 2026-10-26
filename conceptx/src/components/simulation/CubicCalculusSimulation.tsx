'use client';

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export function CubicCalculusSimulation() {
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [tangentX, setTangentX] = useState<number>(0.8);
  const [showArea, setShowArea] = useState<boolean>(true);

  // f(x) = x^3 - 3x^2 + 2x
  // f'(x) = 3x^2 - 6x + 2
  // Critical points: 1 - 1/sqrt(3) ≈ 0.4226 (Local max), 1 + 1/sqrt(3) ≈ 1.5774 (Local min)
  // Inflection point: x = 1 (f''(1) = 0)
  // Area from 0 to 2 = 1/2

  const f = (x: number) => x * x * x - 3 * x * x + 2 * x;
  const fPrime = (x: number) => 3 * x * x - 6 * x + 2;

  // Tangent line equation: y - f(x0) = f'(x0) * (x - x0)
  const x0 = tangentX;
  const y0 = f(x0);
  const slope = fPrime(x0);

  // Canvas dimensions
  const width = 640;
  const height = 240;
  const originX = 120;
  const originY = height / 2;
  const scaleX = 160; // 1 unit in x = 160 px
  const scaleY = 140; // 1 unit in y = 140 px

  // Generate points for curve
  const curvePoints: string[] = [];
  for (let px = -0.5; px <= 2.5; px += 0.02) {
    const py = f(px);
    const canvasX = originX + px * scaleX;
    const canvasY = originY - py * scaleY;
    curvePoints.push(`${canvasX},${canvasY}`);
  }

  // Generate shaded area path for x from 0 to 2
  const areaPoints: string[] = [];
  areaPoints.push(`${originX},${originY}`);
  for (let px = 0; px <= 2.0; px += 0.02) {
    const py = f(px);
    const canvasX = originX + px * scaleX;
    const canvasY = originY - py * scaleY;
    areaPoints.push(`${canvasX},${canvasY}`);
  }
  areaPoints.push(`${originX + 2 * scaleX},${originY}`);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Interactive Calculus Visualizer: $f(x) = x^3 - 3x^2 + 2x$
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showArea}
              onChange={(e) => setShowArea(e.target.checked)}
              className="rounded text-purple-600"
            />
            Shaded Area
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showTangent}
              onChange={(e) => setShowTangent(e.target.checked)}
              className="rounded text-purple-600"
            />
            Tangent Line
          </label>
        </div>
      </div>

      <div className="bg-slate-950 rounded-lg p-2 overflow-hidden flex justify-center">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          <line x1={0} y1={originY} x2={width} y2={originY} stroke="#334155" strokeWidth={1.5} />
          <line x1={originX} y1={0} x2={originX} y2={height} stroke="#334155" strokeWidth={1.5} />

          {/* X ticks */}
          {[0, 1, 2].map((val) => (
            <g key={val}>
              <line
                x1={originX + val * scaleX}
                y1={originY - 5}
                x2={originX + val * scaleX}
                y2={originY + 5}
                stroke="#64748b"
              />
              <text
                x={originX + val * scaleX}
                y={originY + 18}
                fill="#94a3b8"
                fontSize={11}
                textAnchor="middle"
                fontFamily="monospace"
              >
                x={val}
              </text>
            </g>
          ))}

          {/* Shaded Area between curve and x-axis */}
          {showArea && (
            <polygon
              points={areaPoints.join(' ')}
              fill="rgba(168, 85, 247, 0.25)"
              stroke="none"
            />
          )}

          {/* Cubic Curve */}
          <polyline
            points={curvePoints.join(' ')}
            fill="none"
            stroke="#a855f7"
            strokeWidth={3}
          />

          {/* Local Max point: x = 1 - 1/sqrt(3) ≈ 0.423 */}
          <circle
            cx={originX + (1 - 1 / Math.sqrt(3)) * scaleX}
            cy={originY - f(1 - 1 / Math.sqrt(3)) * scaleY}
            r={5}
            fill="#10b981"
          />
          <text
            x={originX + (1 - 1 / Math.sqrt(3)) * scaleX - 10}
            y={originY - f(1 - 1 / Math.sqrt(3)) * scaleY - 10}
            fill="#10b981"
            fontSize={10}
          >
            Local Max
          </text>

          {/* Inflection Point: x = 1 */}
          <circle
            cx={originX + 1 * scaleX}
            cy={originY}
            r={5}
            fill="#38bdf8"
          />
          <text
            x={originX + 1 * scaleX + 8}
            y={originY - 8}
            fill="#38bdf8"
            fontSize={10}
          >
            Inflection (x=1)
          </text>

          {/* Local Min point: x = 1 + 1/sqrt(3) ≈ 1.577 */}
          <circle
            cx={originX + (1 + 1 / Math.sqrt(3)) * scaleX}
            cy={originY - f(1 + 1 / Math.sqrt(3)) * scaleY}
            r={5}
            fill="#f59e0b"
          />
          <text
            x={originX + (1 + 1 / Math.sqrt(3)) * scaleX - 10}
            y={originY - f(1 + 1 / Math.sqrt(3)) * scaleY + 18}
            fill="#f59e0b"
            fontSize={10}
          >
            Local Min
          </text>

          {/* Tangent Line */}
          {showTangent && (
            <g>
              <line
                x1={originX + (x0 - 0.7) * scaleX}
                y1={originY - (y0 - slope * 0.7) * scaleY}
                x2={originX + (x0 + 0.7) * scaleX}
                y2={originY - (y0 + slope * 0.7) * scaleY}
                stroke="#ec4899"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
              <circle
                cx={originX + x0 * scaleX}
                cy={originY - y0 * scaleY}
                r={4}
                fill="#ec4899"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Tangent slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs">
          <span>Inspect Point x: {tangentX.toFixed(2)}</span>
          <span className="font-mono text-purple-600 dark:text-purple-400">
            f({tangentX.toFixed(2)}) = {y0.toFixed(2)}, f&apos;({tangentX.toFixed(2)}) = {slope.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="0.0"
          max="2.0"
          step="0.05"
          value={tangentX}
          onChange={(e) => setTangentX(parseFloat(e.target.value))}
          className="w-full accent-purple-600 h-1.5 bg-[var(--background-secondary)] rounded cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-center text-xs">
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">Local Maximum</div>
          <div className="font-mono font-bold text-emerald-500">x = 1 - 1/√3 ≈ 0.42</div>
        </div>
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">Inflection Point</div>
          <div className="font-mono font-bold text-sky-500">x = 1 (Only One!)</div>
        </div>
        <div className="p-2 rounded bg-[var(--background-secondary)]">
          <div className="text-[10px] text-[var(--foreground-muted)]">Bounded Area (0 to 2)</div>
          <div className="font-mono font-bold text-purple-500">1/4 + 1/4 = 1/2</div>
        </div>
      </div>
    </div>
  );
}
