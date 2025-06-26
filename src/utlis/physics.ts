import type { Particle, ForceField } from '../types/particle';

export interface PhysicsConfig {
    gravity?: number;
    pixelsPerMeter?: number;
    airDensity?: number;
    dragCoefficient?: number;
    restitution?: number;
    kineticFriction?: number;
    subSteps?: number;
}

const DEFAULT_CONFIG: Required<PhysicsConfig> = {
    gravity: 9.81,
    pixelsPerMeter: 100,
    airDensity: 1.225,
    dragCoefficient: 0.47,
    restitution: 0.7,
    kineticFriction: 0.05,
    subSteps: 4,
};

export function updateParticle(
    p: Particle,
    dt: number,
    forceField: ForceField,
    canvasWidth: number,
    canvasHeight: number,
    config: PhysicsConfig = {}
): Particle {
    const {
        gravity,
        pixelsPerMeter,
        airDensity,
        dragCoefficient,
        restitution,
        kineticFriction,
        subSteps,
    } = { ...DEFAULT_CONFIG, ...config };

    let { x, y, vx, vy, mass } = p;

    const effectiveRadiusPixels = 18 + 4 * Math.sqrt(mass);
    const effectiveRadiusMeters = effectiveRadiusPixels / pixelsPerMeter;
    const area = Math.PI * effectiveRadiusMeters * effectiveRadiusMeters;
    const massKg = mass;

    // Sub-stepping for stability and accuracy
    const stepDt = dt / subSteps;
    for (let step = 0; step < subSteps; step++) {
        let vxMS = vx / pixelsPerMeter;
        let vyMS = vy / pixelsPerMeter;

        let ax = forceField.x;
        let ay = gravity + forceField.y;

        const speedMS = Math.sqrt(vxMS * vxMS + vyMS * vyMS);
        if (speedMS > 0.01) {
            const dragMagnitude = 0.5 * airDensity * speedMS * speedMS * dragCoefficient * area;
            const dragAcceleration = dragMagnitude / massKg;
            ax -= (vxMS / speedMS) * dragAcceleration;
            ay -= (vyMS / speedMS) * dragAcceleration;
        }

        vxMS += ax * stepDt;
        vyMS += ay * stepDt;

        x += vxMS * pixelsPerMeter * stepDt;
        y += vyMS * pixelsPerMeter * stepDt;

        let onGround = false;

        // Horizontal wall collisions
        if (x + effectiveRadiusPixels > canvasWidth) {
            x = canvasWidth - effectiveRadiusPixels;
            vxMS = -vxMS * restitution;
        } else if (x - effectiveRadiusPixels < 0) {
            x = effectiveRadiusPixels;
            vxMS = -vxMS * restitution;
        }

        // Vertical wall collisions
        if (y + effectiveRadiusPixels > canvasHeight) {
            y = canvasHeight - effectiveRadiusPixels;
            vyMS = -vyMS * restitution;
            onGround = true;
        } else if (y - effectiveRadiusPixels < 0) {
            y = effectiveRadiusPixels;
            vyMS = -vyMS * restitution;
        }

        // Friction on ground
        if (onGround) {
            const frictionAccelX = kineticFriction * Math.abs(gravity + forceField.y);
            if (Math.abs(vxMS) > 0) {
                const frictionEffect = Math.sign(vxMS) * frictionAccelX * stepDt;
                if (Math.abs(vxMS) > Math.abs(frictionEffect)) {
                    vxMS -= frictionEffect;
                } else {
                    vxMS = 0;
                }
            }
            if (Math.abs(vyMS) < 0.2) {
                vyMS *= 0.8;
            }
        }

        // Thresholds for rest
        const MIN_VELOCITY_THRESHOLD_MS = 0.05;
        if (onGround && Math.abs(vxMS) < MIN_VELOCITY_THRESHOLD_MS) vxMS = 0;
        if (onGround && Math.abs(vyMS) < MIN_VELOCITY_THRESHOLD_MS) vyMS = 0;
        if (Math.abs(vxMS) < 0.001) vxMS = 0;
        if (Math.abs(vyMS) < 0.001) vyMS = 0;

        vx = vxMS * pixelsPerMeter;
        vy = vyMS * pixelsPerMeter;
    }

    return { ...p, x, y, vx, vy };
}