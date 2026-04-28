import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Title,
  Text,
  Button,
  Group,
  Paper,
  Loader,
  Alert,
  Modal,
  TextInput,
  ActionIcon,
  Table,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

export default function Categories() {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null); // null для создания, id для редактирования

  // 1. Получение данных
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/category", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка загрузки категорий");
      return res.json();
    },
  });

  const form = useForm({
    initialValues: { name: "" },
    validate: {
      name: (v) => (v.length < 2 ? "Слишком короткое название" : null),
    },
  });

  // 2. Мутация создания/обновления
  const mutation = useMutation({
    mutationFn: async (values) => {
      const url = editingId
        ? `http://localhost:3000/api/category/${editingId}`
        : `http://localhost:3000/api/category`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleClose();
    },
  });

  // 3. Мутация удаления
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`http://localhost:3000/api/category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const handleEdit = (category) => {
    setEditingId(category.id);
    form.setValues({ name: category.name });
    open();
  };

  const handleClose = () => {
    close();
    setEditingId(null);
    form.reset();
  };

  if (isLoading) return <Loader size="xl" />;
  if (error) return <Alert color="red">{error.message}</Alert>;

  return (
    <Stack>
      <Group justify="space-between">
        <div>
          <Title>КАТЕГОРИИ</Title>
          <Text c="dimmed">Справочник групп запчастей</Text>
        </div>
        <Button color="green" onClick={open}>
          + Добавить категорию
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Название</Table.Th>
              <Table.Th ta="right">Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories.map((cat) => (
              <Table.Tr key={cat.id}>
                <Table.Td>{cat.id}</Table.Td>
                <Table.Td fw={500}>{cat.name}</Table.Td>
                <Table.Td>
                  <Group justify="flex-end" gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(cat)}
                    >
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        if (window.confirm("Удалить категорию?"))
                          deleteMutation.mutate(cat.id);
                      }}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={editingId ? "Редактировать категорию" : "Новая категория"}
      >
        <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
          <TextInput
            label="Название категории"
            placeholder="Напр: Двигатель"
            required
            {...form.getInputProps("name")}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Сохранить
            </Button>
          </Group>
        </form>
      </Modal>
    </Stack>
  );
}
