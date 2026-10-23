// Dev-only still frames of the two premium globe directions (mockups.html?still=a|b).
// A: dotted "data" globe, dot brightness from NASA night lights. B: realistic Earth at night.
// Both: lit outlines of the lived-in countries, light pillars, thick arcs, bloom.
import { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  QuadraticBezierCurve3,
  Quaternion,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  SRGBColorSpace,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { geoContains, geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import landTopo from "world-atlas/land-110m.json";
import countriesTopo from "world-atlas/countries-110m.json";
import { Check, ScanEye } from "lucide-react";
import fr from "flag-icons/flags/4x3/fr.svg";
import lb from "flag-icons/flags/4x3/lb.svg";
import sa from "flag-icons/flags/4x3/sa.svg";
import qa from "flag-icons/flags/4x3/qa.svg";
import ca from "flag-icons/flags/4x3/ca.svg";
import pe from "flag-icons/flags/4x3/pe.svg";
import nightUrl from "../../scripts/data/blackmarble-2016.webp";

const R = 1.6;
const COUNTRIES = [
  { id: "250", name: "France", lat: 46.6, lon: 2.2, flag: fr, note: "origine", dx: -200, dy: -74 },
  { id: "422", name: "Liban", lat: 33.9, lon: 35.9, flag: lb, note: "vécu", dx: 40, dy: -84 },
  { id: "682", name: "Arabie saoudite", lat: 23.9, lon: 45.1, flag: sa, note: "vécu", dx: -215, dy: 46 },
  { id: "634", name: "Qatar", lat: 25.3, lon: 51.2, flag: qa, note: "vécu", dx: 24, dy: 40 },
  { id: "124", name: "Canada", lat: 56, lon: -96, flag: ca, note: "vécu", dx: 30, dy: -90 },
  { id: "604", name: "Pérou", lat: -9.2, lon: -75, flag: pe, note: "vécu", dx: 44, dy: 30 },
];
const BASE = { lat: 43.3, lon: 5.4 };
const LEGS = [[0, 1], [1, 2], [2, 3], [3, -1], [-1, 4], [4, 5], [5, -1]];

const toVec = (lat, lon, r = R) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

const loadImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

const VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const BODY_FRAG = /* glsl */ `
  uniform vec3 uRim; varying vec3 vN; varying vec3 vV;
  void main() {
    float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.0);
    gl_FragColor = vec4(mix(vec3(0.012, 0.018, 0.028), uRim * 0.5, f), 1.0);
  }
`;
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uRim; uniform float uStrength; varying vec3 vN; varying vec3 vV;
  void main() {
    float f = pow(clamp(0.72 + dot(vN, vV), 0.0, 1.0), 4.0);
    gl_FragColor = vec4(uRim, 1.0) * f * uStrength;
  }
`;
// Earth at night: city lights from the texture, a cool rim towards the limb.
const NIGHT_FRAG = /* glsl */ `
  uniform sampler2D uMap; uniform vec3 uRim; varying vec3 vN; varying vec3 vV; varying vec2 vUv;
  void main() {
    vec3 lights = texture2D(uMap, vUv).rgb;
    float l = max(lights.r, max(lights.g, lights.b));
    vec3 col = lights * 1.25 + vec3(0.006, 0.012, 0.024);
    col = mix(col, col * vec3(1.0, 0.86, 0.62) * 1.3, smoothstep(0.35, 0.9, l));
    float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.5);
    gl_FragColor = vec4(col + uRim * f * 0.35, 1.0);
  }
`;
const DOT_VERT = /* glsl */ `
  attribute float aSize; attribute vec3 aColor; attribute float aAlpha;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelViewMatrix) * position);
    float facing = dot(n, normalize(-mv.xyz));
    vColor = aColor;
    vAlpha = aAlpha * smoothstep(-0.02, 0.35, facing);
    gl_PointSize = aSize * (7.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const DOT_FRAG = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.3, d));
  }
`;
// Light pillar: bright at the base, fading upwards.
const PILLAR_FRAG = /* glsl */ `
  uniform vec3 uColor; varying vec2 vUv;
  void main() { gl_FragColor = vec4(uColor, pow(1.0 - vUv.y, 1.6) * 0.95); }
