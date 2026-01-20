<script lang="ts">
import "../app.css";

let { children } = $props();
</script>

<div class="min-h-screen font-sans bg-[#0a0a0a] text-[#e5e5e5] selection:bg-white selection:text-black">
  {@render children()}
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
