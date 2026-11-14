// Original Tidal Trace field: folded estuary ribbons, etched contours and mineral grain.
// No textures, third-party shader code, or graphics dependency.
export function tidalSize(width: number, height: number, dpr: number) {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const scale = Math.min(Math.max(1, dpr), 1.5, Math.sqrt(1_200_000 / (w * h)));
  return {
    width: Math.max(1, Math.floor(w * scale)),
    height: Math.max(1, Math.floor(h * scale)),
  };
}

const vertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;
const fragment = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec3 pointer;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float folds(vec2 p) {
  return .57*noise(p) + .28*noise(p*2.07+7.1) + .15*noise(p*4.13-3.7);
}
void main() {
  vec2 uv = (gl_FragCoord.xy*2.0-resolution)/resolution.y;
  vec2 original = uv;
  vec2 d = uv-pointer.xy;
  float influence = exp(-dot(d,d)*3.2)*pointer.z;
  uv += vec2(-d.y,d.x)*influence*.42;
  uv += d*influence*.09;
  float t = time*.065;
  vec3 color = vec3(.012,.016,.019);
  // Three unequal sediment sheets cross the frame, not concentric bodies.
  for (int i=0; i<3; i++) {
    float layer = float(i);
    vec2 p = uv;
    float angle = -.42+layer*.39;
    p = mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p;
    p.x += layer*.37;
    float warp = folds(vec2(p.x*.8+t*.22, layer*3.0+p.y*.28));
    float spine = .38*sin(p.x*1.65+t+layer*2.4) + .17*sin(p.x*3.1-t*.48+layer);
    float width = .19+.14*noise(vec2(p.x*.72+layer*4.0,t*.17));
    float offset = (layer-1.0)*.68;
    float across = (p.y-spine-offset-(warp-.5)*.42)/width;
    float envelope = exp(-across*across*.72);
    float ribs = across*27.0 + sin(p.x*4.5+t)*2.7 + folds(p*3.0+layer)*4.0;
    float etching = pow(.5+.5*cos(ribs*6.28318),18.0);
    float weave = .4+.6*noise(vec2(p.x*230.0, across*13.0));
    float ridge = pow(max(0.0,1.0-abs(across+.36)*.63),3.0);
    float light = envelope*(.035 + ridge*.25 + etching*weave*.36);
    float fringe = smoothstep(.52,.88,noise(vec2(p.x*.78+layer*9.0,across*.35+t*.08)));
    vec3 silver = vec3(.65,.73,.75);
    vec3 interference = .46+.32*cos(vec3(0.1,2.0,4.1)+across*1.6+p.x*.9+layer*1.8);
    vec3 material = mix(silver, interference, fringe*.73);
    // Sparse highlights lie ON the sheet, not in a starfield behind it.
    vec2 grainCell = floor(gl_FragCoord.xy/1.65);
    float mineral = pow(hash(grainCell+layer*37.0),22.0);
    color += material*light + mineral*envelope*ridge*.16;
  }
  // Quiet elliptical negative space keeps the fixed title legible.
  float quiet = smoothstep(.08,.92,length(original*vec2(.8,1.9)));
  color *= .19+.81*quiet;
  float edge = 1.0-.2*smoothstep(.5,2.2,length(original));
  color *= edge;
  gl_FragColor = vec4(color,1.0);
}
`;

export type TidalStatus = {
  renderer: "webgl" | "fallback";
  motion: "running" | "paused" | "reduced" | "hidden" | "static";
};

export function createTidalRenderer(
  canvas: HTMLCanvasElement,
  onStatus: (status: TidalStatus) => void,
) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let gl: WebGLRenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let shaders: WebGLShader[] = [];
  let uniforms: (WebGLUniformLocation | null)[] = [];
  let frame = 0;
  let last = 0;
  let elapsed = 0;
  let paused = false;
  let destroyed = false;
  let lost = false;
  let px = 10,
    py = 10,
    strength = 0;
  let tx = 10,
    ty = 10,
    targetStrength = 0;
  let pointerTime = 0;

  function publish() {
    onStatus({
      renderer: program && !lost ? "webgl" : "fallback",
      motion:
        !program || lost
          ? "static"
          : media.matches
            ? "reduced"
            : paused
              ? "paused"
              : document.hidden
                ? "hidden"
                : "running",
    });
  }
  function cancel() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }
  function release() {
    if (gl) {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach((shader) => gl?.deleteShader(shader));
    }
    buffer = null;
    program = null;
    shaders = [];
    uniforms = [];
  }
  function init() {
    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
      if (!gl) return;
      const context = gl;
      function compile(type: number, source: string) {
        const shader = context.createShader(type);
        if (!shader) throw new Error("Shader allocation failed");
        shaders.push(shader);
        context.shaderSource(shader, source);
        context.compileShader(shader);
        if (!context.getShaderParameter(shader, context.COMPILE_STATUS))
          throw new Error("Shader compilation failed");
        return shader;
      }
      program = gl.createProgram();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Drivers can fail allocation despite DOM typings.
      if (!program) throw new Error("Program allocation failed");
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error("Program link failed");
      gl.useProgram(program);
      buffer = gl.createBuffer();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Drivers can fail allocation despite DOM typings.
      if (!buffer) throw new Error("Buffer allocation failed");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      uniforms = ["resolution", "time", "pointer"].map((name) =>
        context.getUniformLocation(program!, name),
      );
    } catch {
      release();
    }
  }
  function draw() {
    if (!gl || !program || lost || destroyed) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms[0], canvas.width, canvas.height);
    gl.uniform1f(uniforms[1], elapsed);
    gl.uniform3f(uniforms[2], px, py, strength);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function running() {
    return (
      !destroyed &&
      !lost &&
      !!program &&
      !paused &&
      !media.matches &&
      !document.hidden
    );
  }
  function tick(now: number) {
    frame = 0;
    if (!running()) return;
    if (!last || now - last >= 1000 / 30) {
      elapsed += last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      strength += (targetStrength - strength) * 0.08;
      targetStrength *= 0.97;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancel();
    if (media.matches) {
      px = tx = 10;
      py = ty = 10;
      strength = targetStrength = 0;
      draw();
    }
    publish();
    if (running()) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const size = tidalSize(
      rect.width,
      rect.height,
      window.devicePixelRatio || 1,
    );
    if (canvas.width !== size.width || canvas.height !== size.height) {
      canvas.width = size.width;
      canvas.height = size.height;
    }
    draw();
  }
  function move(event: PointerEvent) {
    if (!running() || event.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) * 2 - rect.width) / rect.height;
    const y = (rect.height - (event.clientY - rect.top) * 2) / rect.height;
    const dt = Math.max(16, event.timeStamp - pointerTime);
    const speed = pointerTime
      ? Math.min(1, (Math.hypot(x - tx, y - ty) * 180) / dt)
      : 0;
    if (!pointerTime) {
      px = x;
      py = y;
    }
    tx = x;
    ty = y;
    pointerTime = event.timeStamp;
    targetStrength = 0.22 + speed * 0.78;
  }
  function leave() {
    targetStrength = 0;
    pointerTime = 0;
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    cancel();
    publish();
  }
  function contextRestored() {
    if (destroyed) return;
    release();
    lost = false;
    init();
    resize();
    sync();
  }
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerleave", leave);
  media.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", resize);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  init();
  resize();
  sync();
  return {
    setPaused(value: boolean) {
      paused = value;
      sync();
    },
    destroy() {
      destroyed = true;
      cancel();
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", resize);
      release();
    },
  };
}
