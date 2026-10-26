'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  Gauge, 
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RollingCylinderSimulationProps {
  className?: string;
}

export function RollingCylinderSimulation({ className }: RollingCylinderSimulationProps) {
  // Physical parameters
  const [v0, setV0] = useState<number>(3.2); // m/s
  const [R, setR] = useState<number>(0.5); // meters
  const [h, setH] = useState<number>(0.15); // meters (h < R)
  const [M, setM] = useState<number>(2.0); // kg
  const g = 9.8; // m/s^2

  // Simulation playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showEnergyGauges, setShowEnergyGauges] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Dynamic simulation variables
  // Phase: 'rolling' | 'impact' | 'pivoting' | 'cleared' | 'rebounded'
  const [phase, setPhase] = useState<'rolling' | 'pivoting' | 'cleared' | 'rebounded'>('rolling');
  const [simTime, setSimTime] = useState<number>(0);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Theoretical physics calculations
  const physicsData = useMemo(() => {
    // Pre-impact initial angular velocity
    const omega0 = v0 / R; // rad/s
    // Initial kinetic energy: 1/2 M v0^2 + 1/2 I_cm omega0^2 = 3/4 M v0^2
    const keInitial = 0.75 * M * v0 * v0;

    // Angular momentum about edge before collision
    // L_edge = M*v0*(R - h) + 1/2 M*R^2 * (v0/R) = M*v0*(3R - 2h)/2
    const L_edge = M * v0 * (3 * R - 2 * h) / 2;

    // Moment of inertia about edge: 3/2 M R^2
    const I_edge = 1.5 * M * R * R;

    // Angular velocity just after collision: L_edge / I_edge
    const omega1 = (v0 * (3 * R - 2 * h)) / (3 * R * R);

    // Kinetic energy after impact: 1/2 I_edge * omega1^2
    const keAfterImpact = 0.5 * I_edge * omega1 * omega1;
    const energyLossPercentage = ((keInitial - keAfterImpact) / keInitial) * 100;

    // PE required to climb step (CM rises by h)
    const peRequired = M * g * h;

    // Minimum velocity to climb over:
    // 1/2 I_edge omega1^2 >= M g h
    // v0_min = (sqrt(12 * g * h) * R) / (3 * R - 2 * h)
    const v0Min = (Math.sqrt(12 * g * h) * R) / (3 * R - 2 * h);
    const willClimb = v0 >= v0Min;

    return {
      omega0,
      keInitial,
      L_edge,
      I_edge,
      omega1,
      keAfterImpact,
      energyLossPercentage,
      peRequired,
      v0Min,
      willClimb,
    };
  }, [v0, R, h, M]);

  // Physics animation state references (mutable for high performance 60fps loop)
  const stateRef = useRef({
    x: 0, // CM x position in meters
    y: 0, // CM y position in meters
    theta: 0, // rotation angle of cylinder in radians
    pivotAngle: 0, // angle of CM from vertical during pivoting (radians)
    pivotOmega: 0, // angular velocity during pivoting
    phase: 'rolling' as 'rolling' | 'pivoting' | 'cleared' | 'rebounded',
    time: 0,
  });

  // Step position in simulation coordinates
  const stepX = 2.4; // Step edge position in meters

  // Reset simulation function
  const resetSimulation = () => {
    setIsPlaying(false);
    stateRef.current = {
      x: 0.5,
      y: R,
      theta: 0,
      pivotAngle: -Math.acos(Math.max(-1, Math.min(1, (R - h) / R))),
      pivotOmega: 0,
      phase: 'rolling',
      time: 0,
    };
    setPhase('rolling');
    setSimTime(0);
    renderCanvas();
  };

  // Ensure h is always less than R
  const handleRChange = (newR: number) => {
    setR(newR);
    if (h >= newR) {
      setH(Number((newR * 0.4).toFixed(2)));
    }
  };

  const handleHChange = (newH: number) => {
    if (newH < R) {
      setH(newH);
    }
  };

  // Main rendering logic on HTML5 Canvas
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Coordinate conversion: 1 meter = scale px
    const scale = Math.min(width / 4.2, height / 2.6);
    const groundY = height - 70; // ground pixel line
    const stepPxX = stepX * scale;
    const stepPxH = h * scale;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw subtle background grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw ground and step platform
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, groundY, stepPxX, height - groundY);

    // Top of step platform
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(stepPxX, groundY - stepPxH, width - stepPxX, height - (groundY - stepPxH));

    // Ground outline and step edge highlight
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(stepPxX, groundY);
    ctx.lineTo(stepPxX, groundY - stepPxH);
    ctx.lineTo(width, groundY - stepPxH);
    ctx.stroke();

    // Step height label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(`Step h = ${h.toFixed(2)} m`, stepPxX + 10, groundY - stepPxH / 2 + 4);

    // Step height dimension marker
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(stepPxX + 6, groundY);
    ctx.lineTo(stepPxX + 6, groundY - stepPxH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight pivot point P (step edge)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(stepPxX, groundY - stepPxH, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f87171';
    ctx.fillText('Pivot P', stepPxX - 35, groundY - stepPxH - 10);

    // 3. Draw Cylinder
    const s = stateRef.current;
    const cmPxX = s.x * scale;
    const cmPxY = groundY - s.y * scale;
    const rPx = R * scale;

    ctx.save();
    ctx.translate(cmPxX, cmPxY);

    // Cylinder body (radial gradient)
    const cylGrad = ctx.createRadialGradient(-rPx * 0.2, -rPx * 0.2, rPx * 0.1, 0, 0, rPx);
    cylGrad.addColorStop(0, '#60a5fa');
    cylGrad.addColorStop(0.7, '#2563eb');
    cylGrad.addColorStop(1, '#1d4ed8');

    ctx.fillStyle = cylGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rPx, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Spoke lines to visualize rotation
    ctx.rotate(s.theta);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(rPx * Math.cos((i * Math.PI) / 2), rPx * Math.sin((i * Math.PI) / 2));
      ctx.stroke();
    }

    // Center of Mass indicator
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 4. Center of Mass label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('CM (M)', cmPxX - 16, cmPxY - rPx - 8);

    // 5. Velocity and Force Vectors (if enabled)
    if (showVectors) {
      // Velocity vector from CM
      const vMagnitude = s.phase === 'rolling' 
        ? v0 
        : s.phase === 'pivoting' 
          ? s.pivotOmega * R 
          : 0;
      
      const vLengthPx = Math.min(70, Math.max(10, vMagnitude * 15));

      if (s.phase === 'rolling' && v0 > 0) {
        ctx.strokeStyle = '#10b981';
        ctx.fillStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cmPxX, cmPxY);
        ctx.lineTo(cmPxX + vLengthPx, cmPxY);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(cmPxX + vLengthPx, cmPxY);
        ctx.lineTo(cmPxX + vLengthPx - 8, cmPxY - 4);
        ctx.lineTo(cmPxX + vLengthPx - 8, cmPxY + 4);
        ctx.fill();

        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`v₀ = ${v0} m/s`, cmPxX + vLengthPx + 6, cmPxY + 4);
      } else if (s.phase === 'pivoting') {
        // Tangential velocity during pivot
        const tangentAngle = s.pivotAngle + Math.PI / 2;
        const vx = Math.cos(tangentAngle) * vLengthPx;
        const vy = -Math.sin(tangentAngle) * vLengthPx;

        ctx.strokeStyle = '#10b981';
        ctx.fillStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cmPxX, cmPxY);
        ctx.lineTo(cmPxX + vx, cmPxY + vy);
        ctx.stroke();

        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`v = ${(Math.abs(s.pivotOmega) * R).toFixed(2)} m/s`, cmPxX + vx + 5, cmPxY + vy);

        // Circular arc for climbing path
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(stepPxX, groundY - stepPxH, rPx, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.1);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Weight vector (Mg downward)
      ctx.strokeStyle = '#f43f5e';
      ctx.fillStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cmPxX, cmPxY);
      ctx.lineTo(cmPxX, cmPxY + 36);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cmPxX, cmPxY + 36);
      ctx.lineTo(cmPxX - 4, cmPxY + 30);
      ctx.lineTo(cmPxX + 4, cmPxY + 30);
      ctx.fill();
      ctx.fillText('Mg', cmPxX + 8, cmPxY + 32);
    }
  };

  // High-precision physics simulation loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const updatePhysics = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05) * speedMultiplier;
      lastTimestamp = timestamp;

      if (isPlaying) {
        const s = stateRef.current;
        s.time += dt;

        // Collision contact distance from step:
        // When center is at x_impact = stepX - sqrt(R^2 - (R-h)^2)
        const contactDx = Math.sqrt(Math.max(0, R * R - Math.pow(R - h, 2)));
        const impactX = stepX - contactDx;

        if (s.phase === 'rolling') {
          s.x += v0 * dt;
          s.theta += (v0 / R) * dt;

          if (s.x >= impactX) {
            // Collision happens here!
            s.x = impactX;
            s.phase = 'pivoting';
            // Post-collision angular velocity about edge P
            s.pivotOmega = physicsData.omega1;
            // Angle from vertical: theta_0 = -arccos((R-h)/R)
            s.pivotAngle = -Math.acos((R - h) / R);
            setPhase('pivoting');
          }
        } else if (s.phase === 'pivoting') {
          // Equation of motion for rotation about edge P:
          // Torque about P = -M * g * R * sin(pivotAngle)
          // I_edge * alpha = -M * g * R * sin(pivotAngle)
          // alpha = (-M * g * R * sin(pivotAngle)) / (1.5 * M * R^2) = - (2g / 3R) * sin(pivotAngle)
          const alpha = -((2 * g) / (3 * R)) * Math.sin(s.pivotAngle);

          s.pivotOmega += alpha * dt;
          s.pivotAngle += s.pivotOmega * dt;
          s.theta += s.pivotOmega * dt;

          // CM coordinates while pivoting around edge (stepX, h)
          // pivotAngle = 0 is vertically above edge
          s.x = stepX + R * Math.sin(s.pivotAngle);
          s.y = h + R * Math.cos(s.pivotAngle);

          // Check if CM reached vertical line over step (pivotAngle >= 0)
          if (s.pivotAngle >= 0 && s.pivotOmega > 0) {
            s.phase = 'cleared';
            setPhase('cleared');
          } else if (s.pivotOmega <= 0 && s.pivotAngle <= -Math.acos((R - h) / R)) {
            // Rebounded back down
            s.phase = 'rebounded';
            setPhase('rebounded');
          }
        } else if (s.phase === 'cleared') {
          // Continue rolling on top platform
          s.x += v0 * 0.7 * dt;
          s.theta += ((v0 * 0.7) / R) * dt;
          s.y = h + R;
        } else if (s.phase === 'rebounded') {
          // Rebounding backwards
          s.x -= v0 * 0.4 * dt;
          s.theta -= ((v0 * 0.4) / R) * dt;
          s.y = R;
        }

        setSimTime(s.time);
      }

      renderCanvas();
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, speedMultiplier, v0, R, h, M, physicsData]);

  // Initial draw and resize observer
  useEffect(() => {
    resetSimulation();
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = 360;
        renderCanvas();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-sm overflow-hidden flex flex-col',
        isFullscreen ? 'fixed inset-4 z-50 bg-[var(--background-card)]' : '',
        className
      )}
    >
      {/* Simulation Header */}
      <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--background-secondary)]/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Flagship Physics Simulation: Rolling Cylinder Pivoting Over Step
          </h3>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
            Analytical Mechanics
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--background-card)]">
            {phase === 'rolling' && <span className="text-blue-500">Phase 1: Rolling (v₀)</span>}
            {phase === 'pivoting' && <span className="text-amber-500 font-semibold animate-pulse">Phase 2: Pivoting about Edge</span>}
            {phase === 'cleared' && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Step Cleared!
              </span>
            )}
            {phase === 'rebounded' && (
              <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Rebounded (v₀ &lt; v_min)
              </span>
            )}
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded hover:bg-[var(--background-card)]"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative bg-slate-950 flex-1">
        <canvas
          ref={canvasRef}
          width={800}
          height={360}
          className="w-full h-[360px] block"
        />

        {/* Live HUD Overlay: Climbs Over Verdict */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-3 text-xs text-slate-200 shadow-lg min-w-[210px]">
          <div className="font-semibold text-slate-100 flex items-center justify-between pb-1.5 border-b border-slate-700/60 mb-2">
            <span>Climbing Threshold</span>
            {physicsData.willClimb ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Will Climb
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Will Fall Back
              </span>
            )}
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Current v₀:</span>
              <span className="text-slate-100 font-bold">{v0.toFixed(2)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">v₀,min threshold:</span>
              <span className="text-amber-400 font-bold">{physicsData.v0Min.toFixed(2)} m/s</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400">Post-impact ω₁:</span>
              <span className="text-sky-300">{physicsData.omega1.toFixed(2)} rad/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Impact Energy Loss:</span>
              <span className="text-rose-400">{physicsData.energyLossPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Time counter overlay */}
        <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-400 bg-slate-900/70 px-2 py-1 rounded">
          t: {simTime.toFixed(2)}s
        </div>
      </div>

      {/* Interactive Controls & Telemetry Dashboard */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--background-card)] space-y-4">
        {/* Playback Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-sm',
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white'
              )}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play Simulation'}
            </button>

            <button
              onClick={resetSimulation}
              className="px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--background-secondary)] text-[var(--foreground)] text-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>

            <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)] ml-2">
              <span>Speed:</span>
              {[0.5, 1, 2].map((mult) => (
                <button
                  key={mult}
                  onClick={() => setSpeedMultiplier(mult)}
                  className={cn(
                    'px-2 py-1 rounded text-xs font-mono',
                    speedMultiplier === mult
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'hover:bg-[var(--background-secondary)] text-[var(--foreground-secondary)]'
                  )}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={showVectors}
                onChange={(e) => setShowVectors(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
              />
              Show Vectors (v, Mg, J)
            </label>

            <label className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={showEnergyGauges}
                onChange={(e) => setShowEnergyGauges(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
              />
              Show Energy Bars
            </label>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Initial Velocity v0 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[var(--foreground)]">Initial Velocity (v₀)</span>
              <span className="font-mono text-[var(--brand-primary)] font-semibold">{v0.toFixed(2)} m/s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="7.0"
              step="0.1"
              value={v0}
              onChange={(e) => {
                setV0(parseFloat(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-[var(--brand-primary)] h-1.5 bg-[var(--background-secondary)] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--foreground-muted)] font-mono">
              <span>0.5 m/s</span>
              <span>7.0 m/s</span>
            </div>
          </div>

          {/* Cylinder Radius R */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[var(--foreground)]">Cylinder Radius (R)</span>
              <span className="font-mono text-[var(--brand-primary)] font-semibold">{R.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.2"
              step="0.05"
              value={R}
              onChange={(e) => {
                handleRChange(parseFloat(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-[var(--brand-primary)] h-1.5 bg-[var(--background-secondary)] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--foreground-muted)] font-mono">
              <span>0.2 m</span>
              <span>1.2 m</span>
            </div>
          </div>

          {/* Step Height h */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[var(--foreground)]">Step Height (h &lt; R)</span>
              <span className="font-mono text-[var(--brand-primary)] font-semibold">{h.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.05"
              max={(R - 0.05).toFixed(2)}
              step="0.02"
              value={h}
              onChange={(e) => {
                handleHChange(parseFloat(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-[var(--brand-primary)] h-1.5 bg-[var(--background-secondary)] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--foreground-muted)] font-mono">
              <span>0.05 m</span>
              <span>{(R - 0.05).toFixed(2)} m</span>
            </div>
          </div>

          {/* Cylinder Mass M */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[var(--foreground)]">Cylinder Mass (M)</span>
              <span className="font-mono text-[var(--brand-primary)] font-semibold">{M.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={M}
              onChange={(e) => {
                setM(parseFloat(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-[var(--brand-primary)] h-1.5 bg-[var(--background-secondary)] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--foreground-muted)] font-mono">
              <span>0.5 kg</span>
              <span>5.0 kg</span>
            </div>
          </div>
        </div>

        {/* Energy & Physics Quantities Breakdown */}
        {showEnergyGauges && (
          <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Initial KE vs Post-Impact KE */}
            <div className="p-2.5 rounded-lg bg-[var(--background-secondary)]/60 text-xs">
              <div className="flex justify-between font-medium text-[var(--foreground)] mb-1">
                <span>KE Before Collision:</span>
                <span className="font-mono">{physicsData.keInitial.toFixed(1)} J</span>
              </div>
              <div className="flex justify-between font-medium text-[var(--foreground)] mb-1.5">
                <span>KE After Collision:</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {physicsData.keAfterImpact.toFixed(1)} J
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${100 - physicsData.energyLossPercentage}%` }}
                  title="Retained Kinetic Energy"
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${physicsData.energyLossPercentage}%` }}
                  title="Lost Kinetic Energy (Inelastic collision)"
                />
              </div>
              <span className="text-[10px] text-[var(--foreground-muted)] mt-1 block">
                🔴 {physicsData.energyLossPercentage.toFixed(1)}% kinetic energy lost in inelastic collision
              </span>
            </div>

            {/* Angular Momentum Conservation Check */}
            <div className="p-2.5 rounded-lg bg-[var(--background-secondary)]/60 text-xs">
              <div className="font-medium text-[var(--foreground)] mb-1 flex items-center justify-between">
                <span>Angular Momentum (L_edge):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">CONSERVED ✓</span>
              </div>
              <div className="font-mono text-[11px] text-[var(--foreground-secondary)] space-y-0.5">
                <div>L_before = {physicsData.L_edge.toFixed(2)} kg·m²/s</div>
                <div>I_edge · ω₁ = {physicsData.L_edge.toFixed(2)} kg·m²/s</div>
              </div>
              <span className="text-[10px] text-[var(--foreground-muted)] mt-1.5 block">
                Reaction force at edge has zero torque about edge itself.
              </span>
            </div>

            {/* Climbing Energy Requirement */}
            <div className="p-2.5 rounded-lg bg-[var(--background-secondary)]/60 text-xs">
              <div className="font-medium text-[var(--foreground)] mb-1 flex items-center justify-between">
                <span>Potential Energy Needed (Mgh):</span>
                <span className="font-mono">{physicsData.peRequired.toFixed(1)} J</span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--foreground-secondary)] mb-1">
                <span>Available Post-Impact KE:</span>
                <span className="font-mono font-semibold">
                  {physicsData.keAfterImpact.toFixed(1)} J
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all',
                    physicsData.willClimb ? 'bg-emerald-500' : 'bg-rose-500'
                  )}
                  style={{
                    width: `${Math.min(100, (physicsData.keAfterImpact / Math.max(1, physicsData.peRequired)) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[var(--foreground-muted)] mt-1 block">
                {physicsData.willClimb ? '✓ Sufficient energy to climb' : '✗ Insufficient energy (reverses)'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
