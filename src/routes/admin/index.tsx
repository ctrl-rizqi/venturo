import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import {
	ApiError,
	clearTokens,
	getProfileWithRefresh,
	hasStoredTokens,
} from "#/lib/auth-api";

const adminProfileQueryOptions = queryOptions({
	queryKey: ["auth", "profile"],
	queryFn: () => getProfileWithRefresh(),
	staleTime: 30_000,
	retry: false,
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

export const Route = createFileRoute("/admin/")({
	beforeLoad: async ({ context, location }) => {
		if (typeof window === "undefined") {
			return;
		}

		if (!hasStoredTokens()) {
			throw redirect({
				to: "/auth",
				search: { redirect: location.href },
				replace: true,
			});
		}

		try {
			await context.queryClient.ensureQueryData(adminProfileQueryOptions);
		} catch (error) {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				clearTokens();
				throw redirect({
					to: "/auth",
					search: { redirect: location.href },
					replace: true,
				});
			}

			throw error;
		}
	},
	component: RouteComponent,
	pendingComponent: AdminLoading,
	errorComponent: AdminError,
});

function AdminLoading() {
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">Admin</p>
				<h1 className="display-title mb-3 text-3xl font-bold text-(--sea-ink) sm:text-4xl">
					Memverifikasi sesi admin...
				</h1>
				<p className="m-0 text-sm text-(--sea-ink-soft)">
					Sedang mengambil profile dari API menggunakan TanStack Query.
				</p>
			</section>
		</main>
	);
}

function AdminError({ error }: { error: Error }) {
	const message =
		error instanceof ApiError && (error.status === 401 || error.status === 403)
			? "Sesi Anda telah berakhir. Silakan login kembali."
			: error.message || "Gagal memuat profile admin.";

	useEffect(() => {
		if (
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403)
		) {
			clearTokens();
			// Delay slightly to allow the error UI to be seen if needed,
			// though usually we want immediate redirect
			window.location.assign(authRedirectUrl(currentAdminPath()));
		}
	}, [error]);

	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">Admin</p>
				<h1 className="display-title mb-3 text-3xl font-bold text-(--sea-ink) sm:text-4xl">
					Akses admin gagal diverifikasi
				</h1>
				<p className="m-0 text-sm text-(--sea-ink-soft)">{message}</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-5 rounded-xl border border-[rgba(50,143,151,0.35)] bg-[linear-gradient(145deg,rgba(79,184,178,0.96),rgba(50,143,151,0.96))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(50,143,151,0.32)] transition hover:-translate-y-0.5"
				>
					Coba lagi
				</button>
			</section>
		</main>
	);
}

function RouteComponent() {
	const isClient = typeof window !== "undefined";
	const tokensAvailable = isClient && hasStoredTokens();

	const profileQuery = useQuery({
		...adminProfileQueryOptions,
		enabled: tokensAvailable,
	});

	useEffect(() => {
		if (!isClient || tokensAvailable) {
			return;
		}

		window.location.assign(authRedirectUrl(currentAdminPath()));
	}, [isClient, tokensAvailable]);

	if (!tokensAvailable || profileQuery.isPending) {
		return <AdminLoading />;
	}

	if (profileQuery.error) {
		throw profileQuery.error;
	}

	if (!profileQuery.data) {
		return <AdminLoading />;
	}

	const profile = profileQuery.data;

	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
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
			</section>
		</main>
	);
}
