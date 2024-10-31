import React, { useState, useEffect, useRef } from 'react';
import { PriorityTask, TimeBlock } from '../types';
import confetti from 'canvas-confetti';

interface CircularProgressProps {
  tasks: PriorityTask[];
  blocks: TimeBlock[];
}

export function CircularProgress({ tasks, blocks }: CircularProgressProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const prevCompletionRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate time progress (12 AM to 12 AM next day)
  const getTimeProgress = () => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    return ((hour + minute / 60) / 24) * 100;
  };

  // Calculate completion percentages for priority and secondary tasks
  const priorityTasks = tasks.filter(t => t.isTopPriority);
  const secondaryTasks = tasks.filter(t => !t.isTopPriority);
  
  const priorityCompletion = priorityTasks.length > 0
    ? (priorityTasks.filter(t => t.completed).length / priorityTasks.length) * 100
    : 0;
  
  const secondaryCompletion = secondaryTasks.length > 0
    ? (secondaryTasks.filter(t => t.completed).length / secondaryTasks.length) * 100
    : 0;

  const overallCompletion = tasks.length > 0
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // Trigger celebration when reaching 100%
  useEffect(() => {
    if (overallCompletion === 100 && prevCompletionRef.current !== 100 && tasks.length > 0) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50;

        confetti({
          particleCount,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#818CF8', '#34D399', '#F472B6'],
          angle: randomInRange(55, 125),
        });

        confetti({
          particleCount,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#818CF8', '#34D399', '#F472B6'],
          angle: randomInRange(55, 125),
        });
      }, 250);

      return () => clearInterval(interval);
    }
    prevCompletionRef.current = overallCompletion;
  }, [overallCompletion, tasks.length]);

  const timeProgress = getTimeProgress();

  // SVG setup
  const size = 240;
  const center = size / 2;
  const strokeWidth = {
    outer: 8,
    middle: 12,
    inner: 16
  };

  // Calculate radii for the three rings
  const radius = {
    outer: center - strokeWidth.outer / 2,
    middle: center - strokeWidth.outer - 15 - strokeWidth.middle / 2,
    inner: center - strokeWidth.outer - 30 - strokeWidth.middle - strokeWidth.inner / 2
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const createArc = (radius: number, percentage: number) => {
    const startAngle = -90; // Start from top (12 o'clock)
    const endAngle = startAngle + (percentage / 100) * 360;
    
    const start = polarToCartesian(center, center, radius, startAngle);
    const end = polarToCartesian(center, center, radius, endAngle);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    // For 100%, create a complete circle
    if (percentage >= 100) {
      return `
        M ${start.x} ${start.y}
        A ${radius} ${radius} 0 1 1 ${start.x - 0.01} ${start.y}
      `;
    }
    
    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
    `;
  };

  // Time markers for 12-hour format
  const timeMarkers = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    const angle = (i / 12) * 360 - 90;
    const markerRadius = radius.outer + 15;
    const x = center + markerRadius * Math.cos((angle * Math.PI) / 180);
    const y = center + markerRadius * Math.sin((angle * Math.PI) / 180);
    return { hour, x, y, isMainMarker: i % 3 === 0 };
  });

  return (
    <div className="relative w-[280px] h-[280px] mx-auto">
      <svg 
        width={size} 
        height={size} 
        className={`transform transition-all duration-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
          overallCompletion === 100 && tasks.length > 0 ? 'animate-pulse' : ''
        }`}
      >
        {/* Background circles */}
        <circle
          cx={center}
          cy={center}
          r={radius.outer}
          stroke="currentColor"
          className="text-gray-700/20"
          fill="none"
          strokeWidth={strokeWidth.outer}
        />
        <circle
          cx={center}
          cy={center}
          r={radius.middle}
          stroke="currentColor"
          className="text-gray-700/20"
          fill="none"
          strokeWidth={strokeWidth.middle}
        />
        <circle
          cx={center}
          cy={center}
          r={radius.inner}
          stroke="currentColor"
          className="text-gray-700/20"
          fill="none"
          strokeWidth={strokeWidth.inner}
        />

        {/* Progress arcs */}
        <path
          d={createArc(radius.outer, timeProgress)}
          className="stroke-blue-500"
          fill="none"
          strokeWidth={strokeWidth.outer}
          strokeLinecap="round"
        />
        <path
          d={createArc(radius.middle, secondaryCompletion)}
          className="stroke-green-500"
          fill="none"
          strokeWidth={strokeWidth.middle}
          strokeLinecap="round"
        />
        <path
          d={createArc(radius.inner, priorityCompletion)}
          className="stroke-purple-500"
          fill="none"
          strokeWidth={strokeWidth.inner}
          strokeLinecap="round"
        />
      </svg>

      {/* Time markers */}
      <div className="absolute inset-0">
        {timeMarkers.map(({ hour, x, y, isMainMarker }) => (
          isMainMarker && (
            <div
              key={hour}
              className="absolute text-[10px] text-gray-400 whitespace-nowrap"
              style={{
                left: `${(x / size) * 100}%`,
                top: `${(y / size) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {hour}
              {hour === 12 ? 'PM' : 'AM'}
            </div>
          )
        ))}
      </div>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className={`text-3xl font-bold transition-all duration-300 ${
          overallCompletion === 100 && tasks.length > 0 ? 'scale-110 text-green-500' : ''
        }`}>
          {overallCompletion}%
        </div>
        <div className="text-sm text-gray-400">
          Complete
        </div>
      </div>

      {/* Legend */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span>{priorityTasks.filter(t => t.completed).length}/{priorityTasks.length} Priority</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>{secondaryTasks.filter(t => t.completed).length}/{secondaryTasks.length} Secondary</span>
        </div>
      </div>
    </div>
  );
}