import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* =====================================================================
   CINEMATIC SCROLL BACKGROUND — CÚ MÁY FLYCAM 3D LIỀN MẠCH & HÀI HÒA
   Kế thừa 100% cú máy 3D được yêu thích:
   1. Đỉnh trời Tà Xùa: Biển mây bồng bềnh cuộn sóng ngút ngàn.
   2. Lao vút qua lớp mây: Cam zoom vào, đâm xuyên qua tầng mây 3D bồng bềnh
      (Hiệu ứng sương mù ùa qua ống kính rồi mở toang ra).
   3. Đáp xuống thung lũng: Nhìn thẳng xuống sóng lúa Ruộng bậc thang vàng óng bên dưới.
   4. Liếc góc máy sang phải: Cú quay quanh sườn núi, thấy ngay bên cạnh là
      Hẻm vực Tu Sản & Dòng sông Nho Quế xanh ngọc bích.
   5. Bốc đầu bay vút lên cao: Vượt qua các triền đá chạm đỉnh Fansipan 3.143m chọc trời.

   KHẮC PHỤC TRIỆT ĐỂ "MẢNH XANH" LÚC CHUYỂN SANG FANSIPAN:
   - Làm mờ dứt điểm sông Nho Quế trước khi vào Fansipan (tránh bị chồng lấn mảng xanh của sông lên đỉnh núi).
   - Mở rộng khổ ảnh Fansipan (44x25) bao phủ kín toàn bộ khung nhìn, không để lộ khoảng hở mép.
   - Chuẩn hóa màu bầu trời nền về gam màu hoàng hôn vàng ấm & sương tối trung tính (loại bỏ hoàn toàn sắc xanh cyan lạc lõng).
   ===================================================================== */

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (cur, to, rate, dt) => lerp(cur, to, 1 - Math.exp(-rate * dt));

// 6 Chặng bay liên tục của Camera (Vị trí vật lý trong không gian 3D, Điểm nhìn, Tiêu cự, Tên hiển thị)
const FLIGHT_STAGES = [
  // 0. Khởi đầu: Trên đỉnh trời ngắm Biển mây Tà Xùa bao la
  {
    pos: [0.0, 3.6, 14.5],
    look: [0.0, 2.6, -1.0],
    fov: 44,
    vista: 'TÀ XÙA • BIỂN MÂY ĐẠI NGÀN'
  },
  // 1. Lao nhanh về phía trước: Cam zoom vào chuẩn bị đâm xuyên qua mây
  {
    pos: [0.0, 1.8, 8.2],
    look: [0.0, 1.0, -1.0],
    fov: 45,
    vista: 'LAO VÚT XUYÊN QUA TẦNG MÂY'
  },
  // 2. Xuyên qua mây: Toàn cảnh Thung lũng Ruộng bậc thang Y Tý vàng rực
  {
    pos: [-0.4, 0.4, 2.0],
    look: [0.0, -0.4, -12.0],
    fov: 42,
    vista: 'THUNG LŨNG RUỘNG BẬC THANG VÀNG'
  },
  // 3. Nghiêng và quay sang phải: Nhìn thấy Hẻm vực Tu Sản & Sông Nho Quế ở bên cạnh
  {
    pos: [2.5, -0.6, -9.0],
    look: [9.5, -1.8, -19.0],
    fov: 40,
    vista: 'HẺM TU SẢN • DÒNG SÔNG NHO QUẾ'
  },
  // 4. Lượn theo dòng sông vách đá, bốc đầu bay vút lên cao về phía Fansipan
  {
    pos: [1.0, 3.6, -17.5],
    look: [0.0, 5.8, -31.0],
    fov: 42,
    vista: 'VƯỢT ĐÈO ĐẠI NGÀN HOÀNG LIÊN SƠN'
  },
  // 5. Chạm đỉnh Fansipan 3.143m kiêu hãnh giữa trời hoàng hôn dát vàng
  {
    pos: [0.0, 6.2, -23.0],
    look: [0.0, 7.2, -35.0],
    fov: 40,
    vista: 'FANSIPAN • ĐỈNH 3.143M NÓC NHÀ ĐÔNG DƯƠNG'
  }
];

// Tạo mặt phẳng cong 3D ôm theo trường nhìn không gian
function createCurvedPlane(w, h, segX = 48, segZ = 32, curveFactor = 0.04) {
  const geo = new THREE.PlaneGeometry(w, h, segX, segZ);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, -Math.pow(x * curveFactor, 2.0));
  }
  geo.computeVertexNormals();
  return geo;
}

