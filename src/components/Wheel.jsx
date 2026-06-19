import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/SoundManager';

const COLORS = [
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
];

const Wheel = ({ names = [], spinning = false, targetIndex = -1, onSpinComplete }) => {
  const wheelRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  
  // Track ticks during animation
  const animationRef = useRef({
    startTime: 0,
    duration: 5000,
    startRotation: 0,
    endRotation: 0,
    lastTickIndex: -1,
  });

  const sliceAngle = names.length > 0 ? 360 / names.length : 360;

  useEffect(() => {
    if (spinning && targetIndex !== -1 && names.length > 0) {
      const duration = 4500 + Math.random() * 1000;
      const spins = 5 + Math.floor(Math.random() * 3);
      
      const sliceCenter = sliceAngle * targetIndex + sliceAngle / 2;
      const baseTargetRotation = 270 - sliceCenter;
      
      const currentMod = currentRotation % 360;
      let targetAdd = baseTargetRotation - currentMod;
      if (targetAdd <= 0) {
        targetAdd += 360;
      }
      
      const newEndRotation = currentRotation + targetAdd + (spins * 360);

      animationRef.current = {
        startTime: performance.now(),
        duration,
        startRotation: currentRotation,
        endRotation: newEndRotation,
        lastTickIndex: -1,
      };

      let animId;
      const animate = (time) => {
        const elapsed = time - animationRef.current.startTime;
        const total = animationRef.current.duration;

        if (elapsed >= total) {
          setCurrentRotation(animationRef.current.endRotation);
          setTimeout(() => {
            onSpinComplete();
          }, 300);
        } else {
          const progress = elapsed / total;
          const ease = 1 - Math.pow(1 - progress, 3);
          const rot = animationRef.current.startRotation + (animationRef.current.endRotation - animationRef.current.startRotation) * ease;
          
          setCurrentRotation(rot);

          const pointerInWheelCoords = (270 - rot) % 360;
          const positiveAngle = pointerInWheelCoords < 0 ? pointerInWheelCoords + 360 : pointerInWheelCoords;
          const currentTickIndex = Math.floor(positiveAngle / sliceAngle);

          if (currentTickIndex !== animationRef.current.lastTickIndex) {
            soundManager.playTick();
            animationRef.current.lastTickIndex = currentTickIndex;
          }

          animId = requestAnimationFrame(animate);
        }
      };

      animId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animId);
    }
  }, [spinning, targetIndex]);

  const renderSlice = (name, index) => {
    if (names.length === 1) {
      return (
        <g key={index}>
          <circle cx="200" cy="200" r="185" fill={COLORS[0]} stroke="#ffffff22" strokeWidth="2" />
          <text
            x="200"
            y="70"
            textAnchor="middle"
            fill="#ffffff"
            fontWeight="bold"
            fontSize="18"
            style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.6)' }}
          >
            {name}
          </text>
        </g>
      );
    }

    const startAngleRad = ((sliceAngle * index - 90) * Math.PI) / 180;
    const endAngleRad = ((sliceAngle * (index + 1) - 90) * Math.PI) / 180;

    const r = 185;
    const cx = 200;
    const cy = 200;

    const x1 = cx + r * Math.cos(startAngleRad);
    const y1 = cy + r * Math.sin(startAngleRad);
    const x2 = cx + r * Math.cos(endAngleRad);
    const y2 = cy + r * Math.sin(endAngleRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const color = COLORS[index % COLORS.length];

    const textAngle = sliceAngle * index + sliceAngle / 2 - 90;
    const textAngleRad = (textAngle * Math.PI) / 180;
    const textDist = r * 0.58;
    const tx = cx + textDist * Math.cos(textAngleRad);
    const ty = cy + textDist * Math.sin(textAngleRad);

    const displayName = name.length > 14 ? name.substring(0, 12) + '..' : name;

    return (
      <g key={index}>
        <path
          d={pathD}
          fill={color}
          stroke="#ffffff15"
          strokeWidth="1.5"
          style={{ transition: 'fill 0.2s' }}
        />
        <g transform={`translate(${tx}, ${ty}) rotate(${textAngle + 90})`}>
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fill="#ffffff"
            fontWeight="bold"
            fontSize={names.length > 15 ? "10" : names.length > 10 ? "11" : "13"}
            style={{
              textShadow: '0px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '0.5px'
            }}
          >
            {displayName}
          </text>
        </g>
      </g>
    );
  };

  return (
    <div className="wheel-container">
      {/* Outer Ring & Border */}
      <div className="wheel-outer-ring">
        {/* Pointer at the top */}
        <div className="wheel-pointer" />
      </div>

      {/* SVG Canvas for Wheel */}
      <svg
        ref={wheelRef}
        width="400"
        height="400"
        viewBox="0 0 400 400"
        style={{
          transform: `rotate(${currentRotation}deg)`,
          transformOrigin: '50% 50%',
          filter: 'drop-shadow(0px 8px 20px rgba(0,0,0,0.5))',
          borderRadius: '50%',
          zIndex: 2,
          position: 'relative'
        }}
      >
        {names.length === 0 ? (
          <g>
            <circle cx="200" cy="200" r="185" fill="#0f172a" />
            <text x="200" y="205" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="bold">
              İsim Listesi Boş
            </text>
          </g>
        ) : (
          names.map((name, index) => renderSlice(name, index))
        )}

        {/* Center hub */}
        <circle cx="200" cy="200" r="26" fill="#030712" stroke="#f59e0b" strokeWidth="4" />
        <circle cx="200" cy="200" r="8" fill="#f59e0b" />
      </svg>
    </div>
  );
};

export default Wheel;
