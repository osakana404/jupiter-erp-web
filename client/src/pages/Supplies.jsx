const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useState } from "react"; // Добавлен useState
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileInput,
  SimpleGrid,
  Image,
  Title,
  Paper,
  Table,
  Button,
  Group,
  Modal,
  TextInput,
  Select,
  NumberInput,
  ActionIcon,
  Stack,
  Divider,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconTrash,
  IconEye,
  IconFileDescription,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import {
  Document,
  Packer,
  Paragraph,
  Table as DocxTable, // Переименовано
  TableCell as DocxTableCell,
  TableRow as DocxTableRow, // Переименовано
  WidthType,
  TextRun,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import { IconFileTypeDocx } from "@tabler/icons-react"; // Добавим иконку
import TextHead from "../components/TextHead";

export default function Supplies() {
  const [files, setFiles] = useState([]); // Стейт для фото
  const [opened, { open, close }] = useDisclosure(false);
  // Состояние для модалки просмотра
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [selectedSupply, setSelectedSupply] = useState(null);

  const queryClient = useQueryClient();

  // ... (твои запросы agents, parts, supplies без изменений)
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/agents`, {
        credentials: "include",
      }).then((res) => res.json()),
  });
  const { data: parts } = useQuery({
    queryKey: ["parts"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/parts`, { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });
  const { data: supplies } = useQuery({
    queryKey: ["supplies"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/supplies`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const form = useForm({
    initialValues: {
      agentId: "",
      docNumber: "",
      items: [{ partId: "", quantity: 1, price: 0 }],
    },
  });

  const mutation = useMutation({
    mutationFn: (values) => {
      const formData = new FormData();

      // 1. Добавляем файлы (ключ 'photos' должен совпадать с тем, что в multer на бэкенде)
      files.forEach((file) => {
        formData.append("photos", file);
      });

      // 2. Добавляем остальные данные как строку в ключе 'data'
      formData.append("data", JSON.stringify(values));

      return fetch(`${API_BASE_URL}/api/supplies`, {
        method: "POST",
        body: formData, // headers НЕ НУЖНЫ, браузер сам поставит multipart/form-data
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["supplies", "batches"]);
      close();
      form.reset();
      setFiles([]); // Очищаем файлы
    },
  });

  // Функция открытия просмотра
  const handleViewDetails = (supply) => {
    setSelectedSupply(supply);
    openView();
  };

  // Вставь это прямо перед return (после всех useQuery и функций)
  const rows = form.values.items.map((item, index) => (
    <Group key={index} grow align="flex-end" mb="xs">
      <Select
        label="Запчасть"
        placeholder="Выберите..."
        data={parts?.map((p) => ({ value: String(p.id), label: p.name })) || []}
        {...form.getInputProps(`items.${index}.partId`)}
        searchable
      />
      <NumberInput
        label="Кол-во"
        min={1}
        {...form.getInputProps(`items.${index}.quantity`)}
      />
      <NumberInput
        label="Цена за шт."
        min={0}
        {...form.getInputProps(`items.${index}.price`)}
      />
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => form.removeListItem("items", index)}
        size="lg"
        mb={5}
        disabled={form.values.items.length === 1} // Не даем удалить последнюю строку
      >
        <IconTrash size={18} />
      </ActionIcon>
    </Group>
  ));

  const generateWord = (supply) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `ПРИХОДНАЯ НАКЛАДНАЯ №${supply.docNumber}`,
                  bold: true,
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Дата: ${dayjs(supply.date).format("DD.MM.YYYY")}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Поставщик: ${supply.agent?.name}`,
                  size: 24,
                }),
              ],
              spacing: { after: 400 },
            }),

            // ИСПОЛЬЗУЕМ DocxTable
            new DocxTable({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new DocxTableRow({
                  children: [
                    new DocxTableCell({
                      children: [new Paragraph({ text: "№", bold: true })],
                    }),
                    new DocxTableCell({
                      children: [
                        new Paragraph({
                          text: "Наименование запчасти",
                          bold: true,
                        }),
                      ],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph({ text: "Кол-во", bold: true })],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph({ text: "Цена", bold: true })],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph({ text: "Сумма", bold: true })],
                    }),
                  ],
                }),
                ...supply.batches.map(
                  (batch, index) =>
                    new DocxTableRow({
                      children: [
                        new DocxTableCell({
                          children: [new Paragraph(String(index + 1))],
                        }),
                        new DocxTableCell({
                          children: [new Paragraph(batch.part?.name || "—")],
                        }),
                        new DocxTableCell({
                          children: [
                            new Paragraph(`${batch.initialQuantity} шт.`),
                          ],
                        }),
                        new DocxTableCell({
                          children: [new Paragraph(`${batch.price} ₽`)],
                        }),
                        new DocxTableCell({
                          children: [
                            new Paragraph(
                              `${(batch.initialQuantity * batch.price).toLocaleString()} ₽`,
                            ),
                          ],
                        }),
                      ],
                    }),
                ),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `ИТОГО: ${supply.totalSum?.toLocaleString()} ₽`,
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 400, after: 800 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Принял (подпись): ____________________ / ____________________",
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Накладная_${supply.docNumber}.docx`);
    });
  };

  return (
    <Stack>
      <Group justify="space-between">
        <div>
          {" "}
          <TextHead title="НАКЛАДНЫе" text="приходные" />
        </div>

        <Button leftSection={<IconPlus size={18} />} onClick={open}>
          Оформить приход
        </Button>
      </Group>

      <Paper withBorder p="md">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Дата</Table.Th>
              <Table.Th>Номер док.</Table.Th>
              <Table.Th>Контрагент</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th>Автор</Table.Th>
              <Table.Th>Действие</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {supplies?.map((s) => (
              <Table.Tr key={s.id}>
                <Table.Td>{dayjs(s.date).format("DD.MM.YYYY")}</Table.Td>
                <Table.Td fw={500}>{s.docNumber}</Table.Td>
                <Table.Td>{s.agent?.name}</Table.Td>
                <Table.Td fw={600}>{s.totalSum?.toLocaleString()} ₽</Table.Td>
                <Table.Td size="xs">{s.user?.login}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleViewDetails(s)}
                      title="Просмотреть детали"
                    >
                      <IconEye size={18} />
                    </ActionIcon>

                    <ActionIcon
                      variant="light"
                      color="gray"
                      onClick={() => generateWord(s)}
                      title="Скачать в Word"
                    >
                      <IconFileTypeDocx size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* --- МОДАЛКА СОЗДАНИЯ (Твой код без изменений) --- */}
      <Modal
        opened={opened}
        onClose={close}
        title="Новое поступление"
        size="xl"
      >
        <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
          {/* --- СЕКЦИЯ ЗАГРУЗКИ ФОТО --- */}
          <Divider
            label="Фотографии документов (макс. 10)"
            labelPosition="center"
          />
          <Stack gap="xs">
            <FileInput
              label="Прикрепить фото"
              description="Макс. 10 фото, до 5 Мб каждое"
              placeholder="Выберите изображения"
              accept="image/png,image/jpeg"
              multiple
              value={files}
              onChange={(newFiles) => {
                // Mantine при clearable=true при нажатии на крестик может вернуть пустой массив или null
                if (!newFiles) {
                  setFiles([]);
                  return;
                }
                setFiles((prev) => {
                  const combined = [...prev, ...newFiles];
                  return combined.slice(0, 10);
                });
              }}
              leftSection={<IconPhoto size={18} />}
              clearable // Этого достаточно, onClear не нужен
            />

            {/* Превью выбранных фото (по желанию) */}
            {files.length > 0 && (
              <SimpleGrid cols={5} spacing="xs">
                {files.map((file, index) => {
                  const imageUrl = URL.createObjectURL(file);
                  return (
                    <Paper key={index} withBorder p={2} pos="relative">
                      <Image
                        src={imageUrl}
                        radius="sm"
                        h={60}
                        fallbackSrc="https://placehold.co/60x60?text=Error"
                      />
                      <ActionIcon
                        variant="filled"
                        color="red"
                        size="xs"
                        pos="absolute"
                        top={-5}
                        right={-5}
                        onClick={() =>
                          setFiles(files.filter((_, i) => i !== index))
                        }
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    </Paper>
                  );
                })}
              </SimpleGrid>
            )}
          </Stack>
          <Divider mt="xs" />
          <Stack>
            <Group grow>
              <Select
                label="Контрагент"
                placeholder="Кто привез?"
                required
                data={
                  agents?.map((a) => ({
                    value: String(a.id),
                    label: a.name,
                  })) || []
                }
                {...form.getInputProps("agentId")}
              />
              <TextInput
                label="Номер накладной"
                placeholder="№..."
                {...form.getInputProps("docNumber")}
              />
            </Group>

            <Divider label="Список товаров" labelPosition="center" />

            {rows}

            <Button
              variant="light"
              leftSection={<IconPlus size={16} />}
              onClick={() =>
                form.insertListItem("items", {
                  partId: "",
                  quantity: 1,
                  price: 0,
                })
              }
            >
              Добавить позицию
            </Button>

            {/* 2. ИСПРАВЛЕННЫЙ РАСЧЕТ ИТОГО (в конце формы) */}
            <Group justify="flex-end" mt="xl">
              <Text fw={700} size="lg">
                Итого:{" "}
                {form.values.items
                  .reduce((acc, curr) => {
                    // Добавляем принудительное преобразование в число, чтобы не было 0
                    const q = Number(curr.quantity) || 0;
                    const p = Number(curr.price) || 0;
                    return acc + q * p;
                  }, 0)
                  .toLocaleString()}{" "}
                ₽
              </Text>
              <Button type="submit" loading={mutation.isPending}>
                Сохранить накладную
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* --- МОДАЛКА ПРОСМОТРА ДЕТАЛЕЙ --- */}
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title={
          <Group>
            <IconFileDescription color="gray" />{" "}
            <Text fw={700}>Детали накладной №{selectedSupply?.docNumber}</Text>
          </Group>
        }
        size="lg"
      >
        {selectedSupply && (
          <Stack>
            <Group
              justify="space-between"
              bg="gray.0"
              p="xs"
              style={{ borderRadius: "8px" }}
            >
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Контрагент
                </Text>
                <Text fw={600}>{selectedSupply.agent?.name}</Text>
              </Stack>
              <Stack gap={0} align="flex-end">
                <Text size="xs" c="dimmed">
                  Дата прихода
                </Text>
                <Text fw={600}>
                  {dayjs(selectedSupply.date).format("DD.MM.YYYY HH:mm")}
                </Text>
              </Stack>
            </Group>

            <Table withTableBorder withColumnBorders>
              <Table.Thead bg="gray.5">
                <Table.Tr>
                  <Table.Th c="white">Запчасть</Table.Th>
                  <Table.Th c="white">Кол-во</Table.Th>
                  <Table.Th c="white">Цена</Table.Th>
                  <Table.Th c="white">Сумма</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {/* ВАЖНО: Здесь мы мапим Batches, так как каждая накладная при создании 
                  создает записи в таблице Batches (партии)
                */}
                {selectedSupply.batches?.map((batch) => (
                  <Table.Tr key={batch.id}>
                    <Table.Td>{batch.part?.name}</Table.Td>
                    <Table.Td>{batch.initialQuantity} шт.</Table.Td>
                    <Table.Td>{batch.price?.toLocaleString()} ₽</Table.Td>
                    <Table.Td fw={600}>
                      {(batch.initialQuantity * batch.price).toLocaleString()} ₽
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {/* --- В МОДАЛКЕ ПРОСМОТРА (selectedSupply) --- */}
            {selectedSupply?.photos && selectedSupply.photos.length > 0 && (
              <>
                <Text size="sm" fw={600} mt="md">
                  Прикрепленные фото:
                </Text>
                <SimpleGrid cols={3} spacing="xs">
                  {selectedSupply.photos.map((path, idx) => (
                    <Paper
                      key={idx}
                      withBorder
                      radius="md"
                      component="a"
                      href={`${API_BASE_URL}/${path}`} // Путь к фото на сервере
                      target="_blank"
                      style={{ overflow: "hidden", cursor: "pointer" }}
                    >
                      <Image
                        src={`${API_BASE_URL}/${path}`}
                        h={100}
                        fit="cover"
                      />
                    </Paper>
                  ))}
                </SimpleGrid>
              </>
            )}

            <Group justify="flex-end" mt="md">
              <Stack gap={0} align="flex-end">
                <Text size="sm" c="dimmed">
                  Общая сумма накладной:
                </Text>
                <Title order={3} c="blue">
                  {selectedSupply.totalSum?.toLocaleString()} ₽
                </Title>
              </Stack>
            </Group>

            <Button
              fullWidth
              variant="light"
              color="gray"
              onClick={closeView}
              mt="md"
            >
              Закрыть
            </Button>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
