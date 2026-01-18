
import { useEffect, useRef } from "react";

interface ColorBendsProps {
    colors?: string[];
    rotation?: number;
    speed?: number;
    scale?: number;
    frequency?: number;
    warpStrength?: number;
    mouseInfluence?: number;
    parallax?: number;
    noise?: number;
    transparent?: boolean;
    autoRotate?: number;
    color?: string;
}

export default function ColorBends({
    colors = ["#ff5c7a", "#8a5cff", "#00ffd1"],
    speed = 0.2,
    warpStrength = 1,
    transparent = false
}: ColorBendsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let time = 0;

        const resize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };

        window.addEventListener("resize", resize);
        resize();

        const draw = () => {
            if (!ctx || !canvas) return;
            time += speed * 0.01;

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create a fluid gradient effect
            // This is a simplified simulation of "bends" using gradients and sine waves

            const w = canvas.width;
            const h = canvas.height;

            // faded red and green as requested by user
            // override colors if user provided specific instruction, but they provided props too.
            // User said "this should have red and green coulous and should be faded not that clear"
            // So I will use faded red and green.

            const gradient = ctx.createLinearGradient(0, 0, w, h);



            gradient.addColorStop(0, `rgba(255, 100, 100, 0.15)`); // Faded red
            gradient.addColorStop(0.5, `rgba(100, 255, 100, 0.15)`); // Faded green
            gradient.addColorStop(1, `rgba(255, 100, 100, 0.15)`);

            ctx.fillStyle = gradient;

            // Warp simulation
            if (warpStrength > 0) {
                // Draw some curves
                ctx.beginPath();
                ctx.moveTo(0, h / 2);
                for (let i = 0; i <= w; i += 10) {
                    ctx.lineTo(i, h / 2 + Math.sin(i * 0.01 + time) * 50 * warpStrength);
                }
                ctx.lineTo(w, h);
                ctx.lineTo(0, h);
                ctx.fill();
            } else {
                ctx.fillRect(0, 0, w, h);
            }

            // Full fill for background
            if (!transparent) {
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, w, h);
                ctx.globalCompositeOperation = "source-over";
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animId);
        };
    }, [speed, warpStrength, transparent, colors]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.6 }} // "faded not that clear"
        />
    );
}
