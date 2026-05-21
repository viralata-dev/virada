"use client";

import { getStoredCredentials, hashPassword, saveCredentials } from "@utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        setError("");
        if (!username.trim() || !password) {
            setError("Usuário e senha são obrigatórios.");
            return;
        }
        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (password !== confirm) {
            setError("As senhas não coincidem.");
            return;
        }
        if (getStoredCredentials()) {
            setError("Já existe uma conta registrada neste dispositivo.");
            return;
        }

        setLoading(true);
        const passwordHash = await hashPassword(password);
        saveCredentials({ username: username.trim(), passwordHash });
        router.push("/login");
    }

    return (
        <div>Register</div>
    );
}
