'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

// ============= SCENE CONFIGURATIONS =============
type SceneType = 'panorama' | 'bubbles';

const SCENES = {
  panorama: {
    name: 'Panorama Scene',
    // Mouse interaction
    mouseSensitivity: 2,
    cameraSmoothing: 0.05,

    // Environment
    environmentPreset: "night" as const,

    // Background Skybox
    useSkybox: true,
    skyboxType: 'image' as 'gradient' | 'image',
    skyboxImage: '/images360/mty2.jpeg',
    skyboxColors: {
      top: '#1a0033',
      middle: '#0a0a2e',
      bottom: '#000814',
    },
    backgroundColor: '#000814',

    // Scene objects
    sphereCount: 100,
    sphereSize: 100,
    sphereColorHue: { min: 0, max: 1 },
    sphereColorSaturation: 0.7,
    sphereColorLightness: 0.5,

    // Materials - Glass
    glassMaterial: {
      useRefraction: true,
      refractionRatio: 0.95,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 0.5,
      ior: 1.5,
      envMapIntensity: 1,
    },

    // Materials - Mirror
    mirrorMaterial: {
      metalness: 1,
      roughness: 0,
      envMapIntensity: 2,
    },

    // Animation
    rotationSpeed: 0.1,
    rotationSpeedX: 0.05,
    floatAnimation: false,

    // Camera
    cameraPosition: [0, 0, 3200] as [number, number, number],
    cameraFov: 60,
    cameraNear: 1,
    cameraFar: 100000,

    // Lighting
    ambientIntensity: 0.5,
    directionalIntensity: 1,
    pointLightIntensity: 0.5,

    // Lensflares
    lensflares: {
      enabled: true,
      lights: [
        { h: 0.55, s: 0.9, l: 0.5, x: 5000, y: 0, z: -1000 },
        { h: 0.08, s: 0.8, l: 0.5, x: 0, y: 0, z: -1000 },
        { h: 0.995, s: 0.5, l: 0.9, x: 5000, y: 5000, z: -1000 },
      ],
    },

    // Glowing orbs (not used in panorama scene)
    glowingOrbs: {
      enabled: false,
      orbs: [] as Array<{ h: number; s: number; l: number; x: number; y: number; z: number }>,
    },
  },

  bubbles: {
    name: 'Floating Bubbles',
    // Mouse interaction
    mouseSensitivity: 1,
    cameraSmoothing: 0.05,

    // Environment
    environmentPreset: "night" as const,

    // Background - solid dark color, no panorama
    useSkybox: false,
    skyboxType: 'gradient' as 'gradient' | 'image',
    skyboxImage: '',
    skyboxColors: {
      top: '#0a0520',
      middle: '#030112',
      bottom: '#000000',
    },
    backgroundColor: '#000000',

    // Scene objects - only glass spheres
    sphereCount: 30,
    sphereSize: 80,
    sphereColorHue: { min: 0.5, max: 0.65 }, // Blue-cyan range
    sphereColorSaturation: 0.8,
    sphereColorLightness: 0.6,

    // Materials - Glass only (no mirrors in bubble scene)
    glassMaterial: {
      useRefraction: false, // Use transmission for better bubble effect
      refractionRatio: 0.95,
      metalness: 0,
      roughness: 0.07, // Match the example
      transmission: 1, // Full transmission
      thickness: 1.5, // Same as example
      ior: 1.5, // Glass IOR
      envMapIntensity: 1.5, // Match the example
    },

    // Materials - Mirror (not used in bubble scene)
    mirrorMaterial: {
      metalness: 1,
      roughness: 0,
      envMapIntensity: 2,
    },

    // Animation - bubbles float upward
    rotationSpeed: 0.05,
    rotationSpeedX: 0.02,
    floatAnimation: true, // Enable upward floating

    // Camera
    cameraPosition: [0, 0, 2000] as [number, number, number],
    cameraFov: 75,
    cameraNear: 1,
    cameraFar: 10000,

    // Lighting - softer, more ambient
    ambientIntensity: 0.8,
    directionalIntensity: 0.3,
    pointLightIntensity: 0.2,

    // Lensflares - enabled with colored flares
    lensflares: {
      enabled: true,
      lights: [
        { h: 0.55, s: 0.9, l: 0.7, x: -600, y: 0, z: -400 },
        { h: 0.15, s: 0.8, l: 0.6, x: 600, y: 400, z: -600 },
        { h: 0.75, s: 0.7, l: 0.65, x: 0, y: -300, z: -500 },
      ],
    },

    // Glowing orbs (not used when lensflares are enabled)
    glowingOrbs: {
      enabled: false,
      orbs: [] as Array<{ h: number; s: number; l: number; x: number; y: number; z: number }>,
    },
  },
};

