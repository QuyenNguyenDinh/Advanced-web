import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Exponential decay damping (frame-rate independent)
const damp = (cur, to, rate, dt) => cur + (to - cur) * (1 - Math.exp(-rate * dt));
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

// Waypoints along the journey across the 4 mountain realms
const CAM = [
  { p: [0.0, 3.2, 14.0], t: [0.0, 3.0, -25.0], fov: 40 },  // 0: Hero - High vantage over Tà Xùa cloud ocean
  { p: [-3.5, 1.8, 8.5], t: [1.2, 2.2, -22.0], fov: 38 },  // 1: Tà Xùa - Gliding low along the Dinosaur Ridge
  { p: [3.8, 2.4, 2.0], t: [-1.8, 1.6, -26.0], fov: 44 },  // 2: Mã Pí Lèng - Swooping down into the deep canyon
  { p: [-1.4, 5.2, -3.5], t: [0.8, 6.0, -32.0], fov: 36 }, // 3: Fansipan - Rising above 3.143m peak into sunset
  { p: [2.2, 2.2, -8.0], t: [-0.6, 2.4, -36.0], fov: 42 }, // 4: Y Tý - Gliding over terraced misty fields
  { p: [0.0, 3.8, 0.0], t: [0.0, 3.2, -30.0], fov: 45 }    // 5: Features & CTA - Broad majestic panorama
];

