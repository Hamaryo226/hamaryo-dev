import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiagramViewerProps {
  light: string;
  dark: string;
  alt: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const STEP = 1.4;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** 構成図のサムネイルと、クリックで開く拡大縮小ビューア */
export function DiagramViewer({ light, dark, alt }: DiagramViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt}を拡大表示`}
        className="group relative block w-full rounded-xl border bg-card overflow-hidden shadow-sm cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <DiagramImages light={light} dark={dark} alt={alt} lazy />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border bg-background/80 px-2.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" />
          拡大
        </span>
      </button>
      {open && (
        <DiagramOverlay
          light={light}
          dark={dark}
          alt={alt}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/** ライト・ダークで差し替わる 1 枚組。拡大側では lazy を外して即座に出す */
function DiagramImages({
  light,
  dark,
  alt,
  lazy,
  className,
}: DiagramViewerProps & { lazy?: boolean; className?: string }) {
  const common = className ?? "w-full h-auto";
  return (
    <>
      <img
        src={light}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        draggable={false}
        className={`${common} dark:hidden`}
      />
      <img
        src={dark}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        draggable={false}
        className={`${common} hidden dark:block`}
      />
    </>
  );
}

function DiagramOverlay({
  light,
  dark,
  alt,
  onClose,
}: DiagramViewerProps & { onClose: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // ポインタ ID ごとの現在位置。2 本あるときはピンチとして扱う
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  // 倍率を上げても図が画面外へ流れ切らない範囲に平行移動を抑える
  const clampOffset = useCallback(
    (next: { x: number; y: number }, nextScale: number) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return next;
      const limitX = (rect.width * nextScale) / 2;
      const limitY = (rect.height * nextScale) / 2;
      return {
        x: clamp(next.x, -limitX, limitX),
        y: clamp(next.y, -limitY, limitY),
      };
    },
    [],
  );

  // 指定した画面座標を固定したまま倍率を変える。座標省略時は中央を基準にする
  const zoomTo = useCallback(
    (nextScale: number, clientX?: number, clientY?: number) => {
      const rect = stageRef.current?.getBoundingClientRect();
      const target = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      setScale((current) => {
        if (rect && clientX !== undefined && clientY !== undefined) {
          const cx = clientX - (rect.left + rect.width / 2);
          const cy = clientY - (rect.top + rect.height / 2);
          const ratio = target / current;
          setOffset((o) =>
            clampOffset(
              { x: cx - ratio * (cx - o.x), y: cy - ratio * (cy - o.y) },
              target,
            ),
          );
        } else {
          setOffset((o) => clampOffset(o, target));
        }
        return target;
      });
    },
    [clampOffset],
  );

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // 開いている間は背面をスクロールさせない
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomTo(scale * STEP);
      else if (e.key === "-" || e.key === "_") zoomTo(scale / STEP);
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, reset, scale, zoomTo]);

  // ホイールはブラウザのスクロールを止めたいので、passive でない listener で受ける
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY / 400);
      zoomTo(scale * factor, e.clientX, e.clientY);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [scale, zoomTo]);

  const pointerDistance = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      pinchStart.current = { dist: pointerDistance(), scale };
      dragStart.current = null;
    } else {
      dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinchStart.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const ratio = pointerDistance() / pinchStart.current.dist;
      zoomTo(
        pinchStart.current.scale * ratio,
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
      );
    } else if (dragStart.current) {
      setOffset(
        clampOffset(
          {
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
          },
          scale,
        ),
      );
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) dragStart.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2 sm:px-4">
        <span className="truncate text-sm font-medium">{alt}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="縮小"
            disabled={scale <= MIN_SCALE}
            onClick={() => zoomTo(scale / STEP)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="拡大"
            disabled={scale >= MAX_SCALE}
            onClick={() => zoomTo(scale * STEP)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="等倍に戻す"
            onClick={reset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="閉じる"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(e) =>
          scale > MIN_SCALE ? reset() : zoomTo(2.5, e.clientX, e.clientY)
        }
        className="relative flex-1 touch-none overflow-hidden"
        style={{ cursor: scale > MIN_SCALE ? "grab" : "zoom-in" }}
      >
        <div
          className="flex h-full w-full items-center justify-center p-2 sm:p-4"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition:
              dragStart.current || pinchStart.current
                ? "none"
                : "transform 150ms ease-out",
          }}
        >
          <DiagramImages
            light={light}
            dark={dark}
            alt={alt}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
      <p className="border-t px-3 py-2 text-center text-xs text-muted-foreground sm:px-4">
        ドラッグで移動、ホイールかピンチで拡大縮小、Esc で閉じる
      </p>
    </div>
  );
}
