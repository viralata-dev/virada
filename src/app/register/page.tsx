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
import { getStoredCredentials, hashPassword, saveCredentials } from "@utils/auth";
import Link from "next/link";
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
            Criar conta
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
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirmar senha"
            value={confirm}
            onChange={(e) => setConfirm(e.currentTarget.value)}
            autoComplete="new-password"
          />
          <Button onClick={handleRegister} loading={loading} fullWidth>
            Registrar
          </Button>
          <Text ta="center" size="sm">
            Já tem uma conta?{" "}
            <Anchor component={Link} href="/login">
              Entrar
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Box>
  );
}
