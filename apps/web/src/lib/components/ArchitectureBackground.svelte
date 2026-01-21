<script lang="ts">
import { Canvas } from "@threlte/core";
import ArchitectureScene from "./ArchitectureScene.svelte";
</script>

<div class="fixed top-0 left-0 w-full h-dvh -z-10 pointer-events-none print:hidden bg-[#0a0a0a]">
  <!-- 3D Scene -->
  <div class="absolute inset-0 z-0">
    <Canvas>
      <ArchitectureScene />
    </Canvas>
  </div>

  <!-- Glass Overlay -->
  <!-- This creates the "frosted glass" effect over the 3D scene -->
  <div class="absolute inset-0 z-10 backdrop-blur-md saturate-[180%] bg-white/[0.02] border-white/[0.05] border"></div>
</div>
