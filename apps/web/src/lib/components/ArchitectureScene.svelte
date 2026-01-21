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
const PULSE_SPEED = 0.05; // Speed of pulses along connections

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
type NodeData = {
	position: THREE.Vector3;
	scale: number;
	velocity: THREE.Vector3;
	fireIntensity: number;
	cooldown: number;
};

type Pulse = {
	start: THREE.Vector3;
	end: THREE.Vector3;
	progress: number;
	active: boolean;
};

// Use $state for reactivity in Svelte 5
let nodes = $state<NodeData[]>(
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
		fireIntensity: 0,
		cooldown: Math.random() * 100,
	})),
);

// Pulses traveling along connections
let pulses: Pulse[] = [];
const MAX_PULSES = 50;

// Dynamic Geometry for Lines
const lineGeometry = new THREE.BufferGeometry();
const lineMaterial = new THREE.LineBasicMaterial({
	color: 0x22d3ee,
	transparent: true,
	opacity: 0.4, // Increased opacity for better visibility
	blending: THREE.AdditiveBlending,
});

// Pulse Instance Management
const pulseGeometry = new THREE.SphereGeometry(0.15, 8, 8);
const pulseMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	toneMapped: false,
});
let pulseMesh: THREE.InstancedMesh;
const tempObj = new THREE.Object3D();

// Update lines and nodes every frame
let meshRefs: (THREE.Mesh | undefined)[] = [];

useTask((delta) => {
	const positions: number[] = [];
	const time = performance.now() / 1000;

	// 1. Update Nodes & Physics
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		node.position.add(node.velocity);

		// Bounce back
		if (Math.abs(node.position.x) > 17) node.velocity.x *= -1;
		if (Math.abs(node.position.y) > 10) node.velocity.y *= -1;
		if (Math.abs(node.position.z) > 7) node.velocity.z *= -1;

		// Random Firing Logic
		node.fireIntensity = Math.max(0, node.fireIntensity - delta * 2); // Decay
		node.cooldown -= delta * 10;

		// Chance to fire if cooldown is ready
		if (node.cooldown <= 0 && Math.random() < 0.005) {
			node.fireIntensity = 2.0; // Spike intensity
			node.cooldown = 100 + Math.random() * 200; // Reset cooldown

			// Spawn pulses to neighbors
			const neighbors = [];
			for (let j = 0; j < nodes.length; j++) {
				if (i === j) continue;
				if (node.position.distanceTo(nodes[j].position) < CONNECTION_DIST) {
					neighbors.push(nodes[j]);
				}
			}

			// Send pulse to 1-3 random neighbors
			const numPulses = Math.floor(Math.random() * 2) + 1;
			for (let k = 0; k < numPulses; k++) {
				if (neighbors.length > 0 && pulses.length < MAX_PULSES) {
					const targetIndex = Math.floor(Math.random() * neighbors.length);
					const target = neighbors[targetIndex];
					pulses.push({
						start: node.position, // Reference directly so it moves with node
						end: target.position,
						progress: 0,
						active: true,
					});
				}
			}
		}

		// Update mesh position and visual state
		const mesh = meshRefs[i];
		if (mesh) {
			mesh.position.copy(node.position);
			// Update material emissive intensity based on fire state
			// We need to cast to access material properties safely or just assume it's correct
			const mat = mesh.material as THREE.MeshPhysicalMaterial;
			if (mat) {
				mat.emissiveIntensity = 0.4 + node.fireIntensity;
				// Optional: slightly scale up when firing
				const scaleScale = 1 + node.fireIntensity * 0.2;
				mesh.scale.setScalar(scaleScale);
			}
		}
	}

	// 2. Update Lines (Connections)
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

	// 3. Update Pulses
	if (pulseMesh) {
		let activeCount = 0;
		// Filter out finished pulses (create new array to clean up)
		pulses = pulses.filter((p) => {
			p.progress += PULSE_SPEED;
			if (p.progress >= 1) {
				// Optional: Trigger target node?
				// For now, just die
				return false;
			}

			// Update instance matrix
			tempObj.position.lerpVectors(p.start, p.end, p.progress);

			// Scale pulse based on progress (fade in/out)
			const scale = Math.sin(p.progress * Math.PI) * 1.5;
			tempObj.scale.setScalar(Math.max(0.01, scale));

			tempObj.updateMatrix();
			pulseMesh.setMatrixAt(activeCount, tempObj.matrix);
			activeCount++;

			return true;
		});

		pulseMesh.count = activeCount;
		pulseMesh.instanceMatrix.needsUpdate = true;
	}
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
		{#each nodes as node, i}
			<T.Mesh
				bind:ref={meshRefs[i]}
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
		
		<!-- Pulses (Instanced) -->
		<T.InstancedMesh
			bind:ref={pulseMesh}
			args={[pulseGeometry, pulseMaterial, MAX_PULSES]}
			count={0}
		/>
	</T.Group>
</Float>

<!-- Background Fog for depth blending -->
<T.FogExp2 color="#0a0a0a" density={0.02} />
