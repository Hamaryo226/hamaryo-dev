import { useEffect, useRef, useState } from "react";
import { createTidalRenderer } from "@/lib/tidal";
import type { TidalStatus } from "@/lib/tidal";
import "./tidal-trace.css";

// Deterministic vector contours are present in the SSR document, including without JS.
function StaticTide() {
  const paths = Array.from({ length: 72 }, (_, i) => {
    const layer = Math.floor(i / 24);
    const contour = (i % 24) / 23;
    const points = Array.from({ length: 90 }, (_point, j) => {
      const x = -250 + j * 22;
      const y =
        460 +
        (layer - 1) * 275 +
        Math.sin(x * 0.0035 + layer * 2.1) * 210 +
        Math.sin(x * 0.007 + layer) * 55 +
        (contour - 0.5) * (85 + Math.sin(x * 0.002) * 60);
      return `${j ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
    return (
      <path
        key={i}
        d={points}
        fill="none"
        stroke={i % 19 === 0 ? "#817764" : i % 13 === 0 ? "#526d71" : "#9ba5a7"}
        strokeWidth={i % 7 === 0 ? 1.3 : 0.65}
        opacity={0.16 + contour * 0.24}
      />
    );
  });
  return (
    <svg
      data-tidal-fallback
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="tidal-fallback"
    >
      <rect width="1440" height="900" fill="#030507" />
      {paths}
      <defs>
        <radialGradient id="tidal-quiet">
          <stop offset="0" stopColor="#030507" stopOpacity=".94" />
          <stop offset="1" stopColor="#030507" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="720" cy="450" rx="400" ry="200" fill="url(#tidal-quiet)" />
    </svg>
  );
}

export function TidalTrace() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof createTidalRenderer> | null>(null);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState<TidalStatus>({
    renderer: "fallback",
    motion: "static",
  });
  useEffect(() => {
    if (!canvas.current) return;
    const instance = createTidalRenderer(canvas.current, setStatus);
    renderer.current = instance;
    return () => {
      instance.destroy();
      renderer.current = null;
    };
  }, []);
  const motionLabel =
    status.motion === "reduced" || status.renderer === "fallback"
      ? "背景は静止表示です"
      : paused
        ? "背景の動きを再開"
        : "背景の動きを停止";
  function toggle() {
    if (status.motion === "reduced" || status.renderer === "fallback") return;
    const value = !paused;
    setPaused(value);
    renderer.current?.setPaused(value);
  }
  return (
    <main className="tidal-home">
      <div className="tidal-surface" aria-hidden="true">
        <StaticTide />
        <canvas
          ref={canvas}
          aria-hidden="true"
          data-renderer={status.renderer}
          data-motion={status.motion}
          className="tidal-canvas"
        />
      </div>
      <button
        type="button"
        className="tidal-motion-control"
        onClick={toggle}
        aria-label={motionLabel}
        aria-disabled={
          status.motion === "reduced" || status.renderer === "fallback"
        }
        aria-pressed={
          paused ||
          status.motion === "reduced" ||
          status.renderer === "fallback"
        }
        aria-describedby="tidal-instructions"
      >
        <span aria-hidden="true" className="tidal-control-label">
          {motionLabel}
        </span>
      </button>
      <h1 className="tidal-title">hamaryo.dev</h1>
      <p id="tidal-instructions" className="sr-only">
        背景作品「潮汐の軌跡」。背景のクリックやタップでは停止しません。Tabで専用の停止・再開ボタンを表示し、SpaceまたはEnterで操作できます。表示中のボタンはクリックでも操作できます。動きを減らす設定では静止画を表示し、ポインターには反応しません。
      </p>
    </main>
  );
}
