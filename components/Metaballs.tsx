'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

// Color palette definitions
const COLOR_PALETTES = {
  waterTransparent: {
    name: 'Water Transparent',
    color0: [0.95, 0.97, 1.0],  // Almost white with very subtle blue
    color1: [0.85, 0.88, 0.92], // Light gray with hint of blue
  },
  purple: {
    name: 'Purple',
    color0: [0.1765, 0.1255, 0.2275],
    color1: [0.4118, 0.4118, 0.4157],
  },
  blueGradient: {
    name: 'Blue Gradient',
    color0: [0.2, 0.4, 0.9],
    color1: [0.0, 0.1, 0.4],
  },
  redGradient: {
    name: 'Red Gradient',
    color0: [0.9, 0.2, 0.2],
    color1: [0.4, 0.0, 0.0],
  },
  pinkGradient: {
    name: 'Pink Gradient',
    color0: [1.0, 0.4, 0.7],
    color1: [0.5, 0.0, 0.3],
  },
  orangeGradient: {
    name: 'Orange Gradient',
    color0: [1.0, 0.6, 0.2],
    color1: [0.5, 0.2, 0.0],
  },
  magentaGradient: {
    name: 'Magenta Gradient',
    color0: [0.9, 0.2, 0.9],
    color1: [0.4, 0.0, 0.4],
  },
  emeraldGradient: {
    name: 'Emerald Gradient',
    color0: [0.2, 0.9, 0.6],
    color1: [0.0, 0.4, 0.3],
  },
  cyanGradient: {
    name: 'Cyan Gradient',
    color0: [0.2, 0.8, 0.9],
    color1: [0.0, 0.3, 0.4],
  },
  yellowGradient: {
    name: 'Yellow Gradient',
    color0: [1.0, 0.9, 0.2],
    color1: [0.5, 0.4, 0.0],
  },
};

// Vertex Shader
const vertexShader = `
attribute vec3 position;
varying vec2 vTexCoord;

void main() {
    vTexCoord = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position, 1.0);
}
`;

