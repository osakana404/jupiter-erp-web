const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import TableSort from "../components/TableSortParts.jsx";
import {
  Title,
  Text,
  Button,
  Group,
  Paper,
  Loader,
  Alert,
  Modal,
  Stack,
  TextInput,
  Select,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import TextHead from "../components/TextHead.jsx";

export default function Parts() {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  // Получаем запчасти
  const {
    data: parts,
    isLoading: partsLoading,
    error: partsError,
  } = useQuery({
    queryKey: ["parts"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/parts`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка загрузки запчастей");
      return response.json();
    },
    select: (data) =>
      data.map((part) => ({
        ...part,
        categoryName: part.category?.name || "Без категории", // Достаем имя категории
        formattedDate: dayjs(part.createdAt).format("DD.MM.YYYY HH:mm"),
      })),
  });

  // Получаем категории для выпадающего списка
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/category`, {
        credentials: "include",
      });
      return response.json();
    },
  });

  const form = useForm({
    initialValues: { name: "", description: "", categoryId: "" },
    validate: {
      name: (v) => (v.length < 2 ? "Слишком коротко" : null),
      categoryId: (v) => (!v ? "Выберите категорию" : null),
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values) => {
      const response = await fetch(`${API_BASE_URL}/api/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      close();
      form.reset();
    },
  });

  if (partsLoading)
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <TextHead title="запчасти" text="запчасти" />
        </div>
        <Button color="green" onClick={open}>
          + Добавить запись
        </Button>
      </Group>

      <Paper shadow="sm" radius="md" p="md" withBorder>
        {/* Передаем список категорий в таблицу, чтобы там тоже можно было менять */}
        <TableSort data={parts} categories={categories} />
      </Paper>

      <Modal opened={opened} onClose={close} title="Новая запчасть" centered>
        <form onSubmit={form.onSubmit((v) => createMutation.mutate(v))}>
          <Stack>
            <TextInput
              label="Наименование"
              required
              {...form.getInputProps("name")}
            />

            <Select
              label="Категория"
              placeholder="Выберите из списка"
              required
              data={
                categories?.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                })) || []
              }
              {...form.getInputProps("categoryId")}
            />

            <TextInput
              label="Описание"
              {...form.getInputProps("description")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Отмена
              </Button>
              <Button
                type="submit"
                color="green"
                loading={createMutation.isPending}
              >
                Создать
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}
