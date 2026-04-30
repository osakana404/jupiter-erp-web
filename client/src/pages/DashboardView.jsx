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
  Modal,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconDatabase,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconCar,
  IconFileTypeXls,
  IconEye,
} from "@tabler/icons-react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

import { useState } from "react"; // Не забудь импортировать

import { useDisclosure } from "@mantine/hooks";
import TextHead from "../components/TextHead";

export default function DashboardView() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCar, setSelectedCar] = useState(null);
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

  // Функция для открытия деталей
  const handleShowDetails = (carId, carInfo) => {
    setSelectedCar({ id: carId, ...carInfo });
    open();
  };

  // Фильтруем детали только для выбранной машины
  const carDetails =
    stats?.details?.filter((d) => d.carId === selectedCar?.id) || [];
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
        <div>
          {" "}
          <TextHead title="Дашборд" text="показатели склада" />
        </div>

        <Button
          variant="light"
          color="green"
          leftSection={<IconFileTypeXls size={20} />}
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

        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Автомобиль</Table.Th>
              <Table.Th>Госномер</Table.Th>
              {/* Добавляем textAlign: 'right' для заголовков с числами */}
              <Table.Th style={{ textAlign: "right" }}>Сумма затрат</Table.Th>
              {/* Задаем фиксированную ширину для колонки с кнопкой, чтобы она не "гуляла" */}
              <Table.Th style={{ textAlign: "right", width: 80 }}>
                Детали
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {stats?.byCars?.map((c, i) => {
              const spentAmount = c.spent || c.dataValues?.spent || 0;
              const carId = c.carId;
              const carInfo = c.car;

              return (
                <Table.Tr key={i}>
                  <Table.Td>
                    <Text fw={500}>{carInfo?.model || "Неизвестно"}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="dot" color="blue" radius="sm">
                      {carInfo?.number || "—"}
                    </Badge>
                  </Table.Td>
                  <Table.Td align="right">
                    <Text fw={700} c="blue.9">
                      {parseFloat(spentAmount).toLocaleString()} ₽
                    </Text>
                  </Table.Td>
                  <Table.Td align="right">
                    <Tooltip label="Посмотреть запчасти" withArrow>
                      <ActionIcon
                        variant="light" // Subtle выглядит аккуратнее в таблицах
                        color="blue"
                        onClick={() => handleShowDetails(carId, carInfo)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              );
            })}

            {(!stats?.byCars || stats.byCars.length === 0) && (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">
                  <Text c="dimmed" py="xl">
                    Данные о расходах отсутствуют
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
      {/* --- МОДАЛКА С ДЕТАЛИЗАЦИЕЙ --- */}
      <Modal
        opened={opened}
        onClose={close}
        title={`История расходов: ${selectedCar?.model} (${selectedCar?.number})`}
        size="lg"
      >
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Дата</Table.Th>
              <Table.Th>Запчасть</Table.Th>
              <Table.Th>Поставка</Table.Th>
              <Table.Th align="right">Сумма</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {carDetails.map((det) => (
              <Table.Tr key={det.id}>
                <Table.Td>{dayjs(det.date).format("DD.MM.YY")}</Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {det.part?.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {det.quantity} шт. x {det.price} ₽
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs">Накл: {det.supplies?.docNumber || "—"}</Text>
                  <Text size="xs" c="dimmed">
                    {det.supplies?.agent?.name}
                  </Text>
                </Table.Td>
                <Table.Td align="right" fw={600}>
                  {det.sum?.toLocaleString()} ₽
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {carDetails.length === 0 && (
          <Text align="center" py="md" c="dimmed">
            Нет данных о запчастях
          </Text>
        )}
      </Modal>
    </Stack>
  );
}
