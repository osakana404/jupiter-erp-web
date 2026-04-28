import { useQuery } from "@tanstack/react-query";
import {
  SimpleGrid,
  Paper,
  Text,
  Group,
  Title,
  Table,
  Stack,
  Button,
  ThemeIcon,
  Badge,
} from "@mantine/core";
import {
  IconDatabase,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconCar,
  IconFileSpreadsheet,
} from "@tabler/icons-react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

export default function DashboardView() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () =>
      fetch("http://localhost:3000/api/stats", { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });

  if (isLoading) return <Text>Загрузка аналитики...</Text>;

  // Безопасный поиск объектов
  const inc = stats?.transactions?.find((t) => t.type === "increment");
  const dec = stats?.transactions?.find((t) => t.type === "decrement");

  // Функция для безопасного извлечения суммы
  // Проверяем и .dataValues.totalSum, и просто .totalSum (зависит от версии Sequelize/сборки)
  const getSum = (obj) => {
    if (!obj) return 0;
    return obj.totalSum || obj.dataValues?.totalSum || 0;
  };

  const getCount = (obj) => {
    if (!obj) return 0;
    return obj.count || obj.dataValues?.count || 0;
  };

  const exportGeneralReport = () => {
    const wb = XLSX.utils.book_new();

    // 1. ПОДГОТОВКА ДАННЫХ ДЛЯ ОБЩЕЙ СВОДКИ
    const summaryData = [
      {
        Показатель: "Ценность склада (остатки)",
        Значение: `${stats?.warehouseValue || 0} ₽`,
      },
      { Показатель: "Всего приходов (сумма)", Значение: `${getSum(inc)} ₽` },
      { Показатель: "Всего списано (сумма)", Значение: `${getSum(dec)} ₽` },
      { Показатель: "Количество приходов", Значение: getCount(inc) },
      { Показатель: "Количество списаний", Значение: getCount(dec) },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Общая сводка");

    // 2. ПОДГОТОВКА ДАННЫХ ПО МАШИНАМ
    const carData =
      stats?.byCars?.map((c) => ({
        Автомобиль: c.car?.model || "Неизвестно",
        Госномер: c.car?.number || "—",
        "Потрачено (₽)": parseFloat(c.spent || c.dataValues?.spent || 0),
      })) || [];

    const wsCars = XLSX.utils.json_to_sheet(carData);
    XLSX.utils.book_append_sheet(wb, wsCars, "Расходы по авто");

    // 3. ГЕНЕРАЦИЯ ФАЙЛА
    XLSX.writeFile(
      wb,
      `Аналитика_Меркурий_${dayjs().format("YYYY-MM-DD")}.xlsx`,
    );
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>ПАНЕЛЬ УПРАВЛЕНИЯ (DASHBOARD)</Title>
        <Button
          variant="light"
          color="green"
          leftSection={<IconFileSpreadsheet size={20} />}
          onClick={exportGeneralReport}
        >
          Скачать полный отчет
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {/* Стоимость склада */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <ThemeIcon size="xl" radius="md" color="blue" variant="light">
              <IconDatabase size={30} />
            </ThemeIcon>
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                Ценность склада
              </Text>
              <Text fw={700} size="xl">
                {(stats?.warehouseValue || 0).toLocaleString()} ₽
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Приходы */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <ThemeIcon size="xl" radius="md" color="green" variant="light">
              <IconArrowDownLeft size={30} />
            </ThemeIcon>
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                Всего приходов
              </Text>
              <Text fw={700} size="xl">
                {getSum(inc).toLocaleString()} ₽
              </Text>
              <Text size="xs" c="dimmed">
                {getCount(inc)} операций
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Списания */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <ThemeIcon size="xl" radius="md" color="red" variant="light">
              <IconArrowUpRight size={30} />
            </ThemeIcon>
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                Всего списано
              </Text>
              <Text fw={700} size="xl">
                {getSum(dec).toLocaleString()} ₽
              </Text>
              <Text size="xs" c="dimmed">
                {getCount(dec)} операций
              </Text>
            </div>
          </Group>
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="md">
          <Group gap="xs">
            <IconCar size={20} /> Расходы по автомобилям
          </Group>
        </Title>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Автомобиль</Table.Th>
              <Table.Th>Госномер</Table.Th>
              <Table.Th align="right">Сумма затрат</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {stats?.byCars?.map((c, i) => {
              const spentAmount = c.spent || c.dataValues?.spent || 0;
              return (
                <Table.Tr key={i}>
                  <Table.Td>{c.car?.model || "Неизвестно"}</Table.Td>
                  <Table.Td>
                    <Badge variant="outline">{c.car?.number || "—"}</Badge>
                  </Table.Td>
                  <Table.Td align="right">
                    <Text fw={700}>
                      {parseFloat(spentAmount).toLocaleString()} ₽
                    </Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
            {stats?.byCars?.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={3} align="center">
                  Нет данных по списаниям
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
