import { login, signup } from "./auth-actions";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Button, Input, Link} from "@nextui-org/react";
import SignInWithGoogleBtn from "@/components/SignInWithGoogleBtn";

export default async function Login({
																			searchParams,
																		}: {
	searchParams: { message: string };
}) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		return redirect("/");
	}
	const params = await searchParams;
	return (
		<section className="h-[calc(100vh-57px)] flex justify-center items-center">
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<p className="text-2xl">Login</p>
					<p>Enter your email below to login to your account</p>
				</CardHeader>
				<CardBody className="flex flex-col gap-4">
					<form id="login-form" className="grid gap-4">
						<div className="grid gap-2">
							<p htmlFor="email">Email</p>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<p htmlFor="password">Password</p>
							</div>
							<Input
								minLength={6}
								name="password"
								id="password"
								type="password"
								required
							/>
						</div>
						{params.message && (
							<div className="text-sm font-medium text-destructive">
								{params.message}
							</div>
						)}
						<Button formAction={login} type="submit" className="w-full">
							Login
						</Button>
						<SignInWithGoogleBtn />
					</form>
					<div className="text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/signup" form="login-form" type="submit" className="underline">
							Sign up
						</Link>
					</div>
				</CardBody>
			</Card>
		</section>
	);
}
