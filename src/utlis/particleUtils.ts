import type { Particle } from "../types/particle";

const HOVER_MARGIN = 6; 

export function isMouseOverParticle(p: Particle, mx: number, my: number): boolean {
    const r = 18 + 4 * Math.sqrt(p.mass) + HOVER_MARGIN;

    switch (p.shape) {
        case "circle":
            return (mx - p.x) ** 2 + (my - p.y) ** 2 <= r * r;
        case "square":
            return Math.abs(mx - p.x) <= r && Math.abs(my - p.y) <= r;
        case "triangle":
            return (
                mx >= p.x - r &&
                mx <= p.x + r &&
                my >= p.y - r &&
                my <= p.y + r
            );
        default:
            return false;
    }
}