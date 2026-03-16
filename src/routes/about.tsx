import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getRuntimeInfo = createServerFn({ method: "GET" }).handler(async () => {
	return {
		serverTime: new Date().toISOString(),
		stack: ["TanStack Router", "TanStack Query", "TanStack Start"],
	};
});

const runtimeInfoQueryOptions = queryOptions({
	queryKey: ["runtime-info"],
	queryFn: () => getRuntimeInfo(),
	staleTime: 30_000,
});

export const Route = createFileRoute("/about")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(runtimeInfoQueryOptions),
	component: About,
});

function About() {
	const { data } = useSuspenseQuery(runtimeInfoQueryOptions);

	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">About</p>
				<h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					A small starter with room to grow.
				</h1>
				<p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
					TanStack Start gives you type-safe routing, server functions, and
					modern SSR defaults. Use this as a clean foundation, then layer in
					your own routes, styling, and add-ons.
				</p>

				<div className="mt-6 rounded-xl border border-[var(--line)] bg-white/60 p-4">
					<p className="island-kicker mb-2">Query Cache</p>
					<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
						Data ini diprefetch via route loader dan dibaca ulang lewat
						<code>useSuspenseQuery</code>.
					</p>
					<p className="mt-3 m-0 text-sm text-[var(--sea-ink)]">
						Server time: {data.serverTime}
					</p>
					<p className="mt-1 m-0 text-sm text-[var(--sea-ink)]">
						Stack: {data.stack.join(" | ")}
					</p>
				</div>
			</section>
		</main>
	);
}
