export type ShapeType = 'circle' | 'square' | 'triangle';

export interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
    shape: ShapeType;
    color: string;
}

export interface ForceField {
    x: number;
    y: number;
}