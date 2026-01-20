<script lang="ts">
import { ArrowUpRight } from "lucide-svelte";
import { resolve } from "$app/paths";
import ArchitectureBackground from "$lib/components/ArchitectureBackground.svelte";

let { data } = $props();
</script>

<svelte:head>
  <title>Blog | Ediz Tefenlilioglu</title>
</svelte:head>

<div class="min-h-screen text-[#e5e5e5] font-sans">
  <ArchitectureBackground />

  <div class="relative z-10 container mx-auto px-6 py-24">
    <header class="mb-24 border-b border-[#262626] pb-12">
      <a href="/" class="text-xs font-mono text-neutral-500 uppercase tracking-widest hover:text-white transition-colors mb-8 inline-block">
        &larr; Back to CV
      </a>
      <h1 class="text-6xl lg:text-8xl font-bold tracking-tighter uppercase leading-none">
        Blog<span class="text-neutral-500">.</span>
      </h1>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-8 space-y-24">
        {#each data.posts as post}
          <article class="group">
            <div class="flex flex-col md:flex-row md:justify-between md:items-baseline mb-6">
              <h2 class="text-3xl lg:text-4xl font-medium text-white group-hover:underline decoration-1 underline-offset-8">
                <a href={resolve('/blog/[slug]', { slug: post.slug ?? '' })}>
                  {post.title}
                </a>
              </h2>
              <span class="font-mono text-sm text-neutral-500 mt-2 md:mt-0">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <p class="text-xl text-neutral-400 font-light leading-relaxed mb-8 max-w-2xl">
              {post.excerpt}
            </p>

            <a href={resolve('/blog/[slug]', { slug: post.slug ?? '' })} class="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-white hover:gap-4 transition-all">
              Read Article <ArrowUpRight class="w-4 h-4" />
            </a>
          </article>
        {/each}
      </div>

      <aside class="lg:col-span-4 space-y-12">
        <div class="border-t border-[#262626] pt-8">
          <h3 class="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-6">Categories</h3>
          <ul class="space-y-4 font-mono text-sm text-neutral-400">
            <li class="hover:text-white cursor-pointer transition-colors">AI Systems</li>
            <li class="hover:text-white cursor-pointer transition-colors">Infrastructure</li>
            <li class="hover:text-white cursor-pointer transition-colors">MLOps</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</div>
