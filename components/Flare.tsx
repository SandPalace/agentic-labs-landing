'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

export default function Flare() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 3500, 15000);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      15000
    );
    camera.position.z = 250;
    cameraRef.current = camera;

    // Setup renderer with alpha for lensflares
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load lensflare textures
    const textureFlare0 = textureLoader.load('/textures/lensflare/lensflare0.png');
    const textureFlare3 = textureLoader.load('/textures/lensflare/lensflare3.png');

    // Add some cubes to the scene
    const geometry = new THREE.BoxGeometry(20, 20, 20);

    for (let i = 0; i < 1500; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 50,
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
      mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
      mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();

      scene.add(mesh);
    }

    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(dirLight);

    // Add point lights with lensflares
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

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - window.innerWidth / 2;
      mouseY = event.clientY - window.innerHeight / 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      // Camera follows mouse with damping
      cameraRef.current.position.x += (mouseX - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (-mouseY - cameraRef.current.position.y) * 0.05;
      cameraRef.current.lookAt(sceneRef.current.position);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
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
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black"
    />
  );
}