// Active scene selection
const ACTIVE_SCENE: SceneType = 'bubbles';
const SCENE_CONFIG = SCENES[ACTIVE_SCENE];
// ==============================================

// Custom environment from skybox texture
function SkyboxEnvironment() {
  const texture = useTexture(SCENE_CONFIG.skyboxImage);
  const { scene, gl } = useThree();

  useEffect(() => {
    if (texture && scene && gl) {
      const pmremGenerator = new THREE.PMREMGenerator(gl);

      // Create reflection environment (default CubeReflectionMapping)
      const reflectionEnv = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = reflectionEnv;
      console.log('[SkyboxEnvironment] Created reflection environment, mapping:', reflectionEnv.mapping);

      // Clone the texture and create a separate refraction environment
      const textureClone = texture.clone();
      textureClone.needsUpdate = true;
      const refractionEnv = pmremGenerator.fromEquirectangular(textureClone).texture;
      refractionEnv.mapping = THREE.CubeRefractionMapping;
      scene.userData.refractionEnv = refractionEnv;
      console.log('[SkyboxEnvironment] Created refraction environment, mapping:', refractionEnv.mapping);

      pmremGenerator.dispose();
    }
  }, [texture, scene, gl]);

  return null;
}

// Image Skybox - 360° panorama
function ImageSkybox() {
  const texture = useTexture(SCENE_CONFIG.skyboxImage);
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50000, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Gradient Skybox - colored gradient
function GradientSkybox() {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    const geometry = meshRef.current.geometry as THREE.SphereGeometry;
    const positions = geometry.attributes.position;
    const colors = new Float32Array(positions.count * 3);

    const topColor = new THREE.Color(SCENE_CONFIG.skyboxColors.top);
    const middleColor = new THREE.Color(SCENE_CONFIG.skyboxColors.middle);
    const bottomColor = new THREE.Color(SCENE_CONFIG.skyboxColors.bottom);

    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const normalizedY = (y + 50000) / 100000; // Normalize to 0-1

      let color: THREE.Color;
      if (normalizedY > 0.5) {
        // Top half: interpolate between middle and top
        color = new THREE.Color().lerpColors(middleColor, topColor, (normalizedY - 0.5) * 2);
      } else {
        // Bottom half: interpolate between bottom and middle
        color = new THREE.Color().lerpColors(bottomColor, middleColor, normalizedY * 2);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, []);

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[50000, 60, 40]} />
      <meshBasicMaterial vertexColors side={THREE.BackSide} />
    </mesh>
  );
}

// Skybox Background - supports gradient or 360° image
function Skybox() {
  // if (SCENE_CONFIG.skyboxType === 'image') {
  //   return <ImageSkybox />;
  // }
  return <GradientSkybox />;
}

// Lensflare Lights - adds cinematic lens flare effects to point lights (panorama scene)
function LensflareLight({ h, s, l, x, y, z }: { h: number; s: number; l: number; x: number; y: number; z: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const textureFlare0 = useTexture('/textures/lensflare/lensflare0.png');
  const textureFlare3 = useTexture('/textures/lensflare/lensflare3.png');

  useEffect(() => {
    if (!lightRef.current) return;

    const light = lightRef.current;
    const color = new THREE.Color().setHSL(h, s, l);

    // Create lensflare effect with additive blending
    const lensflare = new Lensflare();

    // Main flare
    const mainElement = new LensflareElement(textureFlare0, 700, 0, color);
    lensflare.addElement(mainElement);

    // Secondary flares with colors
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6, color));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7, color));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9, color));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1, color));

    light.add(lensflare);

    return () => {
      light.remove(lensflare);
    };
  }, [h, s, l, textureFlare0, textureFlare3]);

  const color = new THREE.Color().setHSL(h, s, l);

  return (
    <pointLight
      ref={lightRef}
      position={[x, y, z]}
      color={color}
      intensity={3}
      distance={2500}
      decay={0}
    />
  );
}

