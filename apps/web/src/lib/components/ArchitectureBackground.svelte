<script lang="ts">
import { Canvas } from "@threlte/core";
import ArchitectureScene from "./ArchitectureScene.svelte";
</script>

<div class="fixed top-0 left-0 w-full h-full -z-10 bg-[#0a0a0a] pointer-events-none print:hidden">
  <Canvas>
    <ArchitectureScene />
  </Canvas>
</div>
