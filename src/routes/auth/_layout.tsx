import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="page-wrap px-4 pb-10 pt-10 sm:pt-14">
			<section className="island-shell rise-in grid overflow-hidden rounded-4xl border border-(--line) lg:grid-cols-[1.08fr_1fr]">
				<aside className="relative border-b border-(--line) bg-[linear-gradient(155deg,color-mix(in_oklab,var(--surface-strong)_90%,white_10%),color-mix(in_oklab,var(--lagoon)_18%,var(--surface)))] px-7 py-9 sm:px-10 sm:py-12 lg:border-b-0 lg:border-r">
					<div className="pointer-events-none absolute -left-16 top-6 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.4),transparent_68%)]" />
					<p className="island-kicker mb-3">Auth Area</p>
					<h1 className="display-title text-3xl leading-tight font-bold text-(--sea-ink) sm:text-4xl">
						Welcome back.
					</h1>
					<p className="mt-4 max-w-md text-sm leading-relaxed text-(--sea-ink-soft) sm:text-base">
						This is a dedicated authentication layout. Keep all sign-in and
						sign-up pages in this route group for a consistent identity flow.
					</p>
				</aside>

				<div className="bg-[color-mix(in_oklab,var(--surface)_84%,white_16%)] px-6 py-8 sm:px-10 sm:py-12">
					<Outlet />
				</div>
			</section>
		</main>
	);
}
