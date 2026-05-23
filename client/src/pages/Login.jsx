const API_BASE_URL = import.meta.env.VITE_API_URL;
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { login: "", password: "" },
  });

  const handleSubmit = async (values) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Неверный логин или пароль");

      const data = await res.json();
      login(data.user);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        MERCURY | ССМП
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Логин"
              placeholder="Ваш логин"
              required
              {...form.getInputProps("login")}
            />
            <PasswordInput
              label="Пароль"
              placeholder="Ваш пароль"
              required
              {...form.getInputProps("password")}
            />
            <Button type="submit" fullWidth mt="xl">
              Войти
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
