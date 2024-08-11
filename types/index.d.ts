declare global {
    interface Window {
        cssParticles: { ParticleSystem: typeof ParticleSystem, Particle: typeof Particle }
    }
}

export {}