// Glowing Light Orb - simple emissive sphere with point light (bubble scene)
function GlowingOrb({ h, s, l, x, y, z }: { h: number; s: number; l: number; x: number; y: number; z: number }) {
  const color = new THREE.Color().setHSL(h, s, l);

  return (
    <group position={[x, y, z]}>
      {/* Point light */}
      <pointLight
        color={color}
        intensity={2}
        distance={1500}
        decay={2}
      />

      {/* Glowing sphere visualization */}
      <mesh>
        <sphereGeometry args={[30, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>

      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[50, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Floating spheres with refraction
function FloatingSpheres({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const spheresRef = useRef<THREE.Mesh[]>([]);
  const heroBubbleRef = useRef<THREE.Mesh | null>(null);
  const heroBubbleTargetPos = useRef(new THREE.Vector3(0, 0, 0));
  const heroBubbleCurrentPos = useRef(new THREE.Vector3(0, 0, 0));
  const { scene, camera } = useThree();

  // Update environment map for refraction when scene environment changes
  useEffect(() => {
    if (!scene.userData.refractionEnv || !SCENE_CONFIG.glassMaterial.useRefraction) {
      console.log('[FloatingSpheres] Waiting for refraction environment...', {
        hasRefractionEnv: !!scene.userData.refractionEnv,
        useRefraction: SCENE_CONFIG.glassMaterial.useRefraction
      });
      return;
    }

    console.log('[FloatingSpheres] Applying refraction to glass spheres, count:', spheresRef.current.length);

    let appliedCount = 0;
    spheresRef.current.forEach((sphere, index) => {
      const material = sphere.material as THREE.MeshBasicMaterial;
      if ((material as any).needsEnvMap && material.isMeshBasicMaterial) {
        // Use the REFRACTION environment map (not the reflection one)
        material.envMap = scene.userData.refractionEnv;
        material.refractionRatio = SCENE_CONFIG.glassMaterial.refractionRatio;
        material.needsUpdate = true;
        delete (material as any).needsEnvMap;
        appliedCount++;
        console.log(`[FloatingSpheres] Applied refraction to sphere ${index}`);
      }
    });
    console.log(`[FloatingSpheres] Applied refraction to ${appliedCount} spheres`);
  }, [scene, scene.userData.refractionEnv]);

  useEffect(() => {
    // Create hero bubble first (the one that follows the mouse)
    const heroGeometry = new THREE.SphereGeometry(120, 32, 16); // Larger, smoother sphere
    const hue = 0.55; // Cyan/blue color

    const heroMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(hue, 0.8, 0.6),
      metalness: 0,
      roughness: 0.07,
      transmission: 1,
      thickness: 1.5,
      ior: 1.5,
      envMapIntensity: 1.5,
      transparent: true,
    });

    const heroBubble = new THREE.Mesh(heroGeometry, heroMaterial);
    heroBubble.position.set(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.add(heroBubble);
    }
    heroBubbleRef.current = heroBubble;

    // Create regular spheres based on config
    // In bubble scene: all glass spheres
    // In panorama scene: half glass, half mirror
    const spheres: THREE.Mesh[] = [];
    const geometry = new THREE.SphereGeometry(SCENE_CONFIG.sphereSize, 32, 16);

    for (let i = 0; i < SCENE_CONFIG.sphereCount; i++) {
      const isGlass = SCENE_CONFIG.floatAnimation ? true : i < SCENE_CONFIG.sphereCount / 2;

      let material: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;

      if (isGlass) {
        const hue = Math.random() * (SCENE_CONFIG.sphereColorHue.max - SCENE_CONFIG.sphereColorHue.min) + SCENE_CONFIG.sphereColorHue.min;

        if (SCENE_CONFIG.glassMaterial.useRefraction) {
          // Glass with refraction mapping (like original example) - creates dense glass look
          // Use white color like the original, environment map provides the look
          material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            refractionRatio: SCENE_CONFIG.glassMaterial.refractionRatio,
          });

          // Mark for envMap update when environment loads
          (material as any).needsEnvMap = true;
        } else {
          // Glass with transmission (physical transparency)
          material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(hue, SCENE_CONFIG.sphereColorSaturation, SCENE_CONFIG.sphereColorLightness),
            metalness: SCENE_CONFIG.glassMaterial.metalness,
            roughness: SCENE_CONFIG.glassMaterial.roughness,
            transmission: SCENE_CONFIG.glassMaterial.transmission,
            thickness: SCENE_CONFIG.glassMaterial.thickness,
            ior: SCENE_CONFIG.glassMaterial.ior,
            envMapIntensity: SCENE_CONFIG.glassMaterial.envMapIntensity,
            transparent: true,
          });
        }
      } else {
        // Mirror material - silver color with high metalness
        material = new THREE.MeshStandardMaterial({
          color: 0xc0c0c0, // Silver color
          metalness: SCENE_CONFIG.mirrorMaterial.metalness,
          roughness: SCENE_CONFIG.mirrorMaterial.roughness,
          envMapIntensity: SCENE_CONFIG.mirrorMaterial.envMapIntensity,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);

      if (SCENE_CONFIG.floatAnimation) {
        // Bubble scene: position randomly across wider area for screen coverage
        mesh.position.x = Math.random() * 4000 - 2000; // Wider: -2000 to 2000
        mesh.position.y = Math.random() * 4000 - 2000; // Taller spawn range
        mesh.position.z = Math.random() * 3000 - 1500; // Deeper: -1500 to 1500

        // Random size variation: 0.3 to 2.5 (small to large bubbles)
        const scale = Math.random() * 2.2 + 0.3;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

        // Store initial Y position and float speed
        (mesh.userData as any).initialY = mesh.position.y;
        (mesh.userData as any).floatSpeed = Math.random() * 0.6 + 0.5; // Random speed: 0.5 to 1.1
      } else {
        // Panorama scene: position randomly in all directions
        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
      }

      if (groupRef.current) {
        groupRef.current.add(mesh);
      }
      spheres.push(mesh);
    }

    spheresRef.current = spheres;

    return () => {
      // Clean up hero bubble
      if (heroBubble) {
        heroBubble.geometry.dispose();
        (heroBubble.material as THREE.Material).dispose();
      }

      spheres.forEach(sphere => {
        sphere.geometry.dispose();
        (sphere.material as THREE.Material).dispose();
      });
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update hero bubble with elastic motion following mouse
    if (heroBubbleRef.current && camera) {
      // IMPORTANT: CameraController is moving the camera based on mouse!
      // We need to account for the current camera position, not the initial position

      // Get the camera's CURRENT distance to the z=0 plane
      const cameraZ = camera.position.z; // Dynamic, changes with mouse

      // Calculate the visible width and height at z=0 based on camera FOV and current position
      const vFOV = THREE.MathUtils.degToRad(SCENE_CONFIG.cameraFov);
      const height = 2 * Math.tan(vFOV / 2) * cameraZ;
      const width = height * (window.innerWidth / window.innerHeight);

      // Convert mouse pixel offset to world coordinates
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      // Direct mapping from screen to world coordinates at z=0
      // Account for camera offset as well
      const targetX = (mouseX / SCENE_CONFIG.mouseSensitivity / windowHalfX) * (width / 2) + camera.position.x;
      const targetY = -(mouseY / SCENE_CONFIG.mouseSensitivity / windowHalfY) * (height / 2) + camera.position.y;

      // Update target position
      heroBubbleTargetPos.current.set(targetX, targetY, 0);

      // Elastic/smooth interpolation (lerp with damping)
      const lerpFactor = 0.1; // Lower = more elastic/smooth, Higher = more responsive
      heroBubbleCurrentPos.current.lerp(heroBubbleTargetPos.current, lerpFactor);

      // Apply position to hero bubble
      heroBubbleRef.current.position.copy(heroBubbleCurrentPos.current);

      // Debug log occasionally (every 60 frames = ~1 second)
      if (Math.floor(time * 60) % 60 === 0) {
        console.log('[HeroBubble]',
                    'Mouse px:', mouseX.toFixed(0), mouseY.toFixed(0),
                    'Camera:', camera.position.x.toFixed(0), camera.position.y.toFixed(0), camera.position.z.toFixed(0),
                    'Target:', targetX.toFixed(0), targetY.toFixed(0),
                    'Bubble:', heroBubbleRef.current.position.x.toFixed(0), heroBubbleRef.current.position.y.toFixed(0));
      }

      // Add gentle rotation
      heroBubbleRef.current.rotation.y += 0.003;
      heroBubbleRef.current.rotation.x += 0.002;
    }

    if (groupRef.current && !SCENE_CONFIG.floatAnimation) {
      // Panorama scene: Rotate based on mouse position
      groupRef.current.rotation.x = mouseY * 0.0001;
      groupRef.current.rotation.y = mouseX * 0.0001;
    }

    // Animate individual spheres
    spheresRef.current.forEach((sphere, i) => {
      if (SCENE_CONFIG.floatAnimation) {
        // Bubble scene: float upward continuously
        sphere.position.y += sphere.userData.floatSpeed;

        // Reset to bottom when reaching top
        if (sphere.position.y > 2000) {
          sphere.position.y = -2000;
          sphere.position.x = Math.random() * 4000 - 2000; // Match wider spawn area
          sphere.position.z = Math.random() * 3000 - 1500; // Match deeper spawn area
        }

        // Gentle rotation and subtle horizontal drift
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;
        sphere.position.x += Math.sin(time * 0.5 + i) * 0.1;
        sphere.position.z += Math.cos(time * 0.3 + i) * 0.1;
      } else {
        // Panorama scene: rotate in place
        sphere.rotation.y = time * SCENE_CONFIG.rotationSpeed * (i % 2 === 0 ? 1 : -1);
        sphere.rotation.x = time * SCENE_CONFIG.rotationSpeedX;
      }
    });
  });

  return <group ref={groupRef} />;
}

// Hero Bubble that follows mouse with elastic motion
function HeroBubble({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  // Elastic motion state
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });
  const currentPosition = useRef({ x: 0, y: 0, z: 0 });
  const velocity = useRef({ x: 0, y: 0, z: 0 });

  // Update environment map for refraction when scene environment changes
  useEffect(() => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;

    if (scene.environment) {
      material.envMap = scene.environment;
      material.needsUpdate = true;
    }
  }, [scene, scene.environment]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Convert mouse position to world coordinates
    // Scale down the mouse movement for more controlled motion
    targetPosition.current.x = mouseX * 0.8;
    targetPosition.current.y = -mouseY * 0.8;
    targetPosition.current.z = 100; // Keep it in front

    // Elastic spring physics
    const stiffness = 0.05; // How quickly it responds (0-1)
    const damping = 0.85; // How much it bounces (0-1, higher = less bounce)

    // Calculate spring force (Hooke's law)
    const springForceX = (targetPosition.current.x - currentPosition.current.x) * stiffness;
    const springForceY = (targetPosition.current.y - currentPosition.current.y) * stiffness;
    const springForceZ = (targetPosition.current.z - currentPosition.current.z) * stiffness;

    // Apply forces to velocity
    velocity.current.x += springForceX;
    velocity.current.y += springForceY;
    velocity.current.z += springForceZ;

    // Apply damping
    velocity.current.x *= damping;
    velocity.current.y *= damping;
    velocity.current.z *= damping;

    // Update position
    currentPosition.current.x += velocity.current.x;
    currentPosition.current.y += velocity.current.y;
    currentPosition.current.z += velocity.current.z;

    // Apply to mesh
    meshRef.current.position.set(
      currentPosition.current.x,
      currentPosition.current.y,
      currentPosition.current.z
    );

    // Gentle rotation
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.x = time * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[150, 64, 32]} />
      <meshPhysicalMaterial
        color={new THREE.Color().setHSL(0.58, 0.8, 0.6)}
        metalness={0}
        roughness={0.05}
        transmission={1}
        thickness={2}
        ior={1.5}
        envMapIntensity={1.5}
        transparent={true}
      />
    </mesh>
  );
}