// Helper to generate soft Gaussian cloud puff texture (purely organic, zero blockiness)
function createSoftPuffTexture() {
  const S = 128;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
  grad.addColorStop(0.3, 'rgba(240, 246, 255, 0.4)');
  grad.addColorStop(0.65, 'rgba(220, 235, 250, 0.12)');
  grad.addColorStop(1, 'rgba(220, 235, 250, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

export default function CinematicCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060911);
    scene.fog = new THREE.FogExp2(0x060a12, 0.016);

    const camera = new THREE.PerspectiveCamera(
      CAM[0].fov,
      window.innerWidth / window.innerHeight,
      0.2,
      250
    );
    camera.position.set(...CAM[0].p);
    camera.lookAt(new THREE.Vector3(...CAM[0].t));

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Build Catmull-Rom Splines for smooth camera motion
    const curveP = new THREE.CatmullRomCurve3(
      CAM.map((c) => new THREE.Vector3(...c.p)),
      false,
      'catmullrom',
      0.42
    );
    const curveT = new THREE.CatmullRomCurve3(
      CAM.map((c) => new THREE.Vector3(...c.t)),
      false,
      'catmullrom',
      0.42
    );

    // 3. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfff0dd, 0x090f19, 1.4);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffe2b8, 2.2);
    sunLight.position.set(-15, 25, 10);
    scene.add(sunLight);

    // 4. REAL PHOTOGRAPHY PANORAMIC CYLINDER PLATES (Curved, zero square edges)
    const textureLoader = new THREE.TextureLoader();
    const textures = {
      taxua: textureLoader.load('/images/taxua.jpg'),
      mapileng: textureLoader.load('/images/mapileng.jpg'),
      fansipan: textureLoader.load('/images/fansipan.jpg'),
      yty: textureLoader.load('/images/yty.jpg')
    };

    // Configure textures
    Object.values(textures).forEach((tex) => {
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });

    // Create 4 large curved panoramic backdrop cylinders positioned in 3D depth
    const plateGeo = new THREE.CylinderGeometry(
      52, // radiusTop
      52, // radiusBottom
      32, // height
      64, // radialSegments (high smoothness, no facets)
      1,
      true, // openEnded
      -Math.PI * 0.38, // thetaStart
      Math.PI * 0.76 // thetaLength
    );
    plateGeo.scale(-1, 1, 1); // Invert faces so texture faces inward toward the camera

    const createPlateMesh = (texture, zOffset = -28) => {
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(plateGeo, mat);
      mesh.position.set(0, 4.0, zOffset);
      scene.add(mesh);
      return mesh;
    };

    const plates = [
      createPlateMesh(textures.taxua, -28),    // 0: Tà Xùa
      createPlateMesh(textures.mapileng, -29),  // 1: Mã Pí Lèng
      createPlateMesh(textures.fansipan, -30),  // 2: Fansipan
      createPlateMesh(textures.yty, -28.5)      // 3: Y Tý
    ];
    plates[0].material.opacity = 1.0; // Start with Tà Xùa

    // 5. 3D VOLUMETRIC DRIFTING MIST CLUSTERS (Instanced quads flying past camera in depth)
    const puffTex = createSoftPuffTexture();
    const mistCount = 140;
    const mistGeo = new THREE.PlaneGeometry(9.0, 5.5);
    const mistMat = new THREE.MeshBasicMaterial({
      map: puffTex,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const mistInstanced = new THREE.InstancedMesh(mistGeo, mistMat, mistCount);
    const dummy = new THREE.Object3D();
    const mistData = [];

    for (let i = 0; i < mistCount; i++) {
      const x = (Math.random() - 0.5) * 65;
      const y = -1.0 + Math.random() * 9.5;
      const z = 12.0 - Math.random() * 45.0; // Straddles the camera path
      const speedX = 0.006 + Math.random() * 0.012;
      const scale = 0.8 + Math.random() * 1.5;
      const phase = Math.random() * Math.PI * 2;

      mistData.push({ x, y, z, speedX, scale, phase });
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mistInstanced.setMatrixAt(i, dummy.matrix);
    }
    mistInstanced.instanceMatrix.needsUpdate = true;
    scene.add(mistInstanced);

    // 6. 3D FLOATING GOLDEN EMBERS & DEW MOTES
    const emberCount = 60;
    const emberGeo = new THREE.PlaneGeometry(0.35, 0.35);
    const emberMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      map: puffTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false
    });
    const emberInstanced = new THREE.InstancedMesh(emberGeo, emberMat, emberCount);
    const emberData = [];

    for (let i = 0; i < emberCount; i++) {
      const x = (Math.random() - 0.5) * 35;
      const y = 0.5 + Math.random() * 8;
      const z = 10 - Math.random() * 30;
      const speedY = 0.008 + Math.random() * 0.016;
      const phase = Math.random() * Math.PI * 2;
      emberData.push({ x, y, z, speedY, phase });
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.4 + Math.random() * 0.8);
      dummy.updateMatrix();
      emberInstanced.setMatrixAt(i, dummy.matrix);
    }
    emberInstanced.instanceMatrix.needsUpdate = true;
    scene.add(emberInstanced);

    // 7. RIG STATE & SCROLL TRACKING
    const RIG = {
      targetProg: 0,
      smoothProg: 0,
      mx: 0,
      my: 0,
      tmx: 0,
      tmy: 0
    };

    const handleMouseMove = (e) => {
      RIG.tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      RIG.tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const y = window.scrollY || window.pageYOffset || 0;
      // Progress scaled to waypoints count (0 .. 5)
      const norm = clamp(y / maxScroll, 0, 1);
      RIG.targetProg = norm * (CAM.length - 1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    };
    window.addEventListener('resize', handleResize);

    // 8. ANIMATION LOOP
    const _p = new THREE.Vector3();
    const _t = new THREE.Vector3();
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(0.1, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      // Exponential damping on scroll progression
      RIG.smoothProg = damp(RIG.smoothProg, RIG.targetProg, 4.6, dt);

      // Damped mouse parallax
      RIG.mx = damp(RIG.mx, RIG.tmx, 3.5, dt);
      RIG.my = damp(RIG.my, RIG.tmy, 3.5, dt);

      // Evaluate Catmull-Rom spline at normalized u (0 .. 1)
      const N = CAM.length - 1;
      const u = clamp(RIG.smoothProg / N, 0, 1);
      curveP.getPoint(u, _p);
      curveT.getPoint(u, _t);

      // Interpolate FOV between waypoints
      const segIdx = clamp(Math.floor(RIG.smoothProg), 0, N - 1);
      const segFrac = clamp(RIG.smoothProg - segIdx, 0, 1);
      const fov = CAM[segIdx].fov + (CAM[segIdx + 1].fov - CAM[segIdx].fov) * segFrac;
      if (Math.abs(camera.fov - fov) > 0.05) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }

      // Parallax camera displacement
      _p.x += RIG.mx * 0.75;
      _p.y -= RIG.my * 0.45;
      _t.x -= RIG.mx * 0.35;
      _t.y += RIG.my * 0.25;

      camera.position.copy(_p);
      camera.lookAt(_t);

      // Cross-fade the 4 real photography backdrop plates based on progress
      // 0.0 - 1.2: Tà Xùa
      // 1.0 - 2.2: Mã Pí Lèng
      // 2.0 - 3.2: Fansipan
      // 3.0 - 5.0: Y Tý
      const pVal = RIG.smoothProg;
      const calcOpacity = (center, spread = 1.0) => {
        const d = Math.abs(pVal - center);
        if (d >= spread) return 0;
        return 1 - d / spread;
      };

      const op0 = clamp(1 - pVal * 0.9, 0, 1); // Tà Xùa
      const op1 = calcOpacity(1.8, 1.1);       // Mã Pí Lèng
      const op2 = calcOpacity(3.0, 1.1);       // Fansipan
      const op3 = clamp((pVal - 2.8) / 1.1, 0, 1); // Y Tý

      plates[0].material.opacity = Math.max(op0, 0.05);
      plates[1].material.opacity = op1;
      plates[2].material.opacity = op2;
      plates[3].material.opacity = op3;

      // Subtle scale and position parallax for the plates
      plates.forEach((plate, i) => {
        plate.position.y = 4.0 + Math.sin(elapsed * 0.4 + i) * 0.3;
        plate.rotation.y = (RIG.mx * 0.04);
      });

      // Animate drifting mist quads (flying through 3D space)
      for (let i = 0; i < mistCount; i++) {
        const d = mistData[i];
        d.x += d.speedX;
        if (d.x > 38) d.x = -38;

        const bob = Math.sin(elapsed * 0.6 + d.phase) * 0.4;
        dummy.position.set(d.x, d.y + bob, d.z);
        dummy.scale.setScalar(d.scale);
        dummy.updateMatrix();
        mistInstanced.setMatrixAt(i, dummy.matrix);
      }
      mistInstanced.instanceMatrix.needsUpdate = true;

      // Animate floating embers
      for (let i = 0; i < emberCount; i++) {
        const e = emberData[i];
        e.y += e.speedY;
        if (e.y > 10.0) e.y = 0.5;

        const drift = Math.sin(elapsed * 1.2 + e.phase) * 0.2;
        dummy.position.set(e.x + drift, e.y, e.z);
        dummy.scale.setScalar(0.4 + Math.sin(elapsed * 2 + e.phase) * 0.15);
        dummy.updateMatrix();
        emberInstanced.setMatrixAt(i, dummy.matrix);
      }
      emberInstanced.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      id="gl"
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    />
  );
}
