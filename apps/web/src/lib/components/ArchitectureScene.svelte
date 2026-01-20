<script lang="ts">
import { T, useTask } from "@threlte/core";
import * as THREE from "three";

let mouseX = 0;
let mouseY = 0;

const handleMouseMove = (e: MouseEvent) => {
	mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
	mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
};

// Abstract structure data
const positions: [number, number, number][] = [
	[0, 0, 0],
	[4, 2, 4],
	[-4, -2, -4],
	[6, -4, 2],
	[-6, 4, -2],
	[0, 6, 0],
	[0, -6, 0],
	[8, 0, -4],
	[-8, 0, 4],
];

const cubes = positions.map((pos) => ({
	position: pos,
	rotation: [
		Math.random() * Math.PI,
		Math.random() * Math.PI,
		Math.random() * Math.PI,
	] as [number, number, number],
	scale: 0.8 + Math.random() * 0.5,
}));

let groupRotationY = $state(0);
let groupRotationX = $state(0);
let groupRotationZ = $state(0);

useTask((delta) => {
	groupRotationY += 0.001;

	// Mouse influence
	groupRotationX += (mouseY - groupRotationX) * 0.05;
	groupRotationZ += (mouseX - groupRotationZ) * 0.05;
});
</script>

<svelte:window onmousemove={handleMouseMove} />

<T.PerspectiveCamera
  makeDefault
  position={[30, 20, 40]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0);
  }}
/>

<T.Fog args={[0x0a0a0a, 20, 60]} />

<T.Group rotation.y={groupRotationY} rotation.x={groupRotationX} rotation.z={groupRotationZ}>
  {#each cubes as cube}
    <T.Mesh position={cube.position} rotation={cube.rotation} scale={cube.scale}>
      <T.BoxGeometry args={[4, 4, 4]} />
      <T.MeshBasicMaterial color={0x404040} wireframe />
    </T.Mesh>
  {/each}
</T.Group>

<T.GridHelper args={[60, 20, 0x333333, 0x1a1a1a]} position.y={-10} />
