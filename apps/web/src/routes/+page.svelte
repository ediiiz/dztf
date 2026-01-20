<script lang="ts">
import {
	ArrowUpRight,
	ChevronDown,
	Download,
	Globe,
	Mail,
	MapPin,
} from "lucide-svelte";
import { onMount } from "svelte";
import ArchitectureBackground from "$lib/components/ArchitectureBackground.svelte";
import { type Language, translations } from "$lib/data/translations";

let lang = $state<Language>("en");
let t = $derived(translations[lang]);

function setLang(l: Language) {
	lang = l;
}

function handlePrint() {
	window.print();
}
</script>

<svelte:head>
  <title>Ediz Tefenlilioglu | {t.role}</title>
</svelte:head>

<div class="min-h-screen text-[#e5e5e5] font-sans bg-[#0a0a0a] selection:bg-white selection:text-black">
  <ArchitectureBackground />
  
  <!-- Print Styles -->
  <style>
    @media print {
      @page { margin: 0; size: A4; }
      :global(body) { background: white !important; color: black !important; -webkit-print-color-adjust: exact; }
      .print-hidden { display: none !important; }
      .print-text-black { color: #000 !important; }
      .print-text-gray { color: #666 !important; }
      .print-border-black { border-color: #000 !important; }
      .print-grid { display: grid !important; grid-template-columns: 35% 65% !important; height: 100vh !important; }
      .print-col-left { background: #f4f4f5 !important; padding: 2cm !important; height: 100% !important; }
      .print-col-right { padding: 2cm !important; background: white !important; }
      .print-no-bg { background: none !important; }
    }
  </style>

  <!-- Grid Layout Container -->
  <div class="relative min-h-screen flex flex-col lg:grid lg:grid-cols-12 print-grid">
    
    <!-- --- LEFT SIDEBAR (Sticky Info) --- -->
    <aside class="lg:col-span-4 lg:h-screen lg:sticky lg:top-0 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262626] backdrop-blur-sm bg-[#0a0a0a]/80 print-col-left print-border-black">
      
      <div class="space-y-12">
        <!-- Header / Name -->
        <div>
          <h1 class="text-5xl lg:text-6xl font-bold tracking-tighter leading-none mb-4 uppercase print-text-black">
            Ediz<br/>Tefen<br/>lilio<br/>glu
          </h1>
          <div class="w-12 h-1 bg-white mb-6 print-text-black print-border-black bg-current"></div>
          <h2 class="text-xl tracking-wide uppercase text-neutral-400 print-text-gray">{t.role}</h2>
          <p class="text-sm text-neutral-500 mt-2 font-mono print-text-gray">{t.subRole}</p>
        </div>

        <!-- Contact Details -->
        <div class="space-y-4 font-mono text-sm text-neutral-400 print-text-black">
          <div class="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group">
            <MapPin class="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Frankfurt am Main, DE</span>
          </div>
          <a href="mailto:ediz.tefenlilioglu@dztf.dev" class="flex items-center gap-3 hover:text-white transition-colors group">
            <Mail class="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>ediz.tefenlilioglu@dztf.dev</span>
          </a>
          <a href="https://github.com/ediiiz" target="_blank" rel="noreferrer" class="flex items-center gap-3 hover:text-white transition-colors group">
            <Globe class="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>github.com/ediiiz</span>
          </a>
          <a href="/blog" class="flex items-center gap-3 hover:text-white transition-colors group">
            <ArrowUpRight class="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Blog</span>
          </a>
        </div>
      </div>

      <!-- Controls (Lang + PDF) -->
      <div class="mt-12 lg:mt-0 flex flex-col gap-6 print-hidden">
        <div class="flex gap-4 text-sm font-mono">
          {#each ['en', 'de', 'tr'] as l}
            <button
              onclick={() => setLang(l as Language)}
              class="uppercase tracking-widest hover:text-white transition-colors {lang === l ? 'text-white border-b border-white' : 'text-neutral-600'}"
            >
              {l}
            </button>
          {/each}
        </div>

        <button 
          onclick={handlePrint}
          class="group flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
        >
          <span>{t.download}</span>
          <Download class="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </aside>

    <!-- --- RIGHT CONTENT (Scrollable) --- -->
    <main class="lg:col-span-8 bg-[#0a0a0a]/50 backdrop-blur-sm print-col-right print-no-bg">
      
      <!-- 01 // PROFILE -->
      <section class="border-b border-[#262626] p-8 lg:p-16 print-border-black">
        <h3 class="text-xs font-mono text-neutral-500 mb-8 uppercase tracking-widest print-text-gray">
          {t.sections.about}
        </h3>
        <p class="text-xl lg:text-2xl leading-relaxed text-neutral-300 font-light print-text-black text-justify">
          {t.summaryText}
        </p>
      </section>

      <!-- 02 // EXPERIENCE -->
      <section class="border-b border-[#262626] p-8 lg:p-16 print-border-black">
        <h3 class="text-xs font-mono text-neutral-500 mb-12 uppercase tracking-widest print-text-gray">
          {t.sections.experience}
        </h3>
        
        <div class="space-y-16 print:space-y-8">
          {#each t.jobs as job}
            <div class="group">
              <div class="flex flex-col md:flex-row md:justify-between md:items-baseline mb-4">
                <h4 class="text-2xl font-medium text-white print-text-black group-hover:underline decoration-1 underline-offset-4">
                  {job.title}
                </h4>
                <span class="font-mono text-sm text-neutral-500 print-text-gray mt-1 md:mt-0">
                  {job.date}
                </span>
              </div>
              
              <div class="text-sm font-mono text-neutral-400 mb-6 uppercase tracking-wide print-text-black">
                {job.company} — {job.location}
              </div>

              <p class="text-neutral-300 mb-4 font-light print-text-black">
                {job.description}
              </p>

              <ul class="space-y-2">
                {#each job.bullets as bull}
                  <li class="flex gap-4 text-neutral-400 text-sm print-text-gray">
                    <ArrowUpRight class="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
                    <span>{bull}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </section>

      <!-- 03 // TECH MATRIX -->
      <section class="border-b border-[#262626] p-8 lg:p-16 print-border-black">
        <h3 class="text-xs font-mono text-neutral-500 mb-12 uppercase tracking-widest print-text-gray">
          {t.sections.skills}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 print:gap-8">
          {@render techBlock("Infrastructure", t.tech.infra)}
          {@render techBlock("DevOps & Cloud", t.tech.devops)}
          {@render techBlock("Development", t.tech.dev)}
          {@render techBlock("Core Competencies", t.tech.core)}
        </div>
      </section>

      <!-- 04 // EDUCATION -->
      <section class="p-8 lg:p-16">
        <h3 class="text-xs font-mono text-neutral-500 mb-12 uppercase tracking-widest print-text-gray">
          {t.sections.education}
        </h3>
        
        <div class="grid grid-cols-1 gap-8">
          {#each t.edu as e}
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center border-l-2 border-[#262626] pl-6 py-1 print-border-black">
              <div>
                <h4 class="text-lg text-white font-medium print-text-black">{e.degree}</h4>
                <span class="text-sm text-neutral-500 font-mono mt-1 block print-text-gray">{e.school}</span>
              </div>
              <span class="text-sm text-neutral-600 font-mono mt-2 sm:mt-0 print-text-black">{e.year}</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="p-8 lg:p-16 border-t border-[#262626] text-neutral-600 text-xs font-mono uppercase tracking-widest flex justify-between items-center print-hidden">
        <span>© {new Date().getFullYear()} dztf.dev</span>
        <div class="w-16 h-px bg-[#262626]"></div>
        <span>Arch. V2</span>
      </footer>

    </main>
  </div>
</div>

{#snippet techBlock(title: string, items: string[])}
  <div>
    <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#262626] pb-2 print-text-black print-border-black">
      {title}
    </h4>
    <ul class="space-y-2">
      {#each items as item}
        <li class="text-sm text-neutral-400 font-mono print-text-gray hover:text-neutral-200 transition-colors cursor-default">
          {item}
        </li>
      {/each}
    </ul>
  </div>
{/snippet}
