import { useCallback, useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  speedx: number;
  speedy: number;
  radius: number;
}

interface ParticleNetworkProps {
  isDark?: boolean;
  particleCount?: number;
  maxDistance?: number;
  repulsionRadius?: number;
  repulsionStrength?: number;
}

export default function ParticleNetwork({
  isDark = true,
  particleCount = 200,
  maxDistance = 200,
  repulsionRadius = 100,
  repulsionStrength = 0.5,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const colors = {
    particle: isDark ? "rgba(200, 200, 200, 0.3)" : "rgba(100, 120, 150, 0.2)",
    line: isDark ? "rgba(150, 150, 150, " : "rgba(80, 100, 130, ",
  };

  const getOptimalParticleCount = (width: number, height: number) => {
    const baseArea = 1440 * 900;
    const screenArea = width * height;
    return Math.max(40, Math.floor(particleCount * (screenArea / baseArea)));
  };

  const initializeParticles = useCallback(
    (width: number, height: number) => {
      const optimalCount = getOptimalParticleCount(width, height);
      const particles: Particle[] = [];
      for (let i = 0; i < optimalCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speedx: (Math.random() - 0.5) * 0.5,
          speedy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount]
  );

  const updateParticles = useCallback(
    (width: number, height: number) => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle) => {
        particle.x += particle.speedx;
        particle.y += particle.speedy;

        if (
          particle.x - particle.radius < 0 ||
          particle.x + particle.radius > width
        ) {
          particle.speedx *= -0.9;
          particle.x = Math.max(
            particle.radius,
            Math.min(width - particle.radius, particle.x)
          );
        }
        if (
          particle.y - particle.radius < 0 ||
          particle.y + particle.radius > height
        ) {
          particle.speedy *= -0.9;
          particle.y = Math.max(
            particle.radius,
            Math.min(height - particle.radius, particle.y)
          );
        }

        // Mouse repulsion
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius && distance > 0) {
          const force =
            (repulsionStrength * (repulsionRadius - distance)) /
            repulsionRadius;
          particle.speedx += (dx / distance) * force;
          particle.speedy += (dy / distance) * force;
        }

        particle.speedx *= 0.98;
        particle.speedy *= 0.98;

        particle.speedx += (Math.random() - 0.5) * 0.02;
        particle.speedy += (Math.random() - 0.5) * 0.02;
      });
    },
    [repulsionRadius, repulsionStrength]
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4;
            ctx.strokeStyle = `${colors.line}${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        ctx.fillStyle = colors.particle;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    },
    [colors.line, colors.particle, maxDistance]
  );

  const animate = useCallback(
    function loop() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      updateParticles(canvas.width, canvas.height);
      draw(ctx, canvas.width, canvas.height);

      animationIdRef.current = requestAnimationFrame(loop);
    },
    [draw, updateParticles]
  );

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (oldWidth > 0 && oldHeight > 0) {
      particlesRef.current.forEach((p) => {
        p.x *= newWidth / oldWidth;
        p.y *= newHeight / oldHeight;
      });

      const targetCount = getOptimalParticleCount(newWidth, newHeight);
      const currentCount = particlesRef.current.length;

      if (targetCount < currentCount) {
        particlesRef.current = particlesRef.current.slice(0, targetCount);
      } else if (targetCount > currentCount) {
        for (let i = currentCount; i < targetCount; i++) {
          particlesRef.current.push({
            x: Math.random() * newWidth,
            y: Math.random() * newHeight,
            speedx: (Math.random() - 0.5) * 0.5,
            speedy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 1.5 + 0.5,
          });
        }
      }
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
  };

  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (dimensions.width === 0 || dimensions.height === 0) return;

    initializeParticles(dimensions.width, dimensions.height);
  }, [dimensions.width, dimensions.height, initializeParticles, particleCount]);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setDimensions({ width: canvas.width, height: canvas.height });

    animationIdRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    animate,
    isDark,
    maxDistance,
    particleCount,
    repulsionRadius,
    repulsionStrength,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
