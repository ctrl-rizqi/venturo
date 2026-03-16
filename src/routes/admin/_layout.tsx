import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import {
	ApiError,
	clearTokens,
	getProfileWithRefresh,
	hasStoredTokens,
} from "#/lib/auth-api";

export const adminProfileQueryOptions = queryOptions({
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

export const Route = createFileRoute("/admin/_layout")({
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
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<Outlet />
			</section>
		</main>
	);
}
