"use client";

import { useEffect, useRef } from "react";

interface DataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
  height?: number;
}

export default function ProgressChart({
  data,
  title,
  color = "var(--primary)",
  height = 200,
}: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Find min and max values
    const values = data.map((d) => d.value);
    const maxValue = Math.max(...values) * 1.1; // Add 10% padding
    const minValue = Math.min(0, ...values);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "hsl(var(--border))";
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Draw y-axis labels
    ctx.fillStyle = "hsl(var(--muted-foreground))";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const value = maxValue - (i * (maxValue - minValue)) / ySteps;
      const y = padding + (i * chartHeight) / ySteps;
      ctx.fillText(value.toFixed(0), padding - 10, y);

      // Draw horizontal grid lines
      ctx.beginPath();
      ctx.strokeStyle = "hsl(var(--border))";
      ctx.setLineDash([2, 2]);
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw x-axis labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const xStep = chartWidth / (data.length - 1 || 1);
    data.forEach((point, i) => {
      const x = padding + i * xStep;
      if (i % Math.ceil(data.length / 7) === 0 || i === data.length - 1) {
        // Show only a few labels to avoid crowding
        ctx.fillText(point.date, x, padding + chartHeight + 10);
      }
    });

    // Draw data line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";

    data.forEach((point, i) => {
      const x = padding + i * xStep;
      const yRatio = (point.value - minValue) / (maxValue - minValue);
      const y = padding + chartHeight - yRatio * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw data points
    data.forEach((point, i) => {
      const x = padding + i * xStep;
      const yRatio = (point.value - minValue) / (maxValue - minValue);
      const y = padding + chartHeight - yRatio * chartHeight;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "hsl(var(--background))";
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw title
    ctx.fillStyle = "hsl(var(--foreground))";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(title, padding, 10);
  }, [data, title, color]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={height}
      className="w-full h-auto"
    ></canvas>
  );
}
