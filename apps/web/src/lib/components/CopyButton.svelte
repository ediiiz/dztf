<script lang="ts">
import { Check, Copy } from "lucide-svelte";
import { fade, scale } from "svelte/transition";

let { code } = $props<{ code: string }>();

let copied = $state(false);
let timeout: ReturnType<typeof setTimeout>;

const handleCopy = async () => {
	try {
		await navigator.clipboard.writeText(code);
		copied = true;

		clearTimeout(timeout);
		timeout = setTimeout(() => {
			copied = false;
		}, 2000);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};
</script>

<button
  onclick={handleCopy}
  aria-label={copied ? "Copied to clipboard" : "Copy code"}
  class="
    absolute top-3 right-3 z-10
    flex items-center justify-center
    h-8 w-8 rounded-md
    border border-transparent
    text-[#787c99] 
    hover:bg-[#7aa2f7]/10 hover:text-[#7aa2f7] hover:border-[#7aa2f7]/20
    focus:outline-none focus:ring-2 focus:ring-[#7aa2f7]/50
    transition-all duration-200 ease-out
    opacity-0 group-hover:opacity-100
  "
>
  {#if copied}
    <div in:scale={{ duration: 200, start: 0.5 }} class="absolute">
      <Check class="w-4 h-4 text-[#9ece6a]" strokeWidth={2.5} />
    </div>
  {:else}
    <div in:fade={{ duration: 150 }} class="absolute">
      <Copy class="w-4 h-4" strokeWidth={2} />
    </div>
  {/if}
</button>
