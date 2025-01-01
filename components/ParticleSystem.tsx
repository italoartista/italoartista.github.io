'use client'

import { useEffect, useRef } from 'react'
import p5 from 'p5'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

const ParticleSystem = () => {
  const canvasRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const containerRef = useRef(null)

  useEffect(() => {
    const sketches: p5[] = []

    const createSketch = (ref: React.RefObject<HTMLDivElement>, index: number) => {
      return new p5((p: p5) => {
        let particles: Particle[] = []
        let flowField: p5.Vector[] = []
        let cols: number, rows: number
        const scale = 50 * (index + 1) // Different scale for each canvas
        let zOffset = 0

        p.setup = () => {
          const canvas = p.createCanvas(p.windowWidth / 2, p.windowHeight / 2)
          canvas.parent(ref.current!)
          cols = p.floor(p.width / scale)
          rows = p.floor(p.height / scale)
          flowField = new Array(cols * rows)
          initParticles()
          p.background(0)
        }

        const initParticles = () => {
          particles = []
          for (let i = 0; i < 500; i++) {
            particles.push(new Particle(p))
          }
        }

        p.draw = () => {
          p.background(0, 10) // Add a slight fade effect
          let xOffset = 0
          for (let x = 0; x < cols; x++) {
            let yOffset = 0
            for (let y = 0; y < rows; y++) {
              const angle = p.noise(xOffset, yOffset, zOffset) * p.TWO_PI * 4
              const vector = p5.Vector.fromAngle(angle)
              vector.setMag(1)
              flowField[x + y * cols] = vector
              yOffset += 0.1
            }
            xOffset += 0.1
          }
          zOffset += 0.01

          for (let particle of particles) {
            particle.follow(flowField)
            particle.update()
            particle.edges()
            particle.show()
          }
        }

        class Particle {
          pos: p5.Vector
          vel: p5.Vector
          acc: p5.Vector
          maxSpeed: number
          prevPos: p5.Vector

          constructor(p: p5) {
            this.pos = p.createVector(p.random(p.width), p.random(p.height))
            this.vel = p.createVector(0, 0)
            this.acc = p.createVector(0, 0)
            this.maxSpeed = 2
            this.prevPos = this.pos.copy()
          }

          follow(vectors: p5.Vector[]) {
            const x = p.floor(this.pos.x / scale)
            const y = p.floor(this.pos.y / scale)
            const index = x + y * cols
            const force = vectors[index]
            this.applyForce(force)
          }

          applyForce(force: p5.Vector) {
            this.acc.add(force)
          }

          update() {
            this.vel.add(this.acc)
            this.vel.limit(this.maxSpeed)
            this.pos.add(this.vel)
            this.acc.mult(0)
          }

          edges() {
            if (this.pos.x > p.width) {
              this.pos.x = 0
              this.updatePrev()
            }
            if (this.pos.x < 0) {
              this.pos.x = p.width
              this.updatePrev()
            }
            if (this.pos.y > p.height) {
              this.pos.y = 0
              this.updatePrev()
            }
            if (this.pos.y < 0) {
              this.pos.y = p.height
              this.updatePrev()
            }
          }

          updatePrev() {
            this.prevPos.x = this.pos.x
            this.prevPos.y = this.pos.y
          }

          show() {
            p.stroke(255, 50)
            p.strokeWeight(1)
            p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
            this.updatePrev()
          }
        }

        return { initParticles }
      })
    }

    canvasRefs.forEach((ref, index) => {
      sketches.push(createSketch(ref, index))
    })

    // GSAP animation for the text
    const animateText = () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
      tl.to('#artist-name', {
        duration: 0,
        text: { value: "", delimiter: "" }
      })
      .to('#artist-name', {
        duration: 2,
        text: { value: "ITALO ADLER", delimiter: "" },
        ease: "power1.in"
      })
      .to('#artist-name', {
        duration: 1,
        text: { value: "ITALO ADLER - GENERATIVE", delimiter: "" },
        ease: "power1.in"
      })
      .to('#artist-name', {
        duration: 1,
        text: { value: "ITALO ADLER - GENERATIVE ARTIST", delimiter: "" },
        ease: "power1.in"
      })
      .to('#artist-name', {
        duration: 2,
        opacity: 1,
        ease: "power3.out"
      })
      .to('#artist-name', {
        duration: 1,
        opacity: 0,
        ease: "power3.in",
        delay: 2
      })
    }

    animateText()

    // GSAP animation for canvas reorganization
    const animateCanvases = () => {
      const canvases = containerRef.current!.children
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 5 })

      // Initial state
      gsap.set(canvases, { x: 0, y: 0, scale: 1 })

      // Animation sequence
      tl.to(canvases, {
        duration: 2,
        x: (i) => [200, -200, 200, -200][i],
        y: (i) => [200, 200, -200, -200][i],
        scale: 0.5,
        ease: "power2.inOut",
        stagger: 0.2
      })
      .to(canvases, {
        duration: 2,
        rotation: 360,
        ease: "power2.inOut",
        stagger: 0.2
      })
      .to(canvases, {
        duration: 2,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        ease: "power2.inOut",
        stagger: 0.2
      })
    }

    animateCanvases()

    // Restart sketches every 30 seconds
    const restartInterval = setInterval(() => {
      sketches.forEach(sketch => {
        sketch.background(0)
        sketch.initParticles()
      })
    }, 30000)

    return () => {
      sketches.forEach(sketch => sketch.remove())
      clearInterval(restartInterval)
    }
  }, [])

  return (
    <div ref={containerRef} className="grid grid-cols-2 grid-rows-2 w-full h-full">
      {canvasRefs.map((ref, index) => (
        <div key={index} ref={ref} className="w-full h-full" />
      ))}
    </div>
  )
}

export default ParticleSystem

