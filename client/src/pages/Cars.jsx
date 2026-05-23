const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Badge,
  Select,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  IconPencil,
  IconTrash,
  IconSearch,
  IconCar,
} from "@tabler/icons-react";
import { useState } from "react";
import TextHead from "../components/TextHead";

export default function Cars() {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // 1. Загрузка списка машин
  const {
    data: cars,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/cars`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка загрузки автопарка");
      return res.json();
    },
  });

  // 2. Форма
  const form = useForm({
    initialValues: {
      number: "",
      model: "",
      description: "",
      status: "active",
    },
    validate: {
      number: (v) => (v.length < 3 ? "Неверный гос.номер" : null),
      model: (v) => (v.length < 2 ? "Введите модель" : null),
    },
  });

  // 3. Мутация (Создание / Обновление)
  const mutation = useMutation({
    mutationFn: async (values) => {
      const url = editingId
        ? `${API_BASE_URL}/api/cars/${editingId}`
        : `${API_BASE_URL}/api/cars`;
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
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      handleClose();
    },
  });

  // 4. Мутация удаления
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] }),
  });

  const handleEdit = (car) => {
    setEditingId(car.id);
    form.setValues({
      number: car.number,
      model: car.model,
      description: car.description || "",
      status: car.status,
    });
    open();
  };

  const handleClose = () => {
    close();
    setEditingId(null);
    form.reset();
  };

  // Фильтрация для поиска
  const filteredCars = cars?.filter(
    (car) =>
      car.number.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase()),
  );

  // Функция для отрисовки красивого статуса
  const getStatusBadge = (status) => {
    const map = {
      active: { label: "В строю", color: "green" },
      repair: { label: "Ремонт", color: "orange" },
      disposed: { label: "Списан", color: "red" },
    };
    const current = map[status] || { label: status, color: "gray" };
    return (
      <Badge color={current.color} variant="light">
        {current.label}
      </Badge>
    );
  };

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
          <TextHead title="АВТОПАРК" text="Учет и состояние спецтранспорта" />
        </div>
        <Button leftSection={<IconCar size={18} />} color="blue" onClick={open}>
          Добавить машину
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md" shadow="xs">
        <TextInput
          placeholder="Поиск по номеру или модели..."
          mb="md"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Гос. номер</Table.Th>
              <Table.Th>Модель</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Описание</Table.Th>
              <Table.Th ta="right">Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredCars.map((car) => (
              <Table.Tr key={car.id}>
                <Table.Td>
                  <Text fw={700}>{car.number}</Text>
                </Table.Td>
                <Table.Td>{car.model}</Table.Td>
                <Table.Td>{getStatusBadge(car.status)}</Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed" truncate>
                    {car.description || "-"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group justify="flex-end" gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(car)}
                    >
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        if (window.confirm(`Удалить ${car.number}?`))
                          deleteMutation.mutate(car.id);
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

      {/* Модалка создания/редактирования */}
      <Modal
        opened={opened}
        onClose={handleClose}
        title={
          editingId ? "Редактировать данные авто" : "Регистрация нового авто"
        }
        centered
      >
        <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
          <Stack>
            <TextInput
              label="Гос. номер"
              placeholder="Напр: А001АА 14"
              required
              {...form.getInputProps("number")}
            />
            <TextInput
              label="Марка и модель"
              placeholder="Напр: ГАЗель NEXT"
              required
              {...form.getInputProps("model")}
            />
            <Select
              label="Текущий статус"
              data={[
                { value: "active", label: "В строю" },
                { value: "repair", label: "На ремонте" },
                { value: "disposed", label: "Списан" },
              ]}
              {...form.getInputProps("status")}
            />
            <TextInput
              label="Примечание"
              placeholder="Доп. инфо (VIN, год и т.д.)"
              {...form.getInputProps("description")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClose}>
                Отмена
              </Button>
              <Button type="submit" loading={mutation.isPending}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
