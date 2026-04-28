import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  Paper,
  Title,
  Badge,
  Text,
  Group,
  Stack,
  Button,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconFileSpreadsheet,
  IconSearch,
  IconFilter,
  IconUser, // Иконка пользователя
} from "@tabler/icons-react";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

export default function TransactionsView() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);

  const { data: transactions, refetch } = useQuery({
    queryKey: ["transactions", dateRange],
    queryFn: () => {
      const params = new URLSearchParams();
      if (dateRange[0])
        params.append(
          "startDate",
          dayjs(dateRange[0]).startOf("day").toISOString(),
        );
      if (dateRange[1])
        params.append(
          "endDate",
          dayjs(dateRange[1]).endOf("day").toISOString(),
        );

      return fetch(`http://localhost:3000/api/transactions?${params}`, {
        credentials: "include",
      }).then((res) => res.json());
    },
  });

  const exportToExcel = () => {
    const dataForExport = filtered.map((t) => ({
      Дата: dayjs(t.date).format("DD.MM.YYYY HH:mm"),
      Тип: t.type === "increment" ? "Приход" : "Выдача",
      Накладная: t.supplies?.docNumber || "—",
      Запчасть: t.part?.name,
      "Объект/Авто":
        t.type === "increment"
          ? t.supplies?.agent?.name
          : `${t.car?.model} (${t.car?.number})`,
      Количество: t.quantity,
      "Цена за ед.": t.price,
      Сумма: t.sum,
      Автор: t.user?.login || "Система", // Логин автора в Excel
      Комментарий: t.comment || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Транзакции");
    XLSX.writeFile(
      workbook,
      `Отчет_Меркурий_${dayjs().format("YYYY-MM-DD")}.xlsx`,
    );
  };

  const filtered = transactions?.filter(
    (t) =>
      t.part?.name.toLowerCase().includes(search.toLowerCase()) ||
      t.car?.number?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.login?.toLowerCase().includes(search.toLowerCase()), // Теперь поиск работает и по автору
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>ИСТОРИЯ ОПЕРАЦИЙ</Title>
        <Button
          color="green"
          leftSection={<IconFileSpreadsheet size={20} />}
          onClick={exportToExcel}
          disabled={!transactions?.length}
        >
          Экспорт в Excel
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Group align="flex-end" mb="md">
          <TextInput
            label="Поиск"
            placeholder="Запчасть, авто или автор..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />

          <DateInput
            locale="ru"
            label="С даты"
            value={dateRange[0]}
            onChange={(val) => setDateRange([val, dateRange[1]])}
            clearable
          />

          <DateInput
            locale="ru"
            label="По дату"
            value={dateRange[1]}
            onChange={(val) => setDateRange([dateRange[0], val])}
            clearable
          />

          <Button
            variant="light"
            onClick={() => refetch()}
            leftSection={<IconFilter size={16} />}
          >
            Применить
          </Button>
        </Group>

        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Дата</Table.Th>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Документ</Table.Th>
              <Table.Th>Запчасть</Table.Th>
              <Table.Th>Объект</Table.Th>
              <Table.Th>Кол-во</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th>Автор</Table.Th> {/* НОВАЯ КОЛОНКА */}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered?.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>{dayjs(t.date).format("DD.MM.YY HH:mm")}</Table.Td>
                <Table.Td>
                  <Badge
                    color={t.type === "increment" ? "green" : "red"}
                    variant="light"
                  >
                    {t.type === "increment" ? "Приход" : "Выдача"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {t.supplies?.docNumber ? `№${t.supplies.docNumber}` : "—"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {t.part?.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs">
                    {t.type === "increment"
                      ? t.supplies?.agent?.name
                      : `${t.car?.model} (${t.car?.number})`}
                  </Text>
                </Table.Td>
                <Table.Td>{t.quantity} шт.</Table.Td>
                <Table.Td fw={500}>{t.sum?.toLocaleString()} ₽</Table.Td>

                {/* ВЫВОД АВТОРА */}
                <Table.Td>
                  <Group gap={4}>
                    <IconUser size={14} color="gray" />
                    <Badge color="gray" variant="outline" size="sm">
                      {t.user?.login || "—"}
                    </Badge>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
