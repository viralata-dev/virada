"use client";

import { Alert, Button, Stack, Text, Title } from "@mantine/core";
import { getStoredCredentials, hashPassword, saveCredentials, setSession } from "@utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, MultiForm, PasswordInput } from "~/app/components/Forms";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(values: Record<string, unknown>) {
    setError("");
    setLoading(true);

    const username = typeof values.username === "string" ? values.username.trim() : "";
    const password = typeof values.password === "string" ? values.password : "";
    const confirmPassword =
      typeof values.confirmPassword === "string" ? values.confirmPassword : "";

    if (!username.trim() || !password) {
      setError("Usuário e senha são obrigatórios.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }
    if (getStoredCredentials()) {
      setError("Já existe uma conta registrada neste dispositivo.");
      setLoading(false);
      return;
    }

    const passwordHash = await hashPassword(password);
    saveCredentials({ username, passwordHash });
    setSession();
    router.push("/2026");
  }

  return (
    // Mantine Stack usage: https://mantine.dev/core/stack/#usage
    <Stack h="100%" gap="32" w="100%" align="center" justify="center" p="lg">
      {/* Mantine Title usage: https://mantine.dev/core/title/#usage */}
      <Title order={1}>Boas vindas!</Title>
      <MultiForm
        initialValues={{ username: "", password: "", confirmPassword: "" }}
        onSubmit={handleRegister}
      >
        <Input
          name="username"
          label="Como gosta de ser chamado?"
          placeholder="Digite seu nome"
          withAsterisk
        />
        <PasswordInput name="password" label="Senha" placeholder="Digite sua senha" withAsterisk />
        <PasswordInput
          name="confirmPassword"
          label="Confirmar senha"
          placeholder="Repita sua senha"
          withAsterisk
        />
        {error && (
          // Mantine Alert usage: https://mantine.dev/core/alert/#usage
          <Alert color="red" title="Erro no cadastro" w="100%">
            {error}
          </Alert>
        )}
        {/* Mantine Button usage: https://mantine.dev/core/button/#usage */}
        <Button type="submit" loading={loading} w="100%">
          Cadastrar
        </Button>
      </MultiForm>
      {/* Mantine Text usage: https://mantine.dev/core/text/#usage */}
      <Text size="sm" c="dimmed">
        Já tem conta? Acesse /login
      </Text>
    </Stack>
  );
}
