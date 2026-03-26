import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

export default function SkillsGlobe() {
    const mountRef = useRef(null);
    const [hoveredSkill, setHoveredSkill] = useState(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        // Get container dimensions
        const container = mountRef.current;
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create raycaster for mouse interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Camera positioning
        camera.position.z = 15;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0x0084ff, 0.5);
        backLight.position.set(-5, -5, -5);
        scene.add(backLight);

        // Create Earth globe
        const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c4870,
            emissive: 0x112244,
            emissiveIntensity: 0.4,
            shininess: 15,
            transparent: true,
            opacity: 0.9
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Create atmosphere glow
        const glowGeometry = new THREE.SphereGeometry(5.2, 64, 64);
        const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0x0084ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glow);

        // Create grid lines
        const gridHelper = new THREE.GridHelper(20, 20, 0x0084ff, 0x0084ff);
        gridHelper.position.y = -6;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.2;
        scene.add(gridHelper);

        // Create skill nodes
        const skills = [
            { name: 'React', color: 0x61dafb, level: 0.9 },
            { name: 'Three.js', color: 0xff8800, level: 0.85 },
            { name: 'TypeScript', color: 0x3178c6, level: 0.8 },
            { name: 'Node.js', color: 0x68a063, level: 0.85 },
            { name: 'UI/UX', color: 0xff3366, level: 0.75 },
            { name: 'WebGL', color: 0x990000, level: 0.7 },
            { name: 'JavaScript', color: 0xf7df1e, level: 0.95 },
            { name: 'CSS/SASS', color: 0xcd6799, level: 0.8 },
            { name: 'GraphQL', color: 0xe535ab, level: 0.75 }
        ];

        const skillNodes = [];

        skills.forEach((skill, index) => {
            // Create skill node geometry
            const radius = skill.level * 1.5;
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: skill.color,
                emissive: skill.color,
                emissiveIntensity: 0.3,
                shininess: 30
            });

            const sphere = new THREE.Mesh(geometry, material);

            // Position nodes in a spiral pattern around the globe
            const phi = Math.acos(-1 + (2 * index) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;

            const distance = 7;
            sphere.position.x = distance * Math.sin(phi) * Math.cos(theta);
            sphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
            sphere.position.z = distance * Math.cos(phi);

            // Add to scene
            scene.add(sphere);

            // Create orbital line
            const orbitCurve = new THREE.EllipseCurve(
                0, 0,
                distance, distance,
                0, 2 * Math.PI,
                false,
                0
            );

            const orbitPoints = orbitCurve.getPoints(50);
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: skill.color,
                transparent: true,
                opacity: 0.3
            });

            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            orbit.rotation.x = phi;
            orbit.rotation.y = theta;
            scene.add(orbit);

            // Save reference
            skillNodes.push({
                mesh: sphere,
                name: skill.name,
                color: skill.color,
                orbit,
                baseScale: radius,
                basePosition: { ...sphere.position }
            });
        });

        // Create particle background
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 200;

        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Create connecting lines between skills
        const connectionLines = [];
        for (let i = 0; i < skillNodes.length; i++) {
            for (let j = i + 1; j < skillNodes.length; j++) {
                if (Math.random() > 0.7) continue; // Only create some connections

                const points = [
                    skillNodes[i].mesh.position,
                    skillNodes[j].mesh.position
                ];

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({
                    color: 0x0084ff,
                    transparent: true,
                    opacity: 0.2
                });

                const line = new THREE.Line(geometry, material);
                scene.add(line);

                connectionLines.push({
                    line,
                    points,
                    nodes: [skillNodes[i], skillNodes[j]]
                });
            }
        }

        // Animation function
        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            requestAnimationFrame(animate);

            // Rotate earth slowly
            earth.rotation.y = elapsedTime * 0.1;

            // Animate skill nodes
            skillNodes.forEach((node, i) => {
                const offset = i * 0.2;

                // Pulsate size slightly
                const scale = node.baseScale * (1 + Math.sin(elapsedTime * 0.5 + offset) * 0.05);
                node.mesh.scale.set(scale, scale, scale);

                // Update orbit lines opacity based on hover
                if (hoveredSkill === node.name) {
                    node.orbit.material.opacity = 0.8;
                    node.mesh.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);
                } else {
                    node.orbit.material.opacity = 0.3;
                }
            });

            // Update connection lines
            connectionLines.forEach(conn => {
                // Update positions as nodes might have moved
                conn.geometry = new THREE.BufferGeometry().setFromPoints([
                    conn.nodes[0].mesh.position,
                    conn.nodes[1].mesh.position
                ]);

                // Highlight connections to hovered skill
                if (hoveredSkill &&
                    (conn.nodes[0].name === hoveredSkill ||
                        conn.nodes[1].name === hoveredSkill)) {
                    conn.line.material.opacity = 0.6;
                    conn.line.material.color.set(0x00ffff);
                } else {
                    conn.line.material.opacity = 0.2;
                    conn.line.material.color.set(0x0084ff);
                }
            });

            // Animate particles
            particlesMesh.rotation.x = elapsedTime * 0.05;
            particlesMesh.rotation.y = elapsedTime * 0.03;

            controls.update();
            renderer.render(scene, camera);
        };

        // Handle mouse movement for interaction
        const handleMouseMove = (event) => {
            // Calculate mouse position in normalized device coordinates
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(
                skillNodes.map(node => node.mesh)
            );

            if (intersects.length > 0) {
                // Find which skill node was intersected
                const intersectedNode = skillNodes.find(
                    node => node.mesh.id === intersects[0].object.id
                );

                if (intersectedNode) {
                    setHoveredSkill(intersectedNode.name);
                    document.body.style.cursor = 'pointer';
                }
            } else {
                setHoveredSkill(null);
                document.body.style.cursor = 'auto';
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Start animation
        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            container.removeChild(renderer.domElement);

            // Dispose of resources
            scene.traverse(object => {
                if (!object.isMesh) return;

                object.geometry.dispose();
                if (object.material.isMaterial) {
                    object.material.dispose();
                } else {
                    // Handle materials array
                    for (const material of object.material) {
                        material.dispose();
                    }
                }
            });
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-96 relative">
            <div ref={mountRef} className="w-full h-full bg-black bg-opacity-5 rounded-lg overflow-hidden" />
            {hoveredSkill && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full pointer-events-none">
                    {hoveredSkill}
                </div>
            )}
        </div>
    );
}