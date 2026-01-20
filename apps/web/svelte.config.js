import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { escapeSvelte, mdsvex } from "mdsvex";
import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
	themes: ["tokyo-night"],
	langs: [
		"javascript",
		"typescript",
		"svelte",
		"bash",
		"json",
		"css",
		"html",
		"ini",
		"yaml",
		"markdown",
		"python",
		"rust",
		"go",
		"sql",
	],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: [".md", ".mdx"],
			highlight: {
				highlighter: async (code, lang = "text") => {
					const html = escapeSvelte(
						highlighter.codeToHtml(code, {
							lang: highlighter.getLoadedLanguages().includes(lang)
								? lang
								: "text",
							theme: "tokyo-night",
						}),
					);
					return `<div class="relative group code-block" data-code={${JSON.stringify(code)}}>{@html ${JSON.stringify(html)} }</div>`;
				},
			},
		}),
	],

	extensions: [".svelte", ".md", ".mdx"],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: "build",
			assets: "build",
			fallback: "404.html",
			precompress: false,
			strict: true,
		}),
		paths: {
			base: process.env.BASE_PATH || "",
		},
	},
};

export default config;
