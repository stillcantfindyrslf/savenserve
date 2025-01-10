"use client";

import { signInWithGoogle } from "@/app/login/auth-actions";
import React from "react";
import {Button} from "@nextui-org/react";

const SignInWithGoogleButton = () => {
	return (
		<Button
			type="button"
			variant="outline"
			className="w-full"
			onPress={() => {
				signInWithGoogle();
			}}
		>
			Login with Google
		</Button>
	);
};

export default SignInWithGoogleButton;