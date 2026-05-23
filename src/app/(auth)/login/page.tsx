"use client";

import { Alert, Button, Stack, Text, Title } from "@mantine/core";
import { getStoredCredentials, hashPassword, setSession } from "@utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, MultiForm, PasswordInput } from "~/app/components/Forms";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(values: Record<string, unknown>) {
    setError("");
    setLoading(true);

    const username = typeof values.username === "string" ? values.username.trim() : "";
    const password = typeof values.password === "string" ? values.password : "";

    if (!username || !password) {
      setError("Usuário e senha são obrigatórios.");
      setLoading(false);
      return;
    }

    const stored = getStoredCredentials();
    if (!stored) {
      setError("Nenhuma conta encontrada neste dispositivo. Faça seu cadastro primeiro.");
      setLoading(false);
      return;
    }

    const passwordHash = await hashPassword(password);
    const isValid = stored.username === username && stored.passwordHash === passwordHash;

    if (!isValid) {
      setError("Usuário ou senha inválidos.");
      setLoading(false);
      return;
    }

    setSession();
    router.push("/2026");
  }

  return (
    // Mantine Stack usage: https://mantine.dev/core/stack/#usage
    <Stack h="100%" gap="32" w="100%" align="center" justify="center" p="lg">
      {/* Mantine Title usage: https://mantine.dev/core/title/#usage */}
      <Title order={1}>Olá de novo!</Title>
      <MultiForm initialValues={{ username: "", password: "" }} onSubmit={handleLogin}>
        <Input
          name="username"
          label="Como gosta de ser chamado?"
          placeholder="Digite seu nome"
          withAsterisk
        />
        <PasswordInput name="password" label="Senha" placeholder="Digite sua senha" withAsterisk />
        {error && (
          // Mantine Alert usage: https://mantine.dev/core/alert/#usage
          <Alert color="red" title="Erro de autenticação" w="100%">
            {error}
          </Alert>
        )}
        {/* Mantine Button usage: https://mantine.dev/core/button/#usage */}
        <Button type="submit" loading={loading} w="100%">
          Login
        </Button>
      </MultiForm>
      {/* Mantine Text usage: https://mantine.dev/core/text/#usage */}
      <Text size="sm" c="dimmed">
        Não tem conta? Acesse /register
      </Text>
    </Stack>
  );
}
