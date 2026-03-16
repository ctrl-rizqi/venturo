import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	ApiError,
	getProfileWithRefresh,
	hasStoredTokens,
	type LoginPayload,
	login,
} from "#/lib/auth-api";

type AuthSearch = {
	redirect?: string;
};

function sanitizeInternalRedirect(rawRedirect?: string): string {
	if (!rawRedirect) {
		return "/";
	}

	if (!rawRedirect.startsWith("/")) {
		return "/";
	}

	if (rawRedirect.startsWith("//")) {
		return "/";
	}

	return rawRedirect;
}

export const Route = createFileRoute("/auth/")({
	validateSearch: (search): AuthSearch => {
		if (typeof search.redirect === "string") {
			return { redirect: search.redirect };
		}

		return {};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const search = Route.useSearch();
	const [email, setEmail] = useState("john@mail.com");
	const [password, setPassword] = useState("changeme");
	const [formError, setFormError] = useState<string | null>(null);

	const safeRedirect = useMemo(
		() => sanitizeInternalRedirect(search.redirect),
		[search.redirect],
	);

	const profileQuery = useQuery({
		queryKey: ["auth", "profile", "auth-page"],
		queryFn: () => getProfileWithRefresh(),
		enabled: hasStoredTokens(),
		staleTime: 30_000,
		retry: false,
	});

	const loginMutation = useMutation({
		mutationFn: (payload: LoginPayload) => login(payload),
		onMutate: () => {
			setFormError(null);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
			// Redirect immediately after successful login and token storage
			window.location.assign(safeRedirect);
		},
		onError: (error) => {
			if (error instanceof Error) {
				setFormError(error.message);
				return;
			}

			setFormError("Login gagal. Silakan coba lagi.");
		},
	});

	useEffect(() => {
		if (profileQuery.data) {
			window.location.assign(safeRedirect);
		}
	}, [profileQuery.data, safeRedirect]);

	useEffect(() => {
		if (
			profileQuery.error instanceof ApiError &&
			(profileQuery.error.status === 401 || profileQuery.error.status === 403)
		) {
			setFormError(null);
		}
	}, [profileQuery.error]);

	const isSubmitting = loginMutation.isPending;

	return (
		<main className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-[#0B1120] p-4">
			<div className="w-full max-w-110 flex flex-col items-center">
				<div className="w-full bg-white rounded-4xl p-10 shadow-2xl flex flex-col items-center">
					<div className="bg-[#2563EB] rounded-xl p-3 mb-8">
						<Zap className="text-white fill-white size-7" aria-hidden="true" />
					</div>

					<h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight text-center">
						Welcome Back
					</h1>
					<p className="text-[#6B7280] mb-10 text-center font-medium">
						Please enter your details to sign in
					</p>

					<form
						className="w-full space-y-7"
						onSubmit={(event) => {
							event.preventDefault();

							if (isSubmitting) {
								return;
							}

							const payload: LoginPayload = {
								email: email.trim(),
								password,
							};

							if (!payload.email || !payload.password) {
								setFormError("Email dan password wajib diisi.");
								return;
							}

							loginMutation.mutate(payload);
						}}
					>
						<div className="space-y-2.5">
							<Label
								htmlFor="email"
								className="text-sm font-bold text-[#111827] ml-0.5"
							>
								Email Address
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								placeholder="name@company.com"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								className="h-14 border-[#E5E7EB] bg-white rounded-xl px-4 text-[#111827] placeholder:text-[#9CA3AF] text-base focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-none"
							/>
						</div>

						<div className="space-y-2.5">
							<div className="flex justify-between items-center px-0.5">
								<Label
									htmlFor="password"
									className="text-sm font-bold text-[#111827]"
								>
									Password
								</Label>
								<button
									type="button"
									className="text-xs font-bold text-[#2563EB] hover:underline bg-transparent border-none p-0 cursor-pointer"
								>
									Forgot Password?
								</button>
							</div>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								placeholder="••••••••"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								className="h-14 border-[#E5E7EB] bg-white rounded-xl px-4 text-[#111827] placeholder:text-[#9CA3AF] text-base focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-none"
							/>
						</div>

						{formError ? (
							<p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
								{formError}
							</p>
						) : null}

						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full h-14 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-base font-bold text-white shadow-xl shadow-blue-600/20 transition-all disabled:opacity-70"
						>
							{isSubmitting ? "Signing in..." : "Sign In"}
						</Button>
					</form>

					<div className="w-full flex items-center gap-4 my-10">
						<div className="h-px flex-1 bg-[#F3F4F6]" />
						<span className="text-[10px] font-bold text-[#9CA3AF] tracking-widest uppercase">
							OR CONTINUE WITH
						</span>
						<div className="h-px flex-1 bg-[#F3F4F6]" />
					</div>

					<Button
						variant="outline"
						className="w-full h-14 border-[#E5E7EB] rounded-xl text-[#111827] font-bold bg-white! hover:bg-gray-50! hover:text-[#2563EB] flex gap-3 text-base shadow-none"
					>
						<GoogleIcon />
						Sign in with Google
					</Button>

					<div className="mt-10 pt-10 border-t border-[#F3F4F6] w-full text-center">
						<p className="text-sm text-[#6B7280] font-medium">
							Don&apos;t have an account?{" "}
							<button
								type="button"
								className="text-[#2563EB] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
							>
								Request Access
							</button>
						</p>
					</div>
				</div>

				<div className="mt-10 flex items-center gap-4 text-xs font-semibold text-[#9CA3AF]">
					<button
						type="button"
						className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
					>
						Privacy Policy
					</button>
					<div className="size-1 rounded-full bg-[#374151]" />
					<button
						type="button"
						className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
					>
						Terms of Service
					</button>
				</div>
			</div>
		</main>
	);
}

function GoogleIcon() {
	return (
		<svg
			className="size-5 shrink-0"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Google logo"
		>
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
}
