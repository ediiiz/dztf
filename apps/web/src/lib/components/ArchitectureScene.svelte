<script lang="ts">
import { T, useTask } from "@threlte/core";
import { Float } from "@threlte/extras";
import { Spring } from "svelte/motion";
import { MediaQuery } from "svelte/reactivity";
import * as THREE from "three";

// --- Configuration ---
const NODE_COUNT = 30;
const CONNECTION_DIST = 10;
const NODE_COLOR = "#22d3ee"; // Tailwind cyan-400
const LIGHT_COLOR = "#06b6d4"; // Tailwind cyan-500

// --- Device Detection ---
const isTouch = new MediaQuery("(pointer: coarse)");

// --- Mouse Interaction (Spring for smoothness) ---
const mouseX = new Spring(0, { stiffness: 0.05, damping: 0.3 });
const mouseY = new Spring(0, { stiffness: 0.05, damping: 0.3 });

const handleMouseMove = (e: MouseEvent) => {
	// Don't react on touch devices/mobile
	if (isTouch.current) return;

	// Map mouse to approx 3D world coordinates
	mouseX.target = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
	mouseY.target = -(e.clientY / window.innerHeight) * 2 + 1; // -1 to 1
};

// --- Neural Network Generation ---
// Use $state for reactivity in Svelte 5
let nodes = $state(
	Array.from({ length: NODE_COUNT }).map(() => ({
		position: new THREE.Vector3(
			(Math.random() - 0.5) * 35,
			(Math.random() - 0.5) * 20,
			(Math.random() - 0.5) * 15,
		),
		scale: 0.1 + Math.random() * 0.15,
		velocity: new THREE.Vector3(
			(Math.random() - 0.5) * 0.01,
			(Math.random() - 0.5) * 0.01,
			(Math.random() - 0.5) * 0.01,
		),
	})),
);

// Dynamic Geometry for Lines
const lineGeometry = new THREE.BufferGeometry();
const lineMaterial = new THREE.LineBasicMaterial({
	color: 0x22d3ee,
	transparent: true,
	opacity: 0.4, // Increased opacity for better visibility
	blending: THREE.AdditiveBlending,
});

// Update lines and nodes every frame
useTask(() => {
	const positions: number[] = [];

	// Update node positions
	for (const node of nodes) {
		node.position.add(node.velocity);

		// Bounce back
		if (Math.abs(node.position.x) > 17) node.velocity.x *= -1;
		if (Math.abs(node.position.y) > 10) node.velocity.y *= -1;
		if (Math.abs(node.position.z) > 7) node.velocity.z *= -1;
	}

	// Simple O(N^2) check for connections
	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			const dist = nodes[i].position.distanceTo(nodes[j].position);
			if (dist < CONNECTION_DIST) {
				positions.push(
					nodes[i].position.x,
					nodes[i].position.y,
					nodes[i].position.z,
					nodes[j].position.x,
					nodes[j].position.y,
					nodes[j].position.z,
				);
			}
		}
	}
	lineGeometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(positions, 3),
	);
});
</script>

<svelte:window onmousemove={handleMouseMove} />

<!-- Camera -->
<T.PerspectiveCamera makeDefault position={[0, 0, 25]} fov={50} />

<!-- --- Lighting --- -->

<!-- 1. Ambient Base -->
<T.AmbientLight intensity={0.2} color="#000020" />

<!-- 2. The "Cursor" Light - Follows Mouse -->
<!-- Increased intensity for physically correct lighting in Threlte 8 -->
<T.PointLight
	position={[mouseX.current * 20, mouseY.current * 12, 5]}
	intensity={2000}
	distance={50}
	decay={2}
	color={LIGHT_COLOR}
/>

<!-- 3. Static Rim Light for depth -->
<T.SpotLight
	position={[20, 20, 20]}
	angle={0.5}
	penumbra={1}
	intensity={1000}
	color="#a855f7"
/>

<!-- --- The Neural Network --- -->
<Float floatIntensity={0.3} rotationIntensity={0.1} speed={1}>
	<T.Group>
		<!-- Nodes -->
		{#each nodes as node}
			<T.Mesh
				position={[node.position.x, node.position.y, node.position.z]}
			>
				<T.IcosahedronGeometry args={[node.scale, 1]} />
				<T.MeshPhysicalMaterial
					color={NODE_COLOR}
					roughness={0.1}
					metalness={0.9}
					emissive={NODE_COLOR}
					emissiveIntensity={0.4}
				/>
			</T.Mesh>
		{/each}

		<!-- Connections -->
		<T.LineSegments geometry={lineGeometry} material={lineMaterial} />
	</T.Group>
</Float>

<!-- Background Fog for depth blending -->
<T.FogExp2 color="#0a0a0a" density={0.02} />
