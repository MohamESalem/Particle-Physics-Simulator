import type { Particle } from '../types/particle'
import { COLORS } from '../themes/colors';

export function drawParticle(
    ctx: CanvasRenderingContext2D,
    p: Particle,
    selected: boolean
) {
    const baseRadius = 18;
    const r = baseRadius + 4 * Math.sqrt(p.mass);

    ctx.save();
    ctx.translate(p.x, p.y);

    drawParticleShadow(ctx, p, r);

    drawParticleBody(ctx, p, r, selected);

    if (selected) {
        drawSelectionHighlight(ctx, p, r);
    }

    drawVelocityArrow(ctx, p);

    if (p.mass > 1) {
        drawMassIndicator(ctx, p, r);
    }

    ctx.restore();
}

function drawParticleShadow(ctx: CanvasRenderingContext2D, p: Particle, r: number) {
    ctx.save();
    
    ctx.globalAlpha = 0.08;
    ctx.filter = 'blur(12px)';
    ctx.fillStyle = COLORS.shadowDark;
    drawParticleShape(ctx, p, 8, 12, r * 1.3);
    
    ctx.globalAlpha = 0.15;
    ctx.filter = 'blur(4px)';
    drawParticleShape(ctx, p, 3, 5, r * 1.1);
    
    ctx.restore();
}

function drawParticleBody(ctx: CanvasRenderingContext2D, p: Particle, r: number, selected: boolean) {
    ctx.save();
    
    let grad: CanvasGradient | null = null;
    const baseColor = selected ? COLORS.particleSelected : p.color;
    
    if (p.shape === 'circle') {
        grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
        grad.addColorStop(0, lightenColor(baseColor, 20));
        grad.addColorStop(0.7, baseColor);
        grad.addColorStop(1, darkenColor(baseColor, 30));
    } else {
        grad = ctx.createLinearGradient(-r, -r, r, r);
        grad.addColorStop(0, lightenColor(baseColor, 15));
        grad.addColorStop(0.5, baseColor);
        grad.addColorStop(1, darkenColor(baseColor, 25));
    }

    ctx.beginPath();
    drawParticleShape(ctx, p, 0, 0, r);
    ctx.fillStyle = grad || baseColor;
    ctx.globalAlpha = 1;
    
    ctx.shadowColor = selected ? COLORS.particleSelected : COLORS.shadowLight;
    ctx.shadowBlur = selected ? 25 : 15;
    ctx.shadowOffsetX = selected ? 0 : 2;
    ctx.shadowOffsetY = selected ? 0 : 3;
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = lightenColor(baseColor, 40);
    ctx.beginPath();
    drawParticleShape(ctx, p, -r * 0.3, -r * 0.3, r * 0.4);
    ctx.fill();
    ctx.restore();

    ctx.restore();
}

function drawSelectionHighlight(ctx: CanvasRenderingContext2D, p: Particle, r: number) {
    ctx.save();
    
    const time = Date.now() * 0.003;
    const pulse = 0.8 + 0.2 * Math.sin(time * 2);
    
    ctx.globalAlpha = 0.4 * pulse;
    ctx.lineWidth = 3;
    ctx.strokeStyle = COLORS.particleSelected;
    ctx.shadowColor = COLORS.particleSelected;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    drawParticleShape(ctx, p, 0, 0, r + 8);
    ctx.stroke();
    
    ctx.globalAlpha = 0.6 * pulse;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    drawParticleShape(ctx, p, 0, 0, r + 4);
    ctx.stroke();
    
    ctx.restore();
}

function drawVelocityArrow(ctx: CanvasRenderingContext2D, p: Particle) {
    const velocityMag = Math.sqrt(p.vx ** 2 + p.vy ** 2);
    if (velocityMag < 1) return;

    ctx.save();
    ctx.globalAlpha = 0.85;
    
    const time = Date.now() * 0.005;
    const arrowColor = `#000000`;
    
    const len = Math.min(velocityMag * 0.8, 50);
    const angle = Math.atan2(p.vy, p.vx);
    
        
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
    ctx.stroke();

    ctx.save();
    ctx.translate(Math.cos(angle) * len, Math.sin(angle) * len);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fillStyle = arrowColor;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.restore();

    ctx.restore();
}

function drawMassIndicator(ctx: CanvasRenderingContext2D, p: Particle, r: number) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = COLORS.bg3;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.mass.toFixed(1), 0, r + 15);
    ctx.restore();
}

function drawParticleShape(
    ctx: CanvasRenderingContext2D, 
    p: Particle, 
    offsetX: number, 
    offsetY: number, 
    radius: number
) {
    if (p.shape === 'circle') {
        ctx.arc(offsetX, offsetY, radius, 0, 2 * Math.PI);
    } else if (p.shape === 'square') {
        ctx.rect(offsetX - radius, offsetY - radius, 2 * radius, 2 * radius);
    } else {
        drawTrianglePath(ctx, offsetX, offsetY, radius);
    }
}

export function drawGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
) {
    ctx.save();

    const majorCount = 8;
    const minorCount = 32;
    const majorStepX = width / majorCount;
    const majorStepY = height / majorCount;
    const minorStepX = width / minorCount;
    const minorStepY = height / minorCount;

    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    
    for (let i = 1; i < minorCount; i++) {
        const x = i * minorStepX;
        if (Math.abs(x % majorStepX) > 1) {
            drawGridLine(ctx, x, 0, x, height);
        }
        
        const y = i * minorStepY;
        if (Math.abs(y % majorStepY) > 1) {
            drawGridLine(ctx, 0, y, width, y);
        }
    }

    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 1;
    
    for (let i = 1; i < majorCount; i++) {
        const x = i * majorStepX;
        drawGridLine(ctx, x, 0, x, height);
        
        const y = i * majorStepY;
        drawGridLine(ctx, 0, y, width, y);
    }

    ctx.globalAlpha = 0.25;
    for (let i = 1; i < majorCount; i++) {
        const x = i * majorStepX;
        for (let j = 1; j < majorCount; j++) {
            const y = j * majorStepY;
            drawGridDot(ctx, x, y);
        }
    }

    ctx.restore();
}

// Helper for drawing grid lines with subtle gradient
function drawGridLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawGridDot(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = COLORS.grid;
    ctx.shadowColor = COLORS.grid;
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.restore();
}

export function drawTrianglePath(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    r: number
) {
    const height = r * 1.2;
    const width = r * 1.1;
    
    ctx.moveTo(offsetX, offsetY - height * 0.6);
    ctx.lineTo(offsetX - width, offsetY + height * 0.4);
    ctx.lineTo(offsetX + width, offsetY + height * 0.4);
    ctx.closePath();
}

function lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function darkenColor(color: string, percent: number): string {
    return lightenColor(color, -percent);
}
