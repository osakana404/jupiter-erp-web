const API_BASE_URL = import.meta.env.VITE_API_URL;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Button,
  Modal,
  TextInput,
  Paper,
  Stack,
  Loader,
  Badge,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconTrash,
  IconEdit,
  IconPlus,
  IconUsersGroup,
} from "@tabler/icons-react";
import TextHead from "../components/TextHead";

export default function Departments() {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null);

  // --- ЗАГРУЗКА ДАННЫХ ---
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/departments`, { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });

  // --- ФОРМА ---
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Название слишком короткое" : null),
    },
  });

  // --- МУТАЦИИ ---
  const saveMutation = useMutation({
    mutationFn: (values) => {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE_URL}/api/departments/${editingId}`
        : `${API_BASE_URL}/api/departments`;
      return fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`${API_BASE_URL}/api/departments/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (!res.ok)
          throw new Error(
            "Ошибка при удалении. Возможно, в отделе есть сотрудники.",
          );
        return res.json();
      }),
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
  });

  // --- ОБРАБОТЧИКИ ---
  const handleEdit = (dept) => {
    setEditingId(dept.id);
    form.setValues({ name: dept.name });
    open();
  };

  const handleClose = () => {
    setEditingId(null);
    form.reset();
    close();
  };

  if (isLoading)
    return (
      <Center style={{ height: "70vh" }}>
        <Loader size="xl" />
      </Center>
    );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <TextHead title="Управление отделами" text="Структура организации" />
        </div>

        <Button
          leftSection={<IconPlus size={18} />}
          onClick={open}
          color="teal"
          radius="md"
        >
          Создать отдел
        </Button>
      </Group>

      <Paper withBorder radius="md" p={0}>
        <Table verticalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Название отдела</Table.Th>
              <Table.Th>Сотрудников</Table.Th>
              <Table.Th style={{ width: 100 }}>Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {departments?.map((dept) => (
              <Table.Tr key={dept.id}>
                <Table.Td fw={600}>{dept.name}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconUsersGroup size={16} color="gray" />
                    <Text size="sm">{dept.contacts?.length || 0}</Text>
                    {dept.contacts?.length > 0 && (
                      <Badge size="xs" variant="outline">
                        Активен
                      </Badge>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(dept)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() =>
                        confirm(
                          `Удалить отдел "${dept.name}"? Это может повлиять на привязанные контакты.`,
                        ) && deleteMutation.mutate(dept.id)
                      }
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* --- МОДАЛКА --- */}
      <Modal
        opened={opened}
        onClose={handleClose}
        title={editingId ? "Переименовать отдел" : "Добавить новый отдел"}
        centered
      >
        <form onSubmit={form.onSubmit((v) => saveMutation.mutate(v))}>
          <Stack>
            <TextInput
              label="Название"
              placeholder="Напр. Отдел маркетинга"
              required
              {...form.getInputProps("name")}
            />
            <Button
              type="submit"
              loading={saveMutation.isPending}
              fullWidth
              color="teal"
              mt="md"
            >
              {editingId ? "Обновить название" : "Создать"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
