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

<div
  class="min-h-screen text-[#e5e5e5] font-sans selection:bg-white selection:text-black"
>
  <div class="print-hidden">
    <ArchitectureBackground />
  </div>

  <!-- Print Styles & Animations -->
  <style>
    @media screen {
      @keyframes glow-pulse {
        0%,
        100% {
          color: #e5e5e5;
          text-shadow: 0 0 0px rgba(165, 243, 252, 0);
        }
        50% {
          color: #a5f3fc;
          text-shadow:
            0 0 10px rgba(165, 243, 252, 0.5),
            0 0 20px rgba(165, 243, 252, 0.3);
        }
      }

      .glow-letter {
        animation: glow-pulse 4s ease-in-out infinite;
        display: inline-block;
      }
    }

    @media print {
      @page {
        size: A4;
        margin: 0cm 0.4cm 0.4cm 0.4cm;
      }
      :global(body) {
        background: white !important;
        color: #000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-size: 14pt;
      }
      .print-hidden {
        display: none !important;
      }
      .print-text-black {
        color: #000 !important;
      }
      .print-text-gray {
        color: #4b5563 !important;
      }
      .print-border-black {
        border-color: #000 !important;
      }

      .print-grid {
        display: grid !important;
        grid-template-columns: 28% 72% !important;
        gap: 0 0.75rem !important;
        height: auto !important;
        background: linear-gradient(
          to right,
          #f4f4f5 0%,
          #f4f4f5 28%,
          #e5e5e5 28%,
          #e5e5e5 calc(28% + 1px),
          white calc(28% + 1px)
        ) !important;
      }

      aside,
      main {
        display: contents !important;
      }

      .print-sidebar-top {
        grid-column: 1 / -1 !important;
        grid-row: 1 !important;
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: flex-end !important;
        border-bottom: 1px solid #000 !important;
        padding-bottom: 0.25rem !important;
        margin-bottom: 0.25rem !important;
      }

      /* Row 2: Profile (Full Width) */
      .print-section-profile {
        grid-column: 1 / -1 !important;
        grid-row: 2 !important;
        padding-top: 0 !important;
        padding-right: 1rem !important;
        padding-bottom: 0.25rem !important;
        border-bottom: 1px solid #e5e5e5 !important;
        margin-bottom: 0.25rem !important;
      }

      /* Row 3+: Left Col (Education, Skills) & Right Col (Experience) */
      .print-section-education {
        grid-column: 2 !important;
        grid-row: 4 !important;
      }
      .print-section-skills {
        grid-column: 1 !important;
        grid-row: 3 !important;
      }
      .print-section-experience {
        grid-column: 2 !important;
        grid-row: 3 !important;
      }

      .print-col-left {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        height: auto !important;
      }

      .print-col-right {
        background: transparent !important;
        padding: 0 !important;
      }

      section {
        padding: 0.25rem !important;
      }

      h1 {
        font-size: 18pt !important;
        line-height: 1 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      h3 {
        font-size: 11pt !important;
        font-weight: 700 !important;
        margin-bottom: 0.15rem !important;
        margin-top: 0 !important;
        border-bottom: 1px solid #eee !important;
        padding-bottom: 2px !important;
      }
      h4 {
        margin-top: 0 !important;
        font-size: 10.5pt !important;
      }
      p,
      li,
      span {
        font-size: 9pt !important;
        color: #000 !important;
        line-height: 1.3 !important;
      }
      .font-mono {
        font-size: 8pt !important;
      }

      h1,
      h2,
      h3,
      h4 {
        break-after: avoid;
        page-break-after: avoid;
      }

      section,
      .group,
      section > .grid > div {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  </style>

  <!-- Grid Layout Container -->
  <div
    class="relative min-h-screen flex flex-col lg:grid lg:grid-cols-12 print-grid"
  >
    <!-- --- LEFT SIDEBAR (Sticky Info) --- -->
    <aside
      class="lg:col-span-4 lg:h-screen lg:sticky lg:top-0 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262626] backdrop-blur-sm bg-[#0a0a0a]/80 print-col-left print-border-black"
    >
      <div class="space-y-12 print-sidebar-top print:space-y-0">
        {@render sidebarContent()}
      </div>

      <!-- Controls (Lang + PDF) -->
      <div class="mt-12 lg:mt-0 flex flex-col gap-6 print-hidden">
        <div class="flex gap-4 text-sm font-mono">
          {#each ["en", "de", "tr"] as l (l)}
            <button
              onclick={() => setLang(l as Language)}
              class="uppercase tracking-widest hover:text-white transition-colors {lang ===
              l
                ? 'text-white border-b border-white'
                : 'text-neutral-600'}"
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
          <Download
            class="w-4 h-4 group-hover:translate-y-1 transition-transform"
          />
        </button>
      </div>
    </aside>

    <!-- --- RIGHT CONTENT (Scrollable) --- -->
    <main
      class="lg:col-span-8 bg-[#0a0a0a]/50 backdrop-blur-sm print-col-right"
    >
      <!-- 01 // PROFILE -->
      <section
        class="border-b border-[#262626] p-8 lg:p-16 print-border-black print-section-profile"
      >
        <h3
          class="text-xs font-mono text-neutral-500 mb-8 print:mb-4 uppercase tracking-widest print-text-gray"
        >
          {t.sections.about}
        </h3>
        <p
          class="text-xl lg:text-2xl print:text-sm leading-relaxed text-neutral-300 font-light print-text-black text-justify"
        >
          {t.summaryText}
        </p>
      </section>

      <!-- 02 // EXPERIENCE -->
      <section
        class="border-b border-[#262626] p-8 lg:p-16 print-border-black print-section-experience"
      >
        <h3
          class="text-xs font-mono text-neutral-500 mb-12 print:mb-4 uppercase tracking-widest print-text-gray"
        >
          {t.sections.experience}
        </h3>

        <div class="space-y-16 print:space-y-3">
          {#each t.jobs as job (job.title)}
            <div class="group">
              <div
                class="flex flex-col md:flex-row md:justify-between md:items-baseline mb-4 print:mb-1"
              >
                <h4
                  class="text-2xl font-medium text-white print-text-black group-hover:underline decoration-1 underline-offset-4"
                >
                  {job.title}
                </h4>
                <span
                  class="font-mono text-sm text-neutral-500 print-text-gray mt-1 md:mt-0"
                >
                  {job.date}
                </span>
              </div>

              <div
                class="text-sm font-mono text-neutral-400 mb-6 print:mb-2 uppercase tracking-wide print-text-black"
              >
                {job.company} — {job.location}
              </div>

              <p
                class="text-neutral-300 mb-4 print:mb-2 font-light print-text-black"
              >
                {job.description}
              </p>

              <ul class="space-y-2 print:space-y-0.5">
                {#each job.bullets as bull (bull)}
                  <li
                    class="flex gap-4 text-neutral-400 text-sm print-text-gray"
                  >
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
      <section
        class="border-b border-[#262626] p-8 lg:p-16 print-border-black print-section-skills"
      >
        <h3
          class="text-xs font-mono text-neutral-500 mb-12 print:mb-4 uppercase tracking-widest print-text-gray"
        >
          {t.sections.skills}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 print:gap-2">
          {@render techBlock("Infrastructure", t.tech.infra)}
          {@render techBlock("DevOps & Cloud", t.tech.devops)}
          {@render techBlock("Development", t.tech.dev)}
          {@render techBlock("Core Competencies", t.tech.core)}
        </div>
      </section>

      <!-- 04 // EDUCATION -->
      <section class="p-8 lg:p-16 print-section-education">
        <h3
          class="text-xs font-mono text-neutral-500 mb-12 print:mb-4 uppercase tracking-widest print-text-gray"
        >
          {t.sections.education}
        </h3>

        <div class="grid grid-cols-1 gap-8 print:gap-1">
          {#each t.edu as e (e.degree)}
            <div class="group">
              <div
                class="flex flex-col md:flex-row md:justify-between md:items-baseline mb-4 print:mb-1"
              >
                <h4
                  class="text-2xl font-medium text-white print-text-black group-hover:underline decoration-1 underline-offset-4"
                >
                  {e.degree}
                </h4>
                <span
                  class="font-mono text-sm text-neutral-500 print-text-gray mt-1 md:mt-0"
                >
                  {e.year}
                </span>
              </div>

              <div
                class="text-sm font-mono text-neutral-400 uppercase tracking-wide print-text-black"
              >
                {e.school}
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- FOOTER -->
      <footer
        class="p-8 lg:p-16 border-t border-[#262626] text-neutral-600 text-xs font-mono uppercase tracking-widest flex justify-between items-center print-hidden"
      >
        <span>© {new Date().getFullYear()} dztf.dev</span>
        <div class="w-16 h-px bg-[#262626]"></div>
        <span>Svelte</span>
      </footer>
    </main>
  </div>
</div>

{#snippet sidebarContent()}
  <!-- Header / Name -->
  <div>
    <h1
      class="text-5xl lg:text-6xl font-bold tracking-tighter leading-none mb-4 print:hidden uppercase print-text-black"
    >
      E<span class="glow-letter" style="animation-delay: 0.5s">d</span>i<span
        class="glow-letter"
        style="animation-delay: 2.5s">z</span
      ><br />
      <span class="glow-letter" style="animation-delay: 1.5s">T</span>e<span
        class="glow-letter"
        style="animation-delay: 3.5s">f</span
      >en<br />
      lilio<br />
      glu
    </h1>
    <h1
      class="hidden print:block text-2xl font-bold uppercase tracking-tighter mb-0 print-text-black leading-none"
    >
      Ediz Tefenlilioglu
    </h1>
    <div class="w-12 h-1 bg-white mb-6 print:hidden bg-current"></div>
    <h2
      class="text-xl tracking-wide uppercase text-neutral-400 print-text-black font-bold print:text-lg"
    >
      {t.role}
    </h2>
    <p
      class="text-sm text-neutral-500 mt-2 font-mono print-text-gray print:mt-0"
    >
      {t.subRole}
    </p>
  </div>

  <!-- Contact Details -->
  <div
    class="space-y-4 font-mono text-sm text-neutral-400 print-text-black print:text-right print:flex print:flex-col print:items-end print:justify-end print:gap-1 print:space-y-0 print:pr-4"
  >
    <div
      class="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group"
    >
      <MapPin
        class="w-4 h-4 group-hover:scale-110 transition-transform print:w-3 print:h-3"
      />
      <span>Wiesbaden, DE</span>
    </div>
    <a
      href="mailto:ediz.tefenlilioglu@dztf.dev"
      class="flex items-center gap-3 hover:text-white transition-colors group"
    >
      <Mail
        class="w-4 h-4 group-hover:scale-110 transition-transform print:w-3 print:h-3"
      />
      <span>ediz.tefenlilioglu@dztf.dev</span>
    </a>
    <a
      href="https://github.com/ediiiz"
      target="_blank"
      rel="noreferrer"
      class="flex items-center gap-3 hover:text-white transition-colors group"
    >
      <Globe
        class="w-4 h-4 group-hover:scale-110 transition-transform print:w-3 print:h-3"
      />
      <span>github.com/ediiiz</span>
    </a>
    <a
      href="/blog"
      class="flex items-center gap-3 hover:text-white transition-colors group"
    >
      <ArrowUpRight
        class="w-4 h-4 group-hover:scale-110 transition-transform print:w-3 print:h-3"
      />
      <span>Blog</span>
    </a>
  </div>
{/snippet}

{#snippet techBlock(title: string, items: string[])}
  <div class="print:break-inside-avoid">
    <h4
      class="text-sm font-bold text-white uppercase tracking-wider mb-4 print:mb-1 border-b border-[#262626] pb-2 print-text-black print-border-black"
    >
      {title}
    </h4>
    <ul class="space-y-2 print:space-y-0.5">
      {#each items as item (item)}
        <li
          class="text-sm text-neutral-400 font-mono print-text-gray hover:text-neutral-200 transition-colors cursor-default"
        >
          {item}
        </li>
      {/each}
    </ul>
  </div>
{/snippet}
