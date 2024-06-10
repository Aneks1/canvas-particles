const canvas = document.getElementById('container') as HTMLCanvasElement
const ctx = canvas!.getContext('2d')
ctx!.fillStyle = 'white'
console.log(canvas.width)

type interval = { min: number, max: number }
type vectorInterval = { x: interval, y: interval }
type vector = { x: number, y: number }

class ParticleSystem {
    private lastId = 0
    public particles: Map<string, Particle> = new Map()
    public size: vectorInterval = { x: { min: 0, max: 0 }, y: { min: 0, max: 0} }
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
        particle.position.x = ParticleSystem.getRandomNumberInInterval(this.size.x)
        particle.position.y = ParticleSystem.getRandomNumberInInterval(this.size.y)
        particle.diameter = ParticleSystem.getRandomNumberInInterval(this.diameter)
        particle.life = ParticleSystem.getRandomNumberInInterval(this.life)
        particle.speed.x = ParticleSystem.getRandomNumberInInterval(this.speed.x)
        particle.speed.y = ParticleSystem.getRandomNumberInInterval(this.speed.y)
        this.particles.set(this.lastId.toString(), particle)
        this.lastId++
    }
}

class Particle {
    private parent: ParticleSystem
    private readonly id: string
    public position: vector = { x: 0, y: 0 }
    public diameter: number = 0
    public life: number = 0
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

const system = new ParticleSystem()
system.size = { x: { min: 0, max: canvas.width }, y: { min: 0, max: canvas.height } }
system.diameter = { min: 1, max: 3 }
system.life = { min: 5, max: 10 }
system.speed = { x: { min: -15, max: 15 }, y: { min: -15, max: 15 } }

setInterval(() => {
    system.createParticle()
}, 400)

setInterval(() => {
    ctx!.clearRect(0, 0, canvas.width, canvas.height)
    system.particles.forEach((particle: Particle, key: string) => {
        ctx!.beginPath();
        ctx!.arc(particle.position.x, particle.position.y, particle.diameter / 2, 0, 2 * Math.PI, false);
        ctx!.closePath()
        ctx!.fill();
    })
}, 1000/60)