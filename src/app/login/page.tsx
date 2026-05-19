"use client";

import {
    Anchor,
    Box,
    Button,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { getStoredCredentials, hashPassword, isLoggedIn, setSession } from "@utils/auth";
import Link from "next/link";
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
        } else {
            setError("Usuário ou senha incorretos.");
            setLoading(false);
        }
    }

    return (
        <Box
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper shadow="md" p="xl" radius="md" style={{ width: "100%", maxWidth: "400px" }}>
                <Stack gap="md">
                    <Title order={2} ta="center">
                        Entrar
                    </Title>
                    {error && (
                        <Text c="red" size="sm" ta="center">
                            {error}
                        </Text>
                    )}
                    <TextInput
                        label="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.currentTarget.value)}
                        autoComplete="username"
                    />
                    <PasswordInput
                        label="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        autoComplete="current-password"
                    />
                    <Button onClick={handleLogin} loading={loading} fullWidth>
                        Entrar
                    </Button>
                    <Text ta="center" size="sm">
                        Não tem uma conta?{" "}
                        <Anchor component={Link} href="/register">
                            Registrar
                        </Anchor>
                    </Text>
                </Stack>
            </Paper>
        </Box>
    );
}
