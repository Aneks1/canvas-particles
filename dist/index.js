"use strict";
const canvas = document.getElementById('container');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
console.log(canvas.width);
class ParticleSystem {
    lastId = 0;
    particles = new Map();
    size = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
    diameter = { min: 0, max: 0 };
    life = { min: 0, max: 0 };
    speed = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
    static getRandomNumberInInterval(invterval) {
        const min = Math.ceil(invterval.min);
        const max = Math.floor(invterval.max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    createParticle() {
        const particle = new Particle(this.lastId.toString(), this);
        particle.position.x = ParticleSystem.getRandomNumberInInterval(this.size.x);
        particle.position.y = ParticleSystem.getRandomNumberInInterval(this.size.y);
        particle.diameter = ParticleSystem.getRandomNumberInInterval(this.diameter);
        particle.life = ParticleSystem.getRandomNumberInInterval(this.life);
        particle.speed.x = ParticleSystem.getRandomNumberInInterval(this.speed.x);
        particle.speed.y = ParticleSystem.getRandomNumberInInterval(this.speed.y);
        this.particles.set(this.lastId.toString(), particle);
        this.lastId++;
    }
}
class Particle {
    parent;
    id;
    position = { x: 0, y: 0 };
    diameter = 0;
    life = 0;
    speed = { x: 0, y: 0 };
    init() {
        const interval = setInterval(() => {
            this.position.x += this.speed.x * 60 / 1000;
            this.position.y -= this.speed.y * 60 / 1000;
            this.life -= 1 / 60;
            if (this.life <= 0) {
                clearInterval(interval);
                this.parent.particles.delete(this.id);
            }
        }, 1000 / 60);
    }
    constructor(id, parent) {
        this.parent = parent;
        this.id = id;
        this.init();
    }
}
const system = new ParticleSystem();
system.size = { x: { min: 0, max: canvas.width }, y: { min: 0, max: canvas.height } };
system.diameter = { min: 1, max: 3 };
system.life = { min: 5, max: 10 };
system.speed = { x: { min: -15, max: 15 }, y: { min: -15, max: 15 } };
setInterval(() => {
    system.createParticle();
}, 400);
setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    system.particles.forEach((particle, key) => {
        ctx.beginPath();
        ctx.arc(particle.position.x, particle.position.y, particle.diameter / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    });
}, 1000 / 60);
