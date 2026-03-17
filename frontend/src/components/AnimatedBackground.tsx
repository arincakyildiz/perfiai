"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < 640;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    canvas.width = width;
    canvas.height = height;

    type Particle = {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
      color: string;
    };

    const colors = [
      "139,92,246", // violet
      "244,114,182", // pink
      "196,181,253", // lavender
      "252,211,77", // gold
      "167,139,168", // mauve
    ];

    const particles: Particle[] = [];

    function createParticles() {
      particles.length = 0;

      if (reduceMotion.matches) return;

      const density = isMobile ? 36000 : 25000;
      const maxCount = isMobile ? 24 : 60;
      const count = Math.min(Math.floor((width * height) / density), maxCount);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (isMobile ? 1.8 : 2.5) + 0.5,
          speedX: (Math.random() - 0.5) * (isMobile ? 0.18 : 0.3),
          speedY: (Math.random() - 0.5) * (isMobile ? 0.18 : 0.3),
          opacity: Math.random() * 0.35 + 0.08,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    createParticles();

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      if (reduceMotion.matches) return;

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const currentOpacity =
          p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color},${currentOpacity})`;
        ctx!.fill();

        // glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color},${currentOpacity * 0.15})`;
        ctx!.fill();
      }

      // connection lines between nearby particles
      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const lineOpacity = (1 - dist / 150) * 0.06;
              ctx!.beginPath();
              ctx!.moveTo(particles[i].x, particles[i].y);
              ctx!.lineTo(particles[j].x, particles[j].y);
              ctx!.strokeStyle = `rgba(139,92,246,${lineOpacity})`;
              ctx!.lineWidth = 0.5;
              ctx!.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 640;
      canvas!.width = width;
      canvas!.height = height;
      createParticles();
    }

    window.addEventListener("resize", handleResize);
    reduceMotion.addEventListener("change", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      reduceMotion.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 hidden h-full w-full sm:block" />

      {/* Large gradient orbs */}
      <div className="absolute -right-32 -top-28 h-[260px] w-[260px] rounded-full bg-violet-500/10 blur-[90px] animate-pulse-glow dark:bg-violet-500/12 sm:-right-40 sm:-top-40 sm:h-[500px] sm:w-[500px] sm:blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 h-[220px] w-[220px] rounded-full bg-pink-500/8 blur-[80px] animate-float dark:bg-pink-500/10 sm:-bottom-40 sm:-left-40 sm:h-[400px] sm:w-[400px] sm:blur-[100px]" />
      <div className="absolute left-1/2 top-1/2 hidden h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/4 blur-[120px] animate-pulse-glow dark:bg-violet-400/8 sm:block" style={{ animationDelay: "2s" }} />
      <div className="absolute right-1/4 top-1/4 hidden h-[250px] w-[250px] rounded-full bg-pink-400/5 blur-[80px] animate-float dark:bg-pink-400/8 sm:block" style={{ animationDelay: "3s" }} />
    </div>
  );
}
