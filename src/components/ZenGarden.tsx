import React, { useState, useRef, useEffect } from 'react';
import { Flower2, Wind, Waves, RefreshCw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export function ZenGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'draw' | 'breathe'>('draw');
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const lastPoint = useRef<Point | null>(null);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      // Initial sand background
      ctx.fillStyle = '#f3e4c6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle texture
      for (let i = 0; i < canvas.width; i += 2) {
        for (let j = 0; j < canvas.height; j += 2) {
          if (Math.random() > 0.5) {
            ctx.fillStyle = 'rgba(0,0,0,0.03)';
            ctx.fillRect(i, j, 2, 2);
          }
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const drawLine = (start: Point, end: Point) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = '#d4c5a9';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Add highlight
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = '#e6d5b8';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== 'draw') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    lastPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || mode !== 'draw') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (lastPoint.current) {
      drawLine(lastPoint.current, currentPoint);
    }

    lastPoint.current = currentPoint;
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fade out current drawing
    const fadeOut = () => {
      ctx.fillStyle = 'rgba(243, 228, 198, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (ctx.globalAlpha > 0.1) {
        requestAnimationFrame(fadeOut);
      } else {
        // Reset canvas
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#f3e4c6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle texture
        for (let i = 0; i < canvas.width; i += 2) {
          for (let j = 0; j < canvas.height; j += 2) {
            if (Math.random() > 0.5) {
              ctx.fillStyle = 'rgba(0,0,0,0.03)';
              ctx.fillRect(i, j, 2, 2);
            }
          }
        }
      }
    };

    fadeOut();
  };

  const startBreathingExercise = () => {
    setMode('breathe');
    setShowBreathingGuide(true);
    setBreathePhase('inhale');

    const breathingCycle = () => {
      // Inhale for 4 seconds
      setBreathePhase('inhale');
      setTimeout(() => {
        // Hold for 4 seconds
        setBreathePhase('hold');
        setTimeout(() => {
          // Exhale for 4 seconds
          setBreathePhase('exhale');
          setTimeout(() => {
            // Continue cycle if still in breathe mode
            if (mode === 'breathe') {
              breathingCycle();
            }
          }, 4000);
        }, 4000);
      }, 4000);
    };

    breathingCycle();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flower2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-semibold">Zen Garden</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('draw');
              setShowBreathingGuide(false);
            }}
            className={`p-2 rounded-md transition-colors ${
              mode === 'draw'
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                : 'text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <Wind className="w-4 h-4" />
          </button>
          <button
            onClick={startBreathingExercise}
            className={`p-2 rounded-md transition-colors ${
              mode === 'breathe'
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                : 'text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <Waves className="w-4 h-4" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-amber-50 dark:bg-amber-900/20 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ touchAction: 'none' }}
        />

        {showBreathingGuide && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-32 h-32 rounded-full border-2 border-amber-600/30 dark:border-amber-400/30 flex items-center justify-center transition-transform duration-[4000ms] ${
                breathePhase === 'inhale'
                  ? 'scale-150'
                  : breathePhase === 'hold'
                  ? 'scale-150'
                  : 'scale-100'
              }`}
            >
              <div className="text-center text-amber-600 dark:text-amber-400">
                <div className="text-sm font-medium">
                  {breathePhase === 'inhale'
                    ? 'Inhale'
                    : breathePhase === 'hold'
                    ? 'Hold'
                    : 'Exhale'}
                </div>
                <div className="text-xs opacity-75">4 seconds</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        {mode === 'draw' ? (
          'Draw patterns in the sand to create your own zen garden'
        ) : (
          'Follow the breathing guide for a moment of calm'
        )}
      </div>
    </div>
  );
}