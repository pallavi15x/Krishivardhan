import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth || 400,
      height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const point = new THREE.PointLight(0xc6952e, 0.7);
    point.position.set(-4, -2, -3);
    scene.add(point);

    // Core Mesh
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3, 1),
      new THREE.MeshStandardMaterial({ color: 0x1f4d36, metalness: 0.35, roughness: 0.4 })
    );
    scene.add(core);

    // Wireframe Mesh
    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3 * 1.18, 1),
      new THREE.MeshBasicMaterial({ color: 0xc6952e, wireframe: true, transparent: true, opacity: 0.5 })
    );
    scene.add(wire);

    // Satellite Orbit 1
    const orbit1 = new THREE.Group();
    scene.add(orbit1);
    const sat1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xc6952e, emissive: 0xc6952e, emissiveIntensity: 0.35 })
    );
    sat1.position.set(2.4, 0.4, 0);
    orbit1.add(sat1);

    // Satellite Orbit 2
    const orbit2 = new THREE.Group();
    scene.add(orbit2);
    const sat2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x3d6e8e, emissive: 0x3d6e8e, emissiveIntensity: 0.35 })
    );
    sat2.position.set(0, 0, 2.1);
    orbit2.add(sat2);

    // Floating Particles
    const count = 70;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6.5;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeo,
      new THREE.PointsMaterial({ color: 0xe7c878, size: 0.045, transparent: true, opacity: 0.85 })
    );
    scene.add(particles);

    let raf;
    let floatT = 0;
    const animate = () => {
      floatT += 0.01;
      core.rotation.y += 0.004;
      core.position.y = Math.sin(floatT) * 0.1;
      wire.rotation.y -= 0.0025;
      wire.position.y = core.position.y;
      orbit1.rotation.y += 0.012;
      orbit2.rotation.x += 0.008;
      particles.rotation.y += 0.0007;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    function handleResize() {
      const w = mount.clientWidth || 400,
        h = mount.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", minHeight: 320 }} />;
}
