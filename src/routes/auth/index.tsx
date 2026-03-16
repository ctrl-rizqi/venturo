import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export const Route = createFileRoute("/auth/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0B1120] p-4">
			<div className="w-full max-w-[440px] flex flex-col items-center">
				<div className="w-full bg-white rounded-[32px] p-10 shadow-2xl flex flex-col items-center">
					<div className="bg-[#2563EB] rounded-xl p-3 mb-8">
						<Zap className="text-white fill-white size-7" aria-hidden="true" />
					</div>

					<h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">
						Welcome Back
					</h1>
					<p className="text-[#6B7280] mb-10 text-center font-medium">
						Please enter your details to sign in
					</p>

					<form className="w-full space-y-7" action="#" method="post">
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
								className="h-14 border-[#E5E7EB] bg-white rounded-xl px-4 text-[#111827] placeholder:text-[#9CA3AF] text-base focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-none"
							/>
						</div>

						<Button
							type="submit"
							className="w-full h-14 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-base font-bold text-white shadow-xl shadow-blue-600/20 transition-all"
						>
							Sign In
						</Button>
					</form>

					<div className="w-full flex items-center gap-4 my-10">
						<div className="h-px flex-1 bg-[#F3F4F6]" />
						<span className="text-[10px] font-bold text-[#9CA3AF] tracking-widest">
							OR CONTINUE WITH
						</span>
						<div className="h-px flex-1 bg-[#F3F4F6]" />
					</div>

					<Button
						variant="outline"
						className="w-full h-14 border-[#E5E7EB] rounded-xl text-[#111827] font-bold hover:bg-[#F9FAFB] flex gap-3 text-base shadow-none"
					>
						<GoogleIcon />
						Sign in with Google
					</Button>

					<div className="mt-10 pt-10 border-t border-[#F3F4F6] w-full text-center">
						<p className="text-sm text-[#6B7280] font-medium">
							Don't have an account?{" "}
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