// Fragment Shader
const fragmentShader = `
precision mediump float;

const float EPS = 1e-4;
const int ITR = 32;
const int TRAIL_LENGTH = 15;
const int STATIC_BUBBLES = 20;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointerTrail[TRAIL_LENGTH];
uniform vec3 uCameraPosition;
uniform mat4 uProjectionMatrixInverse;
uniform mat4 uCameraMatrixWorld;
uniform vec3 uStaticBubbles[STATIC_BUBBLES]; // x, y, radius
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform float uMainBallRadius; // Dynamic radius for main ball

varying vec2 vTexCoord;

// Camera Params
vec3 origin = vec3(0.0, 0.0, 1.0);
vec3 lookAt = vec3(0.0, 0.0, 0.0);
vec3 cDir = normalize(lookAt - origin);
vec3 cUp = vec3(0.0, 1.0, 0.0);
vec3 cSide = cross(cDir, cUp);

vec3 translate(vec3 p, vec3 t) {
    return p - t;
}

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float smoothMin(float d1, float d2, float k) {
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

float rnd3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    float a000 = rnd3D(i);
    float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0));
    float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0));
    float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0));
    float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0));
    float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0));
    float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0));
    float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0));

    vec3 u = f * f * (3.0 - 2.0 * f);

    float k0 = a000;
    float k1 = a100 - a000;
    float k2 = a010 - a000;
    float k3 = a001 - a000;
    float k4 = a000 - a100 - a010 + a110;
    float k5 = a000 - a010 - a001 + a011;
    float k6 = a000 - a100 - a001 + a101;
    float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;

    return k0 + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
}

float map(vec3 p) {
    float baseRadius = uMainBallRadius; // Use dynamic radius
    float radius = baseRadius;
    float k = 7.0;
    float d = 1e5;

    // Main bubble trail
    for (int i = 0; i < TRAIL_LENGTH; i++) {
        float fi = float(i);

        // uPointerTrail contains world space coordinates
        vec2 ballWorldPos = uPointerTrail[i];

        // Calculate trail radius with minimum size to prevent negative values
        float trailRadius = max(radius - (baseRadius * 0.05 * fi), 0.01);

        float sphere = sdSphere(
            translate(p, vec3(ballWorldPos, 0.0)),
            trailRadius
        );

        d = smoothMin(d, sphere, k);
    }

    // Static bubbles
    for (int i = 0; i < STATIC_BUBBLES; i++) {
        vec3 bubbleData = uStaticBubbles[i];
        vec2 bubblePos = bubbleData.xy;
        float bubbleRadius = bubbleData.z;

        float sphere = sdSphere(
            translate(p, vec3(bubblePos, 0.0)),
            bubbleRadius
        );

        d = smoothMin(d, sphere, k);
    }

    return d;
}

vec3 generateNormal(vec3 p) {
    return normalize(vec3(
        map(p + vec3(EPS, 0.0, 0.0)) - map(p + vec3(-EPS, 0.0, 0.0)),
        map(p + vec3(0.0, EPS, 0.0)) - map(p + vec3(0.0, -EPS, 0.0)),
        map(p + vec3(0.0, 0.0, EPS)) - map(p + vec3(0.0, 0.0, -EPS))
    ));
}

vec3 dropletColor(vec3 normal, vec3 rayDir) {
    vec3 reflectDir = reflect(rayDir, normal);

    float noisePosTime = noise3D(reflectDir * 2.0 + uTime);
    float noiseNegTime = noise3D(reflectDir * 2.0 - uTime);

    // Use uniform colors passed from JavaScript
    vec3 _color0 = uColor0 * noisePosTime;
    vec3 _color1 = uColor1 * noiseNegTime;

    // Light direction from top center (0, 1, 0.5) - creates symmetrical shading
    vec3 lightDir = normalize(vec3(0.0, 1.0, 0.5));

    // Calculate diffuse lighting from top center
    float diffuse = max(dot(normal, lightDir), 0.0);
    float ambient = 0.4; // Base ambient light
    float lighting = ambient + diffuse * 0.6;

    // Edge lighting for water-like highlights
    float edgeLight = pow(1.0 - abs(dot(normal, rayDir)), 1.5);

    float intensity = 2.5 + edgeLight * 0.5; // Base intensity with edge highlights
    vec3 color = (_color0 + _color1) * intensity * lighting;

    return color;
}

void main() {
    // Reconstruct normalized device coordinates for this fragment
    vec2 ndc = vTexCoord * 2.0 - 1.0;

    // Mimic THREE.Vector3.unproject(camera) to match Three.js exactly
    vec4 clipPosition = vec4(ndc, 0.5, 1.0);
    vec4 viewPosition = uProjectionMatrixInverse * clipPosition;
    viewPosition /= viewPosition.w;

    vec4 worldPosition = uCameraMatrixWorld * viewPosition;
    vec3 rayDir = normalize(worldPosition.xyz - uCameraPosition);

    // Now ray march from camera to find metaballs
    vec3 ray = uCameraPosition;
    float dist = 0.0;

    for (int i = 0; i < ITR; ++i) {
        dist = map(ray);
        ray += rayDir * dist;
        if (dist < EPS) break;
        if (ray.z < -0.5) break;
    }

    vec3 color = vec3(0.0);
    float alpha = 0.0;

    if (dist < EPS) {
        vec3 normal = generateNormal(ray);
        color = dropletColor(normal, rayDir);

        // Create water-like transparency with enhanced depth
        // More transparent in the center, opaque at edges (like real water)
        float fresnel = pow(1.0 - abs(dot(normal, -rayDir)), 2.5);
        float baseOpacity = 0.25; // Increased base opacity for more visible shading
        alpha = baseOpacity + fresnel * 0.45; // Range from 0.25 to 0.7 opacity
    }

    vec3 finalColor = pow(color, vec3(6.5)); // Slightly reduced gamma for more color depth
    gl_FragColor = vec4(finalColor, alpha);
}
`;

interface MetaballsProps {
  className?: string;
  showUI?: boolean; // Show color selector and debug UI
  showDebugVisuals?: boolean; // Show reference planes, grids, axis lines
  onPositionUpdate?: (data: {
    mouseX: number;
    mouseY: number;
    shaderX: number;
    shaderY: number;
  }) => void;
}