// Camera controller with mouse interaction
function CameraController({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Update camera position based on mouse - smoother movement
    camera.position.x += (mouseX - camera.position.x) * SCENE_CONFIG.cameraSmoothing;
    camera.position.y += (-mouseY - camera.position.y) * SCENE_CONFIG.cameraSmoothing;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface StereoSceneProps {
  scrollProgress?: number;
  onLoaded?: () => void;
}

export default function StereoScene({ scrollProgress = 0, onLoaded }: StereoSceneProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Use viewport dimensions for mouse tracking
      // This ensures the canvas fills the full screen
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      // clientX/clientY are relative to the viewport
      const mouseXPos = event.clientX - windowHalfX;
      const mouseYPos = event.clientY - windowHalfY;

      setMouseX(mouseXPos * SCENE_CONFIG.mouseSensitivity);
      setMouseY(mouseYPos * SCENE_CONFIG.mouseSensitivity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    console.log('[StereoScene] Component mounted');
    return () => console.log('[StereoScene] Component unmounted');
  }, []);

  return (
    <Canvas
      className="w-full h-full"
      style={{ width: '100%', height: '100%', display: 'block' }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      }}
      camera={{
        position: SCENE_CONFIG.cameraPosition,
        fov: SCENE_CONFIG.cameraFov,
        near: SCENE_CONFIG.cameraNear,
        far: SCENE_CONFIG.cameraFar
      }}
      onCreated={(state) => {
        console.log('[StereoScene] Canvas created');
        console.log('[StereoScene] Canvas size:', state.size.width, 'x', state.size.height);
        state.gl.setClearColor('#000000', 0);
        if (onLoaded) onLoaded();
      }}
      frameloop="always"
    >
      {/* Background - either solid color or skybox (gradient/image) */}
      {!SCENE_CONFIG.useSkybox && <color attach="background" args={['#000814']} />}
      {SCENE_CONFIG.useSkybox && <Skybox />}

      {/* Lighting */}
      <ambientLight intensity={SCENE_CONFIG.ambientIntensity} />

      {/* Only add these extra lights in panorama scene */}
      {!SCENE_CONFIG.floatAnimation && (
        <>
          <directionalLight position={[10, 10, 5]} intensity={SCENE_CONFIG.directionalIntensity} />
          <pointLight position={[-10, -10, -5]} intensity={SCENE_CONFIG.pointLightIntensity} color="#4f46e5" />
          <pointLight position={[10, 10, 10]} intensity={SCENE_CONFIG.pointLightIntensity} color="#ec4899" />
        </>
      )}

      {/* Lensflare Lights */}
      {SCENE_CONFIG.lensflares.enabled && SCENE_CONFIG.lensflares.lights.map((light, index) => (
        <LensflareLight key={index} {...light} />
      ))}

      {/* Glowing Orbs (for bubble scene) */}
      {SCENE_CONFIG.glowingOrbs.enabled && SCENE_CONFIG.glowingOrbs.orbs.map((orb, index) => (
        <GlowingOrb key={index} {...orb} />
      ))}

      {/* Floating Spheres */}
      <FloatingSpheres mouseX={mouseX} mouseY={mouseY} />

      {/* Environment Map - provides reflections for mirror/glass spheres */}
      {SCENE_CONFIG.skyboxType === 'image' ? (
        <SkyboxEnvironment />
      ) : (
        <Environment preset={SCENE_CONFIG.environmentPreset} />
      )}

      {/* Camera Controller - replaces stereo effect */}
      <CameraController mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  );
}
