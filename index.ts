type interval = { min: number, max: number }
type vectorInterval = { x: interval, y: interval }
type vector = { x: number, y: number }

class Particle {
    private parent: ParticleSystem
    private readonly id: string
    public position: vector = { x: 0, y: 0 }
    public diameter = 0
    public life = 0
    public speed: vector = { x: 0, y: 0 }
    public init() {
        const interval = setInterval(() => {
            this.position.x += this.speed.x*60/1000
            this.position.y -= this.speed.y*60/1000
            this.life -= 1/60
            if(this.life <= 0) {
                clearInterval(interval)
                this.parent.particles.delete(this.id)
            }
        }, 1000/60)
    }
    constructor(id: string, parent: ParticleSystem) {
        this.parent = parent
        this.id = id
        this.init()
    }
}

class ParticleSystem {
    public canvas: HTMLCanvasElement
    public size: vector
    
    private lastId = 0
    public ammount = 0
    public particles: Map<string, Particle> = new Map()
    public diameter: interval = { min: 0, max: 0 }
    public life: interval = { min: 0, max: 0 }
    public speed: vectorInterval = { x: { min: 0, max: 0 }, y: { min: 0, max: 0} }
    public static getRandomNumberInInterval(invterval: interval) {
        const min = Math.ceil(invterval.min);
        const max = Math.floor(invterval.max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    public createParticle() {
        const particle = new Particle(this.lastId.toString(), this)
        particle.position.x = ParticleSystem.getRandomNumberInInterval({ min: 0, max: this.size.x })
        particle.position.y = ParticleSystem.getRandomNumberInInterval({ min: 0, max: this.size.y })
        particle.diameter = ParticleSystem.getRandomNumberInInterval(this.diameter)
        particle.life = ParticleSystem.getRandomNumberInInterval(this.life)
        particle.speed.x = ParticleSystem.getRandomNumberInInterval(this.speed.x)
        particle.speed.y = ParticleSystem.getRandomNumberInInterval(this.speed.y)
        this.particles.set(this.lastId.toString(), particle)
        this.lastId++
    }
    public init() {
        const ctx = this.canvas.getContext('2d')
        ctx!.fillStyle = 'white'

        for(let i = 0; i < this.ammount; i++) this.createParticle()
            
        setInterval(() => {
            if(this.particles.size <= this.ammount) this.createParticle()
        }, 1000/60)

        setInterval(() => {
            ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.particles.forEach((particle: Particle) => {
                ctx?.beginPath();
                ctx?.arc(particle.position.x, particle.position.y, particle.diameter / 2, 0, 2 * Math.PI, false);
                ctx?.closePath()
                ctx?.fill();
            })
        }, 1000/60)
    }
    constructor(canvas: HTMLCanvasElement, size: vector) {
        this.canvas = canvas
        this.size = size
        canvas.width = size.x
        canvas.height = size.y
    }
}

(function(global: typeof window) {
    const cssParticles = { ParticleSystem: ParticleSystem, Particle: Particle }
    global.cssParticles = cssParticles
})(window)