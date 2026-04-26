import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import TableSort from "../components/TableSort.jsx";
import {
  Title,
  Text,
  Button,
  Group,
  Paper,
  Loader,
  Alert,
} from "@mantine/core";

export default function ReferenceDetail() {
  const { type } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reference", type],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/${type}`);
      if (!response.ok) throw new Error("Бэкенд не отвечает");
      return response.json();
    },
    // Вот здесь происходит магия трансформации!
    select: (data) =>
      data.map((part) => ({
        ...part,
        // Создаем новое поле с красивой датой
        formattedDate: dayjs(part.createdAt).format("DD.MM.YYYY HH:mm"),
      })),
  });

  if (isLoading)
    return (
      <Group justify="center" mt="xl">
        <Loader size="xl" />
      </Group>
    );

  if (error)
    return (
      <Alert title="Ошибка!" color="red" mt="md">
        {error.message}. Проверьте, запущен ли ваш Express сервер.
      </Alert>
    );

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title>{type === "parts" ? "Запчасти" : type.toUpperCase()}</Title>
          <Text c="dimmed">Управление данными справочника</Text>
        </div>
        <Button color="green">+ Добавить запись</Button>
      </Group>

      <Paper shadow="sm" radius="md" p="md" withBorder>
        <TableSort data={data} />
      </Paper>
    </div>
  );
}
