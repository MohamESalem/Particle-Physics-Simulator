import React, { useEffect, useRef, useCallback } from 'react';
import type { Particle } from '../types/particle';
import { drawParticle, drawGrid } from '../utlis/drawUtils';
import { COLORS } from '../themes/colors'; 

interface CanvasRendererProps {
    particles: Particle[];
    selectedId: number | null;
    gridSize: number; 
    baseCanvasWidth: number; 
    baseCanvasHeight: number; 
    onClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseUp: () => void;
    onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    currentTheme: 'light' | 'dark';
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
    particles,
    selectedId,
    gridSize,
    baseCanvasWidth,
    baseCanvasHeight,
    onClick,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    currentTheme,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); 

    const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        onClick(e);
    }, [onClick]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        onMouseDown(e);
    }, [onMouseDown]);

    const handleMouseUp = useCallback(() => {
        onMouseUp();
    }, [onMouseUp]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        onMouseMove(e);
    }, [onMouseMove]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        canvas.width = baseCanvasWidth;
        canvas.height = baseCanvasHeight;

        ctx.clearRect(0, 0, baseCanvasWidth, baseCanvasHeight);

        const backgroundColor = currentTheme === 'dark' ? COLORS.bg3 : COLORS.bg1; 
        const gridColor = currentTheme === 'dark' ? COLORS.borderDark : COLORS.borderLight; 
        const selectedParticleOutline = currentTheme === 'dark' ? COLORS.accentLight : COLORS.accent; 

        // Draw background
        ctx.fillStyle = backgroundColor || '#fff';
        ctx.fillRect(0, 0, baseCanvasWidth, baseCanvasHeight);

        // Draw grid
        drawGrid(ctx, baseCanvasWidth, baseCanvasHeight);

        // Draw particles
        for (const p of particles) {
            const isSelected = p.id === selectedId;
            drawParticle(ctx, p, isSelected);
        }

    }, [particles, selectedId, baseCanvasWidth, baseCanvasHeight, gridSize, currentTheme]); 

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const resizeCanvas = () => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const aspectRatio = baseCanvasWidth / baseCanvasHeight;
            let displayWidth = containerWidth;
            let displayHeight = containerWidth / aspectRatio;

            if (displayHeight > containerHeight) {
                displayHeight = containerHeight;
                displayWidth = containerHeight * aspectRatio;
            }

            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [baseCanvasWidth, baseCanvasHeight]); 

    return (
        <div
            ref={containerRef}
            className="flex justify-center items-center p-4 bg-tertiary dark:bg-gray-900 min-h-[400px] overflow-hidden rounded-lg shadow-inner" 
        >
            <canvas
                ref={canvasRef}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="block border rounded-lg shadow-md cursor-crosshair" // Tailwind for canvas appearance
                style={{
                    borderColor: currentTheme === 'dark' ? COLORS.borderDark : COLORS.borderLight,
                    boxShadow: `0 4px 15px ${currentTheme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
                }}
            />
        </div>
    );
};