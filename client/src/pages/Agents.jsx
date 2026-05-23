const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TextHead from "../components/TextHead";
import {
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
  Center,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  IconPencil,
  IconTrash,
  IconSearch,
  IconBuildingStore,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function Agents() {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // 1. Загрузка контрагентов
  const {
    data: agents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/agents`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка загрузки справочника контрагентов");
      return res.json();
    },
  });

  // 2. Форма с базовой валидацией ИНН
  const form = useForm({
    initialValues: {
      name: "",
      inn: "",
      phone: "",
      email: "",
      address: "",
    },
    validate: {
      name: (v) => (v.length < 2 ? "Введите название организации" : null),
      inn: (v) =>
        v && !/^\d{10,12}$/.test(v)
          ? "ИНН должен содержать 10 или 12 цифр"
          : null,
      email: (v) => (v && !/^\S+@\S+$/.test(v) ? "Некорректный email" : null),
    },
  });

  // 3. Мутация (Создание / Редактирование)
  const mutation = useMutation({
    mutationFn: async (values) => {
      const url = editingId
        ? `${API_BASE_URL}/api/agents/${editingId}`
        : `${API_BASE_URL}/api/agents`;
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
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      handleClose();
    },
  });

  // 4. Мутация удаления
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`${API_BASE_URL}/api/agents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents"] }),
  });

  const handleEdit = (agent) => {
    setEditingId(agent.id);
    form.setValues({
      name: agent.name,
      inn: agent.inn || "",
      phone: agent.phone || "",
      email: agent.email || "",
      address: agent.address || "",
    });
    open();
  };

  const handleClose = () => {
    close();
    setEditingId(null);
    form.reset();
  };

  const filteredAgents = agents?.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.inn && a.inn.includes(search)),
  );

  if (isLoading)
    return (
      <Center mt="xl">
        <Loader size="xl" />
      </Center>
    );
  if (error)
    return (
      <Alert color="red" mt="md">
        {error.message}
      </Alert>
    );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <TextHead title="контрагенты" text="поставщики запчастей и услуг" />
        </div>
        <Button
          leftSection={<IconBuildingStore size={18} />}
          color="teal"
          onClick={open}
        >
          Добавить контрагента
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md" shadow="xs">
        <TextInput
          placeholder="Поиск по названию или ИНН..."
          mb="md"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Наименование</Table.Th>
              <Table.Th>ИНН</Table.Th>
              <Table.Th>Контакты</Table.Th>
              <Table.Th>Адрес</Table.Th>
              <Table.Th ta="right">Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredAgents.map((agent) => (
              <Table.Tr key={agent.id}>
                <Table.Td>
                  <Text fw={600} c="teal">
                    {agent.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ff="monospace">
                    {agent.inn || "—"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {agent.phone && (
                      <Tooltip label={agent.phone}>
                        <ActionIcon
                          component="a"
                          href={`tel:${agent.phone}`}
                          variant="light"
                          color="gray"
                          size="sm"
                        >
                          <IconPhone size={14} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {agent.email && (
                      <Tooltip label={agent.email}>
                        <ActionIcon
                          component="a"
                          href={`mailto:${agent.email}`}
                          variant="light"
                          color="gray"
                          size="sm"
                        >
                          <IconMail size={14} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" truncate maw={200}>
                    {agent.address || "—"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group justify="flex-end" gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(agent)}
                    >
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        if (
                          window.confirm(`Удалить контрагента ${agent.name}?`)
                        )
                          deleteMutation.mutate(agent.id);
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
        title={editingId ? "Редактировать контрагента" : "Новый контрагент"}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
          <Stack>
            <TextInput
              label="Наименование организации"
              placeholder="ООО 'АвтоЗапчасть'"
              required
              {...form.getInputProps("name")}
            />
            <TextInput
              label="ИНН"
              placeholder="10 или 12 цифр"
              {...form.getInputProps("inn")}
            />

            <Group grow>
              <TextInput
                label="Телефон"
                placeholder="+7 (___) ___-__-__"
                {...form.getInputProps("phone")}
              />
              <TextInput
                label="Email"
                placeholder="info@example.com"
                {...form.getInputProps("email")}
              />
            </Group>

            <TextInput
              label="Юридический адрес"
              placeholder="г. Якутск, ул. ..."
              {...form.getInputProps("address")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClose}>
                Отмена
              </Button>
              <Button type="submit" color="teal" loading={mutation.isPending}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
