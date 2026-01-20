<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import ArchitectureBackground from "$lib/components/ArchitectureBackground.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title} | Ediz Tefenlilioglu</title>
</svelte:head>

<div class="min-h-screen text-[#e5e5e5] font-sans bg-[#0a0a0a]">
  <ArchitectureBackground />

  <div class="relative z-10 container mx-auto px-6 py-24 max-w-4xl">
    <a
      href={resolve("/blog")}
      class="text-xs font-mono text-neutral-500 uppercase tracking-widest hover:text-white transition-colors mb-12 inline-flex items-center gap-2"
    >
      <ArrowLeft size={14} /> Back to Blog
    </a>

    <article>
      <header class="mb-16">
        <div
          class="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4"
        >
          {new Date(data.meta.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h1
          class="text-5xl lg:text-7xl font-bold tracking-tighter uppercase leading-none mb-8"
        >
          {data.meta.title}
        </h1>
        <div class="w-24 h-1 bg-white"></div>
      </header>

      {#if data.meta.image}
        <div class="mb-16 border border-[#262626] p-2">
          <img
            src={data.meta.image}
            alt={data.meta.title}
            class="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      {/if}

      <div
        class="prose prose-invert prose-neutral max-w-none
        prose-h2:uppercase prose-h2:tracking-tighter prose-h2:text-3xl prose-h2:font-bold prose-h2:border-b prose-h2:border-[#262626] prose-h2:pb-4
        prose-p:text-xl prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-300
        prose-a:text-white prose-a:underline prose-a:underline-offset-4
        prose-strong:text-white prose-strong:font-medium
        prose-pre:bg-transparent prose-pre:p-2"
      >
        <data.content />
      </div>
    </article>

    <footer
      class="mt-24 pt-12 border-t border-[#262626] flex justify-between items-center"
    >
      <div class="text-xs font-mono text-neutral-500 uppercase tracking-widest">
        Author: {data.meta.author}
      </div>
      <a
        href="/"
        class="text-xs font-mono text-neutral-500 uppercase tracking-widest hover:text-white transition-colors"
      >
        dztf.dev
      </a>
    </footer>
  </div>
</div>
