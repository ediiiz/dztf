export const load = async () => {
	const paths = import.meta.glob("$lib/content/blog/*.md", { eager: true });
	const posts = Object.entries(paths).map(([path, file]) => {
		const slug = path.split("/").pop()?.replace(".md", "");
		const metadata = (file as { metadata: Record<string, unknown> })
			.metadata as {
			date: string;
			title: string;
			image?: string;
			excerpt?: string;
		};
		return {
			slug,
			...metadata,
		};
	});
	// Sort by date desc
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	return { posts };
};