`;

export default function GlobeStill({ variant = "a" }) {
  const wrap = useRef(null);
  const [overlay, setOverlay] = useState(null);
  const night = variant === "b";

  useEffect(() => {
    const el = wrap.current;
    let disposed = false;
    const renderer = new WebGLRenderer({ antialias: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.domElement.className = "absolute inset-0 size-full";
    el.prepend(renderer.domElement);
    const w = el.clientWidth;
    const h = el.clientHeight;

    const scene = new Scene();
    scene.background = new Color("#03060a");
    const camera = new PerspectiveCamera(36, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.4);
    camera.setViewOffset(w, h, -w * 0.15, 0, w, h);
    const globe = new Group();
    scene.add(globe);
    const green = new Color("#4ade80");
    const rim = new Color(night ? "#5aa9ff" : "#3fb6c8");

    (async () => {
      const img = await loadImage(nightUrl);
      if (disposed) return;

      if (night) {
        const tex = await new TextureLoader().loadAsync(nightUrl);
        tex.colorSpace = SRGBColorSpace;
        tex.anisotropy = 8;
        globe.add(new Mesh(new SphereGeometry(R, 128, 96), new ShaderMaterial({ vertexShader: VERT, fragmentShader: NIGHT_FRAG, uniforms: { uMap: { value: tex }, uRim: { value: rim } } })));
      } else {
        globe.add(new Mesh(new SphereGeometry(R * 0.985, 96, 64), new ShaderMaterial({ vertexShader: VERT, fragmentShader: BODY_FRAG, uniforms: { uRim: { value: rim } } })));
        // Land mask (equirectangular canvas) and night-lights brightness, sampled per dot.
        const W = 2048;
        const H = 1024;
        const mask = document.createElement("canvas");
        mask.width = W;
        mask.height = H;
        const mctx = mask.getContext("2d");
        const proj = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
        mctx.fillStyle = "#fff";
        mctx.beginPath();
        geoPath(proj, mctx)(feature(landTopo, landTopo.objects.land));
        mctx.fill();
        const maskData = mctx.getImageData(0, 0, W, H).data;
        const lights = document.createElement("canvas");
        lights.width = W;
        lights.height = H;
        const lctx = lights.getContext("2d");
        lctx.drawImage(img, 0, 0, W, H);
        const lightData = lctx.getImageData(0, 0, W, H).data;

        const lived = feature(countriesTopo, countriesTopo.objects.countries).features.filter((f) => COUNTRIES.some((c) => c.id === f.id));
        const N = 120000;
        const golden = Math.PI * (3 - Math.sqrt(5));
        const pos = [];
        const col = [];
        const size = [];
        const alpha = [];
        const base = new Color("#71859b");
        const city = new Color("#f4f1e4");
        const c = new Color();
        for (let i = 0; i < N; i++) {
          const y = 1 - (i / (N - 1)) * 2;
          const lat = (Math.asin(y) * 180) / Math.PI;
          const lon = ((((golden * i * 180) / Math.PI) % 360) + 540) % 360 - 180;
          const px = Math.min(W - 1, Math.floor(((lon + 180) / 360) * W));
          const py = Math.min(H - 1, Math.floor(((90 - lat) / 180) * H));
          const k = (py * W + px) * 4;
          if (maskData[k] < 128) continue;
          const lum = Math.max(lightData[k], lightData[k + 1], lightData[k + 2]) / 255;
          const b = Math.min(1, Math.max(0, (lum - 0.12) * 1.6));
          const inLived = lat > -20 && lived.some((f) => (f.id !== "250" || (lon > -6 && lat > 41)) && geoContains(f, [lon, lat]));
          c.copy(base).lerp(city, b);
          if (inLived) c.lerp(green, 0.75);
          toVec(lat, lon).toArray(pos, pos.length);
          col.push(c.r, c.g, c.b);
          size.push((1.7 + b * 1.6 + (inLived ? 0.6 : 0)) * dpr);
          alpha.push(inLived ? 0.95 : 0.4 + b * 0.6);
        }
        const g = new BufferGeometry();
        g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
        g.setAttribute("aColor", new BufferAttribute(new Float32Array(col), 3));
        g.setAttribute("aSize", new BufferAttribute(new Float32Array(size), 1));
        g.setAttribute("aAlpha", new BufferAttribute(new Float32Array(alpha), 1));
        globe.add(new Points(g, new ShaderMaterial({ vertexShader: DOT_VERT, fragmentShader: DOT_FRAG, transparent: true, depthWrite: false })));
      }

      // Atmosphere.
      globe.add(
        new Mesh(
          new SphereGeometry(R * 1.2, 96, 64),
          new ShaderMaterial({ vertexShader: VERT, fragmentShader: ATMO_FRAG, uniforms: { uRim: { value: rim }, uStrength: { value: night ? 0.55 : 0.6 } }, side: BackSide, transparent: true, blending: AdditiveBlending, depthWrite: false }),
        ),
      );

      // Lit outlines of the lived-in countries.
      const outlineMat = new LineBasicMaterial({ color: green, transparent: true, opacity: 0.95 });
      feature(countriesTopo, countriesTopo.objects.countries)
        .features.filter((f) => COUNTRIES.some((c) => c.id === f.id))
        .forEach((f) => {
          const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
          polys.forEach((poly) => {
            const ring = poly[0];
            if (f.id === "250" && ring.some(([lon, lat]) => lon < -6 || lat < 41)) return;
            globe.add(new Line(new BufferGeometry().setFromPoints(ring.map(([lon, lat]) => toVec(lat, lon, R * 1.004))), outlineMat));
          });
        });

      // Light pillars on each country and on Marseille.
      const up = new Vector3(0, 1, 0);
      const pillar = (lat, lon, color, height) => {
        const geo = new CylinderGeometry(0.0065, 0.0065, height, 8, 1, true);
        geo.translate(0, height / 2, 0);
        const m = new Mesh(geo, new ShaderMaterial({ vertexShader: VERT, fragmentShader: PILLAR_FRAG, uniforms: { uColor: { value: color } }, transparent: true, blending: AdditiveBlending, depthWrite: false }));
        const p = toVec(lat, lon, R);
        m.position.copy(p);
        m.quaternion.copy(new Quaternion().setFromUnitVectors(up, p.clone().normalize()));
        globe.add(m);
        const dot = new Mesh(new SphereGeometry(0.018, 16, 12), new MeshBasicMaterial({ color }));
        dot.position.copy(p);
        globe.add(dot);
      };
      COUNTRIES.forEach((c) => pillar(c.lat, c.lon, green, 0.32));
      pillar(BASE.lat, BASE.lon, new Color("#ffffff"), 0.42);

      // Thick arcs along the journey.
      const placeVec = (i) => (i < 0 ? toVec(BASE.lat, BASE.lon) : toVec(COUNTRIES[i].lat, COUNTRIES[i].lon));
      const arcMat = new MeshBasicMaterial({ color: green, transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false });
      LEGS.forEach(([a, b]) => {
        const from = placeVec(a);
        const to = placeVec(b);
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const lift = 1 + Math.min(0.5, from.distanceTo(to) * 0.28);
        const curve = new QuadraticBezierCurve3(from, mid.normalize().multiplyScalar(R * lift), to);
        globe.add(new Mesh(new TubeGeometry(curve, 96, 0.0048, 8, false), arcMat));
      });

      // Final framing of the intro: Americas to the Gulf.
      const v = toVec(0, -24);
      globe.rotation.set((28 * Math.PI) / 180, -Math.atan2(v.x, v.z), 0);
      scene.updateMatrixWorld();

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new Vector2(w, h), night ? 0.5 : 0.55, 0.4, night ? 0.45 : 0.42));
      composer.addPass(new OutputPass());
      composer.render();
      composer.render();

      // Card positions for the overlay.
      const camDir = new Vector3(0, 0, -1);
      setOverlay(
        COUNTRIES.map((c) => {
          const world = toVec(c.lat, c.lon).applyMatrix4(globe.matrixWorld);
          const visible = world.clone().normalize().dot(camDir) < -0.15;
          const s = world.project(camera);
          return { ...c, x: ((s.x + 1) / 2) * w, y: ((1 - s.y) / 2) * h, visible };
        }),
      );
      window.__ready = true;
    })();

    return () => {
      disposed = true;
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [night]);

  return (
    <div ref={wrap} className="fixed inset-0 overflow-hidden bg-[#03060a] font-mono">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
        {overlay?.filter((c) => c.visible).map((c) => (
          <line key={c.id} x1={c.x} y1={c.y} x2={c.x + c.dx + (c.dx < 0 ? 180 : 0)} y2={c.y + c.dy + 20} stroke="#4ade80" strokeOpacity="0.6" strokeWidth="1" />
        ))}
      </svg>
      {overlay?.filter((c) => c.visible).map((c) => (
        <div key={c.id} className="absolute top-0 left-0 w-[180px]" style={{ transform: `translate(${c.x + c.dx}px, ${c.y + c.dy}px)` }}>
          <div className="border border-white/10 border-l-cyber/80 border-l-2 bg-zinc-950/70 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <img src={c.flag} alt="" className="h-3 w-4 shrink-0 rounded-[1px] object-cover" />
              <span className="truncate text-[11px] font-bold tracking-[0.14em] text-zinc-50 uppercase">{c.name}</span>
            </div>
            <div className="mt-1 flex justify-between text-[10px] tracking-wider text-zinc-500">
              <span className="text-cyber">{c.note}</span>
              <span className="tabular-nums">
                {Math.abs(c.lat).toFixed(1)}°{c.lat >= 0 ? "N" : "S"} {Math.abs(c.lon).toFixed(1)}°{c.lon >= 0 ? "E" : "O"}
              </span>
            </div>
          </div>
        </div>
      ))}

      <header className="absolute inset-x-10 top-8 flex items-center justify-between font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">
        <div className="flex items-center gap-3">
          <ScanEye size={20} className="text-cyber" />
          <span className="text-sm font-bold tracking-[0.35em] text-zinc-100">Argos</span>
          <span>moteur OSINT · mise en scène</span>
        </div>
        <div className="flex items-center gap-2">
          cible <span className="text-zinc-200">Jérémie Nagi</span> <span className="text-zinc-700">|</span> consentement <Check size={13} className="text-cyber" />
        </div>
        <div>Passer l’intro ⎋</div>
      </header>
      <div className="absolute inset-x-10 top-[4.25rem] h-px bg-cyber/70" />

      <div className="absolute top-24 left-10 w-[32rem] text-[13px] leading-[1.6] text-zinc-400">
        <p className="text-zinc-200">
          <span className="text-cyber">❯</span> argos scan --cible &quot;Jérémie Nagi&quot; --consentement
        </p>
        <p className="text-zinc-600">cible consentante · sources publiées par l’intéressé</p>
        <p className="mt-4 mb-1 text-[11px] tracking-[0.3em] text-zinc-500 uppercase">── Sources publiques</p>
        {["github.com/JN13012|dépôts publics", "tryhackme.com/p/JN13|Jr Penetration Tester", "coursera.org|IBM AI Developer", "epitech.eu|MSc cybersécurité", "linkedin.com/in/jn13012|profil professionnel"].map((s) => (
          <p key={s} className="flex gap-3">
            <Check size={14} className="mt-[3px] text-cyber" />
            <span className="w-48 text-zinc-200">{s.split("|")[0]}</span>
            <span>{s.split("|")[1]}</span>
          </p>
        ))}
        <p className="mt-4 mb-1 text-[11px] tracking-[0.3em] text-zinc-500 uppercase">── Géolocalisation · 6 / 6 pays</p>
        <ul className="grid grid-cols-3 gap-x-3 gap-y-1">
          {COUNTRIES.map((c) => (
            <li key={c.id} className="flex items-center gap-2 text-zinc-200">
              <img src={c.flag} alt="" className="h-3 w-4 object-cover" />
              {c.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-10 left-10">
        <p className="text-xs tracking-[0.3em] text-cyber uppercase">Dossier complet</p>
        <p className="mt-2 text-5xl leading-none font-black tracking-tighter text-white uppercase">
          Nagi <span className="text-cyber">Jérémie</span>
        </p>
        <p className="mt-3 text-lg font-bold uppercase">
          <span className="text-sky-400">Développeur IA</span> <span className="text-zinc-600">·</span> <span className="text-rose-500">Pentester junior</span>
        </p>
        <button type="button" className="mt-6 h-12 border border-cyber px-12 text-sm tracking-[0.4em] text-cyber uppercase shadow-[0_0_32px_-8px_var(--color-cyber)]">
          Entrer
        </button>
      </div>

      <span className="absolute right-6 bottom-6 rounded-sm bg-white/10 px-2 py-1 text-[10px] tracking-widest text-zinc-300 uppercase">
        Piste {night ? "B · Terre de nuit" : "A · globe données"}
      </span>
    </div>
  );
}