export default function Metaballs({
  className = '',
  showUI = true,
  showDebugVisuals = true,
  onPositionUpdate
}: MetaballsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.RawShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pointerTrailRef = useRef<THREE.Vector2[]>(
    Array.from({ length: 15 }, () => new THREE.Vector2(0, 0))
  );

  // Color palette state
  const [selectedPalette, setSelectedPalette] = useState<keyof typeof COLOR_PALETTES>('waterTransparent');

  // Static bubble positions (x, y, radius)
  // Initialize with random positions spread across vertical space
  const staticBubblesRef = useRef<THREE.Vector3[]>(
    Array.from({ length: 20 }, () => {
      return new THREE.Vector3(
        (Math.random() - 0.5) * 12, // Random x between -6 and 6 (wider range for sides)
        (Math.random() - 0.5) * 12 - 6, // Random y between -12 and 0 (start from bottom)
        0.15 + Math.random() * 0.25 // Random radius between 0.15 and 0.4
      );
    })
  );

  // Bubble velocities (how fast they float up)
  const bubbleVelocitiesRef = useRef<number[]>(
    Array.from({ length: 20 }, () => 0.002 + Math.random() * 0.006) // Random speed between 0.002 and 0.008 (slower)
  );

  // Main ball size (starts small, grows on collision)
  const mainBallRadiusRef = useRef<number>(0.03); // Super tiny - starts as a speck
  const maxMainBallRadius = 1.5; // Maximum size limit

  // Track which bubbles were recently collided with (cooldown)
  const collisionCooldownRef = useRef<Set<number>>(new Set());

  // Camera perspective movement
  const mouseXRef = useRef<number>(0);
  const mouseYRef = useRef<number>(0);
  const windowHalfX = useRef<number>(window.innerWidth / 2);
  const windowHalfY = useRef<number>(window.innerHeight / 2);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();

    // Create gradient background texture
    const createGradientTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Create radial gradient from center - light blues with good contrast
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 512);
        gradient.addColorStop(0, '#60a5fa'); // Light blue center
        gradient.addColorStop(0.5, '#1A2A4F'); // Navy blue middle
        gradient.addColorStop(1, '#1e40af'); // Darker blue edges

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      return texture;
    };

    // Set gradient background (permanent)
    scene.background = createGradientTexture();
    sceneRef.current = scene;

    // Setup camera (used for mouse coordinate conversion)
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Enable alpha to allow shader transparency
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.autoClear = false; // Disable auto clear so we can render in layers
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup uniforms
    const palette = COLOR_PALETTES[selectedPalette];
    console.log('Initial main ball radius:', mainBallRadiusRef.current);
    const uniforms = {
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uTime: { value: 0.0 },
      uPointerTrail: { value: pointerTrailRef.current },
      uCameraPosition: { value: camera.position.clone() },
      uProjectionMatrixInverse: { value: camera.projectionMatrixInverse.clone() },
      uCameraMatrixWorld: { value: camera.matrixWorld.clone() },
      uStaticBubbles: { value: staticBubblesRef.current },
      uColor0: { value: new THREE.Vector3(...palette.color0) },
      uColor1: { value: new THREE.Vector3(...palette.color1) },
      uMainBallRadius: { value: mainBallRadiusRef.current },
    };

    // Setup material
    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    materialRef.current = material;

    // Setup geometry (fullscreen plane with shader)
    const geometry = new THREE.PlaneGeometry(2.0, 2.0);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = 0.1; // Position slightly in front of z=0
    plane.renderOrder = 1;
    scene.add(plane);

    // Add debug visuals if enabled
    if (showDebugVisuals) {
    // Add reference plane at z=0 (same plane as tracker sphere and metaballs)
    const referencePlaneGeometry = new THREE.PlaneGeometry(20, 20);
    const referencePlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    const referencePlane = new THREE.Mesh(referencePlaneGeometry, referencePlaneMaterial);
    referencePlane.position.z = 0; // At z=0 where sphere moves
    scene.add(referencePlane);

    // Add wireframe border around reference plane
    const borderGeometry = new THREE.EdgesGeometry(referencePlaneGeometry);
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 3 });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    border.position.z = 0;
    scene.add(border);

    // Add floor plane for spatial reference
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    scene.add(floor);

    // Add back wall plane for depth perception
    const backWallGeometry = new THREE.PlaneGeometry(20, 20);
    const backWallMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
    backWall.position.z = -10;
    backWall.position.y = 5;
    scene.add(backWall);

    // Add lights - brighter for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xff4444, 1.0);
    pointLight1.position.set(-5, 3, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4444ff, 1.0);
    pointLight2.position.set(5, 3, 2);
    scene.add(pointLight2);

    // Add front light to illuminate axis lines
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    // Add grid helper for reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Add axes helper at origin
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add extended axis lines through the scene (using LineBasicMaterial which doesn't need lighting)
    // X-axis line (red) - extends far left and right
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-20, 0, 0),
      new THREE.Vector3(20, 0, 0)
    ]);
    const xAxisLine = new THREE.Line(
      xAxisGeometry,
      new THREE.LineBasicMaterial({ color: 0xff0000 })
    );
    xAxisLine.position.z = 0.01; // Slightly in front of reference plane
    scene.add(xAxisLine);

    // Y-axis line (green) - extends up and down
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -20, 0),
      new THREE.Vector3(0, 20, 0)
    ]);
    const yAxisLine = new THREE.Line(
      yAxisGeometry,
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );
    yAxisLine.position.z = 0.01; // Slightly in front of reference plane
    scene.add(yAxisLine);

    // Z-axis line (blue) - extends forward and back
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -20),
      new THREE.Vector3(0, 0, 20)
    ]);
    const zAxisLine = new THREE.Line(
      zAxisGeometry,
      new THREE.LineBasicMaterial({ color: 0x0000ff })
    );
    scene.add(zAxisLine);

    // Add grid lines on the z=0 plane to show coordinate space
    const gridSize = 20;
    const divisions = 20;
    const xyGridHelper = new THREE.GridHelper(gridSize, divisions, 0xffff00, 0x666666);
    xyGridHelper.rotation.x = Math.PI / 2; // Rotate to be on XY plane instead of XZ
    xyGridHelper.position.z = 0.02; // Slightly in front of reference plane and axes
    scene.add(xyGridHelper);
    } // End of showDebugVisuals

    // Add lensflares
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load('/textures/lensflare/lensflare0.png');
    const textureFlare3 = textureLoader.load('/textures/lensflare/lensflare3.png');

    function addLight(h: number, s: number, l: number, x: number, y: number, z: number) {
      const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
      light.color.setHSL(h, s, l);
      light.position.set(x, y, z);
      scene.add(light);

      const lensflare = new Lensflare();
      lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
      lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
      lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
      light.add(lensflare);
    }

    addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    addLight(0.08, 0.8, 0.5, 0, 0, -1000);
    addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

    // Mouse tracking - using the same working approach as MouseTracker
    const handleMouseMove = (event: MouseEvent) => {
      if (!cameraRef.current) return;

      // Update camera perspective movement (like webgl_effects_stereo)
      // Reduced multiplier to keep camera inside panoramic sphere
      mouseXRef.current = (event.clientX - windowHalfX.current) * 0.5;
      mouseYRef.current = (event.clientY - windowHalfY.current) * 0.5;

      // Convert mouse to normalized device coordinates (-1 to +1)
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Unproject mouse position to 3D space
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(cameraRef.current);

      // Calculate ray direction
      const dir = vector.sub(cameraRef.current.position).normalize();

      // Calculate where ray intersects z=0 plane
      const distance = -cameraRef.current.position.z / dir.z;
      const position = cameraRef.current.position.clone().add(dir.multiplyScalar(distance));

      // Use the calculated position for the shader
      const x = position.x;
      const y = position.y;

      // Send position update to parent
      if (onPositionUpdate) {
        onPositionUpdate({
          mouseX: event.clientX,
          mouseY: event.clientY,
          shaderX: x,
          shaderY: y,
        });
      }

      // Update trail (shift elements)
      for (let i = pointerTrailRef.current.length - 1; i > 0; i--) {
        pointerTrailRef.current[i].copy(pointerTrailRef.current[i - 1]);
      }
      pointerTrailRef.current[0].set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update window half values for camera perspective
      windowHalfX.current = width / 2;
      windowHalfY.current = height / 2;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld(true);

      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
      uniforms.uProjectionMatrixInverse.value.copy(cameraRef.current.projectionMatrixInverse);
      uniforms.uCameraMatrixWorld.value.copy(cameraRef.current.matrixWorld);
      uniforms.uCameraPosition.value.copy(cameraRef.current.position);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = (Date.now() - startTime) * 0.001;
      uniforms.uTime.value = elapsedTime;

      // Update camera position based on mouse (smooth lerp)
      if (cameraRef.current) {
        // Only track horizontal (X) movement, lock vertical (Y) movement
        const targetX = mouseXRef.current * 0.005; // Reduced sensitivity (was 0.01)
        const targetY = 0; // Lock Y position at 0

        camera.position.x += (targetX - camera.position.x) * 0.03; // Slower lerp (was 0.05)
        camera.position.y = targetY; // Keep Y locked at 0
        // Keep z position fixed to stay inside the sphere
        camera.position.z = 5;

        // Rotate view to the left and tilt down slightly
        const lookAtTarget = new THREE.Vector3(1.5, 1, 0);
        camera.lookAt(lookAtTarget);
        camera.updateMatrixWorld(true);

        // Update shader uniforms with new camera position
        uniforms.uCameraPosition.value.copy(camera.position);
        uniforms.uCameraMatrixWorld.value.copy(camera.matrixWorld);
      }

      // Update main ball radius uniform
      uniforms.uMainBallRadius.value = mainBallRadiusRef.current;

      // Get main tracker ball position (from first element in pointer trail)
      const mainBallPos = pointerTrailRef.current[0];
      const mainBallRadius = mainBallRadiusRef.current;

      // Update static bubbles - make them float up
      for (let i = 0; i < staticBubblesRef.current.length; i++) {
        const bubble = staticBubblesRef.current[i];
        const velocity = bubbleVelocitiesRef.current[i];

        // Check collision with main tracker ball
        const dx = bubble.x - mainBallPos.x;
        const dy = bubble.y - mainBallPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const bubbleRadius = bubble.z; // z stores the radius
        const combinedRadius = mainBallRadius + bubbleRadius;

        // If collision detected
        if (distance < combinedRadius) {
          // Only grow if this bubble is not on cooldown
          if (!collisionCooldownRef.current.has(i)) {
            // Grow main ball by 5%
            mainBallRadiusRef.current = Math.min(
              mainBallRadiusRef.current * 1.05,
              maxMainBallRadius
            );

            // Shrink the floating bubble by 5% (liquid transfer effect)
            bubble.z = Math.max(bubbleRadius * 0.95, 0.05); // Min size 0.05 to prevent disappearing

            // If bubble becomes too small, respawn it
            if (bubble.z < 0.1) {
              bubble.x = (Math.random() - 0.5) * 12;
              bubble.y = -6;
              bubble.z = 0.15 + Math.random() * 0.25;
              bubbleVelocitiesRef.current[i] = 0.002 + Math.random() * 0.006;
            }

            // Add bubble to cooldown set
            collisionCooldownRef.current.add(i);

            // Remove from cooldown after 2 seconds
            setTimeout(() => {
              collisionCooldownRef.current.delete(i);
            }, 2000);
          }

          // Push bubble away from main ball
          const angle = Math.atan2(dy, dx);
          const pushForce = 0.05;
          bubble.x += Math.cos(angle) * pushForce;
          bubble.y += Math.sin(angle) * pushForce;

          // Speed up the bubble temporarily
          bubbleVelocitiesRef.current[i] = Math.min(
            bubbleVelocitiesRef.current[i] * 1.5,
            0.02
          );
        }

        // Move bubble up
        bubble.y += velocity;

        // If bubble goes off the top of the screen, reset it to the bottom with new random position
        if (bubble.y > 6) {
          bubble.x = (Math.random() - 0.5) * 12; // New random x position (-6 to 6)
          bubble.y = -6; // Start from bottom
          bubble.z = 0.15 + Math.random() * 0.25; // New random radius
          bubbleVelocitiesRef.current[i] = 0.002 + Math.random() * 0.006; // New random velocity (slower)
        }
      }

      // Manual render with layers: background first, then shader
      renderer.clear();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Update colors when palette changes
  useEffect(() => {
    if (materialRef.current) {
      const palette = COLOR_PALETTES[selectedPalette];
      materialRef.current.uniforms.uColor0.value.set(...palette.color0);
      materialRef.current.uniforms.uColor1.value.set(...palette.color1);
    }
  }, [selectedPalette]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className={`w-full h-full bg-black ${className}`}
        style={{ touchAction: 'none' }}
      />

      {/* Color Palette Selector - only show if showUI is true */}
      {showUI && (
        <div className="absolute top-4 right-4 z-10">
          <select
            value={selectedPalette}
            onChange={(e) => setSelectedPalette(e.target.value as keyof typeof COLOR_PALETTES)}
            className="px-4 py-2 bg-black/70 backdrop-blur-sm text-white border border-white/30 rounded-lg cursor-pointer hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
              <option key={key} value={key} className="bg-black text-white">
                {palette.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
