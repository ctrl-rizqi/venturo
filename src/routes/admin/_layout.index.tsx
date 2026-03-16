import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	clearTokens,
	hasStoredTokens,
} from "#/lib/auth-api";
import { adminProfileQueryOptions } from "./_layout";

export const Route = createFileRoute("/admin/_layout/")({
	component: RouteComponent,
});

function currentAdminPath(): string {
	if (typeof window === "undefined") {
		return "/admin";
	}

	return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function authRedirectUrl(target: string): string {
	return `/auth?redirect=${encodeURIComponent(target)}`;
}

function RouteComponent() {
	const isClient = typeof window !== "undefined";
	const tokensAvailable = isClient && hasStoredTokens();

	const profileQuery = useQuery({
		...adminProfileQueryOptions,
		enabled: tokensAvailable,
	});

	if (!profileQuery.data) {
		return null;
	}

	const profile = profileQuery.data;

	return (
		<>
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="island-kicker mb-2">Protected Admin Route</p>
					<h1 className="display-title mb-3 text-3xl font-bold text-(--sea-ink) sm:text-4xl">
						Welcome, {profile.name}
					</h1>
					<p className="m-0 text-sm text-(--sea-ink-soft)">
						Halaman ini hanya tampil setelah login berhasil dan profile
						terambil dari API lewat TanStack Query.
					</p>
				</div>

				<button
					type="button"
					onClick={() => {
						clearTokens();
						window.location.assign(authRedirectUrl(currentAdminPath()));
					}}
					className="rounded-xl border border-(--line) bg-white/70 px-4 py-2 text-sm font-semibold text-(--sea-ink) transition hover:-translate-y-0.5"
				>
					Logout
				</button>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-2">
				<article className="rounded-xl border border-(--line) bg-white/60 p-4">
					<p className="island-kicker mb-1">Email</p>
					<p className="m-0 text-sm text-(--sea-ink)">{profile.email}</p>
				</article>
				<article className="rounded-xl border border-(--line) bg-white/60 p-4">
					<p className="island-kicker mb-1">Role</p>
					<p className="m-0 text-sm text-(--sea-ink)">{profile.role}</p>
				</article>
				<article className="rounded-xl border border-(--line) bg-white/60 p-4">
					<p className="island-kicker mb-1">User ID</p>
					<p className="m-0 text-sm text-(--sea-ink)">{profile.id}</p>
				</article>
				<article className="rounded-xl border border-(--line) bg-white/60 p-4">
					<p className="island-kicker mb-1">Avatar</p>
					<a href={profile.avatar} target="_blank" rel="noreferrer">
						Lihat avatar profile
					</a>
				</article>
			</div>
		</>
	);
}