// Tạo texture hạt sương tròn mềm mại
function createMoteTexture() {
  const S = 64;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255, 235, 175, 0.95)');
  g.addColorStop(0.35, 'rgba(245, 158, 11, 0.55)');
  g.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
  g.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

export default function CinematicScrollBackground() {
  const mountRef = useRef(null);
  const lensMistRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. SCENE & CAMERA (Bầu trời sớm mai trong lành & sương sớm ấm áp)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b);
    scene.fog = new THREE.FogExp2(0x253346, 0.012);

    const camera = new THREE.PerspectiveCamera(
      FLIGHT_STAGES[0].fov,
      width / height,
      0.2,
      150
    );
    camera.position.set(...FLIGHT_STAGES[0].pos);
    camera.lookAt(new THREE.Vector3(...FLIGHT_STAGES[0].look));
    scene.add(camera);

    // 2. RENDERER (Retina sharp & SRGB Color)
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. LOAD 4 ẢNH CHỤP THỰC TẾ CHẤT LƯỢNG CAO (1376x768) VỚI ANISOTROPIC 16X
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const texLoader = new THREE.TextureLoader();
    const loadTex = (path) => {
      const tex = texLoader.load(path);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = Math.min(16, maxAniso);
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    const texTaxua = loadTex('/images/taxua.jpg');       // Biển mây Tà Xùa
    const texTerraces = loadTex('/images/yty.jpg');      // Ruộng bậc thang Y Tý
    const texCanyon = loadTex('/images/mapileng.jpg');   // Hẻm Tu Sản & Sông Nho Quế
    const texFansipan = loadTex('/images/fansipan.jpg'); // Đỉnh Fansipan 3.143m

    // Vertex & Fragment Shader chung (Khử mép gắt, hòa sắc tự nhiên)
    const vistaVertShader = `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `;

    const createVistaMat = (tex, featherX = 0.12, featherY = 0.10, isFeathered = true) => {
      // Xử lý tham số an toàn tuyệt đối tránh lỗi type error
      let fx = typeof featherX === 'number' ? featherX : 0.10;
      let fy = typeof featherY === 'number' ? featherY : fx;
      let feathered = isFeathered;
      if (typeof featherY === 'boolean') {
        feathered = featherY;
        fy = fx;
      }
      fx = Math.max(0.001, Math.min(0.45, fx));
      fy = Math.max(0.001, Math.min(0.45, fy));
      const rX = 1.0 - fx;
      const rY = 1.0 - fy;

      return new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTex: { value: tex },
          uOpacity: { value: 1.0 },
          uSunColor: { value: new THREE.Color(0xffe298) }
        },
        vertexShader: vistaVertShader,
        fragmentShader: `
          precision highp float;
          uniform sampler2D uTex;
          uniform float uOpacity;
          uniform vec3 uSunColor;
          varying vec2 vUv;
          varying vec3 vWorldPos;

          float getBorderAlpha(vec2 uv) {
            ${
              feathered
                ? `float bx = smoothstep(0.0, ${fx.toFixed(3)}, uv.x) * smoothstep(1.0, ${rX.toFixed(3)}, uv.x);
            float by = smoothstep(0.0, ${fy.toFixed(3)}, uv.y) * smoothstep(1.0, ${rY.toFixed(3)}, uv.y);
            return clamp(bx * by, 0.0, 1.0);`
                : `return 1.0;`
            }
          }

          void main() {
            vec3 col = texture2D(uTex, vUv).rgb;
            float alpha = getBorderAlpha(vUv) * uOpacity;
            if (alpha <= 0.001) discard;

            // Ánh ban mai vàng chiếu rọi từ góc trên bên phải
            float sunDist = length(vUv - vec2(0.85, 0.85));
            col += uSunColor * pow(max(0.0, 1.0 - sunDist), 2.5) * 0.14;

            gl_FragColor = vec4(col, alpha);
          }
        `
      });
    };

    // =========================================================================
    // 4. XÂY DỰNG KHÔNG GIAN 3D ĐẠI NGÀN
    // =========================================================================

    // BẦU TRỜI NỀN BAN MAI RỰC RỠ (Sáng hơn, tươi mới, tràn đầy năng lượng du lịch)
    const skyGeo = new THREE.PlaneGeometry(260, 140);
    const skyMat = new THREE.ShaderMaterial({
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          vec3 skyTop = vec3(0.12, 0.19, 0.30);
          vec3 skyHorizon = vec3(0.30, 0.38, 0.48);
          vec3 sunWarmth = vec3(1.0, 0.78, 0.45);
          vec3 col = mix(skyHorizon, skyTop, smoothstep(0.1, 0.9, vUv.y));
          float sunGlow = max(0.0, 1.0 - length(vUv - vec2(0.75, 0.65)) * 1.35);
          col += sunWarmth * pow(sunGlow, 2.5) * 0.5;
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 25, -95);
    skyMesh.renderOrder = 0;
    scene.add(skyMesh);

    // CẢNH 1: Biển mây Tà Xùa trên đỉnh trời (Khổ rộng 56x32, bao phủ kín 100% màn hình)
    const matTaxua = createVistaMat(texTaxua, 0.02, 0.02, false);
    const geoTaxua = createCurvedPlane(56, 32, 48, 32, 0.012);
    const meshTaxua = new THREE.Mesh(geoTaxua, matTaxua);
    meshTaxua.position.set(0.0, 2.8, -3.0);
    meshTaxua.renderOrder = 5;
    scene.add(meshTaxua);

    // LỚP MÂY 3D TRUNG GIAN (Chỉ hiện khi đâm xuyên mây ở Z = 4.5, ẩn hoàn toàn ở trang đầu)
    const cloudBarrierGeo = createCurvedPlane(60, 36, 48, 32, 0.015);
    const cloudBarrierMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.0 },
        uSunColor: { value: new THREE.Color(0xffe6a8) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uSunColor;
        varying vec2 vUv;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }
        float fbm(vec2 p) {
          float v = 0.0; float a = 0.5;
          mat2 rot = mat2(cos(0.52), sin(0.52), -sin(0.52), cos(0.52));
          for(int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = rot * p * 2.05 + vec2(0.18, 0.22);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv * vec2(3.5, 2.2) + vec2(uTime * 0.02, uTime * 0.006);
          float n = fbm(uv);
          float edgeAlpha = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x)
                          * smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
          float density = smoothstep(0.26, 0.72, n) * edgeAlpha * 0.88 * uOpacity;

          vec3 col = mix(vec3(0.85, 0.88, 0.94), vec3(0.98, 0.99, 1.0), n);
          col += uSunColor * 0.22;
          gl_FragColor = vec4(col, density);
        }
      `
    });
    const meshCloudBarrier = new THREE.Mesh(cloudBarrierGeo, cloudBarrierMat);
    meshCloudBarrier.position.set(0.0, 0.8, 4.5);
    meshCloudBarrier.rotation.x = -0.05;
    meshCloudBarrier.renderOrder = 4;
    scene.add(meshCloudBarrier);

    // CẢNH 2: Thung lũng Ruộng bậc thang Y Tý
    const matTerraces = createVistaMat(texTerraces, 0.05, 0.05, true);
    const geoTerraces = createCurvedPlane(58, 34, 48, 32, 0.012);
    const meshTerraces = new THREE.Mesh(geoTerraces, matTerraces);
    meshTerraces.position.set(0.0, 0.0, -13.5);
    meshTerraces.rotation.x = -0.04;
    meshTerraces.renderOrder = 3;
    scene.add(meshTerraces);

    // CẢNH 3: Hẻm vực Tu Sản & Dòng sông Nho Quế (Mã Pí Lèng)
    // Khổ rộng 56x32, viền hòa sắc mềm mại 8%
    const matCanyon = createVistaMat(texCanyon, 0.08, 0.08, true);
    const geoCanyon = createCurvedPlane(56, 32, 48, 32, 0.018);
    const meshCanyon = new THREE.Mesh(geoCanyon, matCanyon);
    meshCanyon.position.set(9.0, -1.8, -21.5);
    meshCanyon.rotation.y = -Math.PI / 6.0; // Xoay 30 độ mềm mại
    meshCanyon.rotation.x = 0.05;
    meshCanyon.renderOrder = 2;
    scene.add(meshCanyon);

    // CẢNH 4: Đỉnh Fansipan 3.143m chọc trời
    // Khổ siêu rộng 96x54 bao trọn 100% tầm nhìn ở mọi góc quay, không lộ bất kỳ mép nào
    const matFansipan = createVistaMat(texFansipan, 0.02, 0.02, false);
    const geoFansipan = createCurvedPlane(96, 54, 64, 40, 0.008);
    const meshFansipan = new THREE.Mesh(geoFansipan, matFansipan);
    meshFansipan.position.set(0.0, 7.2, -36.0);
    meshFansipan.renderOrder = 1;
    scene.add(meshFansipan);

    // 5. HẠT SƯƠNG VÀNG PHÁT SÁNG BAY TRONG KHÔNG GIAN 3D
    const MOTE_COUNT = 75;
    const moteGeo = new THREE.BufferGeometry();
    const motePositions = new Float32Array(MOTE_COUNT * 3);
    const moteData = [];

    for (let i = 0; i < MOTE_COUNT; i++) {
      const mx = (Math.random() - 0.5) * 32.0;
      const my = (Math.random() - 0.5) * 16.0;
      const mz = 15.0 - Math.random() * 55.0;
      motePositions[i * 3] = mx;
      motePositions[i * 3 + 1] = my;
      motePositions[i * 3 + 2] = mz;
      moteData.push({
        x: mx,
        y: my,
        z: mz,
        speedY: 0.003 + Math.random() * 0.006,
        phase: Math.random() * Math.PI * 2
      });
    }
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));

    const moteMat = new THREE.PointsMaterial({
      size: 0.35,
      map: createMoteTexture(),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    // 6. ĐƯỜNG BAY 3D MƯỢT MÀ LIÊN TỤC THEO CATMULL-ROM SPLINE
    const camCurve = new THREE.CatmullRomCurve3(
      FLIGHT_STAGES.map((s) => new THREE.Vector3(...s.pos)),
      false,
      'catmullrom',
      0.22
    );
    const lookCurve = new THREE.CatmullRomCurve3(
      FLIGHT_STAGES.map((s) => new THREE.Vector3(...s.look)),
      false,
      'catmullrom',
      0.22
    );

    // 7. SCROLL & PARALLAX STATE
    const RIG = {
      targetProg: 0,
      smoothProg: 0,
      targetMx: 0,
      targetMy: 0,
      smoothMx: 0,
      smoothMy: 0
    };

    const handleMouseMove = (e) => {
      RIG.targetMx = (e.clientX / window.innerWidth) * 2 - 1;
      RIG.targetMy = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const cur = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      RIG.targetProg = clamp(cur, 0, 1);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    // 8. 60FPS CAMERA INTERPOLATION & SEAMLESS TRANSITIONS
    let animId;
    let lastTime = performance.now();
    const _camPos = new THREE.Vector3();
    const _camTarget = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = now * 0.001;

      // Giảm chấn mượt mà cho tiến trình cuộn (Damping tự nhiên)
      RIG.smoothProg = damp(RIG.smoothProg, RIG.targetProg, 3.8, dt);
      RIG.smoothMx = damp(RIG.smoothMx, RIG.targetMx, 3.2, dt);
      RIG.smoothMy = damp(RIG.smoothMy, RIG.targetMy, 3.2, dt);

      const p = RIG.smoothProg;
      const curveT = clamp(p, 0.0, 1.0);

      // Cập nhật shader thời gian thực
      cloudBarrierMat.uniforms.uTime.value = elapsed;

      // 1. Tà Xùa: 1.0 lúc đầu, mờ dần khi camera lao vào mây (p = 0.16 -> 0.28)
      let opTaxua = 1.0;
      if (p > 0.16) {
        opTaxua = 1.0 - (p - 0.16) / 0.12;
      }
      matTaxua.uniforms.uOpacity.value = clamp(opTaxua, 0.0, 1.0);

      // Lớp mây 3D trung gian chỉ xuất hiện khi máy bay lao xuyên qua mây (p = 0.16 -> 0.28)
      let opBarrier = 0.0;
      if (p >= 0.16 && p <= 0.28) {
        opBarrier = Math.sin(((p - 0.16) / 0.12) * Math.PI) * 0.65;
      }
      cloudBarrierMat.uniforms.uOpacity.value = opBarrier;

      // 2. Ruộng bậc thang Y Tý: hiện dần (p = 0.20 -> 0.30), giữ 1.0 đến p = 0.44, mờ dần (p = 0.44 -> 0.54)
      let opTerraces = 0.0;
      if (p < 0.20) opTerraces = 0.0;
      else if (p < 0.30) opTerraces = (p - 0.20) / 0.10;
      else if (p < 0.44) opTerraces = 1.0;
      else if (p < 0.54) opTerraces = 1.0 - (p - 0.44) / 0.10;
      matTerraces.uniforms.uOpacity.value = clamp(opTerraces, 0.0, 1.0);

      // 3. Hẻm Tu Sản & Sông Nho Quế (Mã Pí Lèng):
      // Hiện dần (p = 0.44 -> 0.54), giữ trọn vẹn 1.0 đến p = 0.62
      // Sau đó hòa tan êm dịu không khựng sang Fansipan (p = 0.62 -> 0.74)
      let opCanyon = 0.0;
      if (p < 0.44) opCanyon = 0.0;
      else if (p < 0.54) opCanyon = (p - 0.44) / 0.10;
      else if (p < 0.62) opCanyon = 1.0;
      else if (p < 0.74) opCanyon = 1.0 - (p - 0.62) / 0.12;
      else opCanyon = 0.0;
      matCanyon.uniforms.uOpacity.value = clamp(opCanyon, 0.0, 1.0);

      // 4. Fansipan (Đỉnh 3.143m):
      // Bắt đầu hòa tan vào từ p = 0.62 (đúng lúc Canyon bắt đầu mờ dần),
      // Đạt 1.0 ở p = 0.74 và giữ nguyên 1.0 đến hết trang (p = 1.0)
      let opFansipan = 0.0;
      if (p < 0.62) opFansipan = 0.0;
      else if (p < 0.74) opFansipan = (p - 0.62) / 0.12;
      else opFansipan = 1.0;
      matFansipan.uniforms.uOpacity.value = clamp(opFansipan, 0.0, 1.0);

      // ĐƯỜNG BAY 3D LIỀN MẠCH THEO CATMULL-ROM SPLINE
      const sampledPos = camCurve.getPoint(curveT);
      const sampledLook = lookCurve.getPoint(curveT);

      // Vị trí Camera + Parallax chuột (êm ái, biên độ kiểm soát để không hở mép hình)
      _camPos.set(
        sampledPos.x + RIG.smoothMx * 0.25,
        sampledPos.y - RIG.smoothMy * 0.15,
        sampledPos.z
      );

      // Điểm nhìn Camera (LookAt)
      _camTarget.set(
        sampledLook.x - RIG.smoothMx * 0.18,
        sampledLook.y + RIG.smoothMy * 0.12,
        sampledLook.z
      );

      camera.position.copy(_camPos);
      camera.lookAt(_camTarget);

      // Tiêu cự Camera (Nội suy FOV mượt mà)
      const N = FLIGHT_STAGES.length - 1;
      const segFloat = curveT * N;
      const segIdx = clamp(Math.floor(segFloat), 0, N - 1);
      const segFrac = segFloat - segIdx;
      const easeT = segFrac * segFrac * (3.0 - 2.0 * segFrac);
      const targetFov = lerp(FLIGHT_STAGES[segIdx].fov, FLIGHT_STAGES[Math.min(segIdx + 1, N)].fov, easeT);
      if (Math.abs(camera.fov - targetFov) > 0.02) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }

      // HIỆU ỨNG SƯƠNG MÂY LAO VÚT XUYÊN MÂY (Chỉ ở cú đâm mây Tà Xùa -> Y Tý, nhẹ nhàng tinh tế)
      let totalMist = 0.0;
      if (p >= 0.17 && p <= 0.27) {
        totalMist = Math.sin(((p - 0.17) / 0.10) * Math.PI) * 0.22;
      }
      if (lensMistRef.current) {
        lensMistRef.current.style.opacity = totalMist.toFixed(3);
      }

      // Cập nhật các hạt sương mai lơ lửng
      const posArr = moteGeo.attributes.position.array;
      for (let i = 0; i < MOTE_COUNT; i++) {
        const m = moteData[i];
        m.y += m.speedY;
        if (m.y > 10.0) m.y = -8.0;
        const drift = Math.sin(elapsed * 1.2 + m.phase) * 0.15;
        posArr[i * 3] = m.x + drift;
        posArr[i * 3 + 1] = m.y;
      }
      moteGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      [texTaxua, texTerraces, texCanyon, texFansipan].forEach((t) => t.dispose());
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: '#06080d'
      }}
      aria-hidden="true"
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Hiệu ứng sương mây nhẹ nhàng khi đâm xuyên tầng mây Tà Xùa */}
      <div
        ref={lensMistRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, rgba(240, 246, 255, 0.15) 50%, transparent 80%)',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.1s ease-out'
        }}
      />
    </div>
  );
}
