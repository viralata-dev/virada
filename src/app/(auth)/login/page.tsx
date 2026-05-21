"use client";

import { getStoredCredentials, hashPassword, isLoggedIn, setSession } from "@utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            router.replace("/2025");
        } else if (!getStoredCredentials()) {
            router.replace("/register");
        }
    }, [router]);

    async function handleLogin() {
        setError("");
        const stored = getStoredCredentials();
        if (!stored) {
            router.replace("/register");
            return;
        }

        setLoading(true);
        const passwordHash = await hashPassword(password);
        if (username.trim() === stored.username && passwordHash === stored.passwordHash) {
            setSession();
            router.replace("/2025");
            return;
        }

        setError("Usuário ou senha incorretos.");
        setLoading(false);
    }

    return (
        <div>Login</div>
    );
}
