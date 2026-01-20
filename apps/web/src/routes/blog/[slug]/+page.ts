import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../lib/content/blog/${params.slug}.md`);
		return {
			content: post.default,
			meta: post.metadata,
		};
	} catch (_e) {
		throw new Error("Post not found");
	}
};
