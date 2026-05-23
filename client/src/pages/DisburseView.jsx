const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileInput,
  Image,
  SimpleGrid,
  Paper,
  Title,
  Select,
  NumberInput,
  Button,
  Stack,
  Group,
  Text,
  ActionIcon,
  Divider,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconTrash,
  IconPlus,
  IconCheck,
  IconBox,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import TextHead from "../components/TextHead";

export default function DisburseView() {
  const [files, setFiles] = useState([]);
  const queryClient = useQueryClient();

  const { data: parts } = useQuery({
    queryKey: ["parts"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/parts`, { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });
  const { data: cars } = useQuery({
    queryKey: ["cars"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/cars`, { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });
  const { data: batches } = useQuery({
    queryKey: ["batches"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/batches`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const form = useForm({
    initialValues: {
      carId: "",
      comment: "",
      items: [{ partId: "", batchId: "", quantity: 1 }], // Массив запчастей
    },
  });

  const mutation = useMutation({
    mutationFn: (values) => {
      const formData = new FormData();

      // Добавляем фото
      files.forEach((file) => {
        formData.append("photos", file);
      });

      // Упаковываем данные формы в строку
      formData.append("data", JSON.stringify(values));

      return fetch(`${API_BASE_URL}/api/disburse`, {
        method: "POST",
        body: formData, // Без заголовка Content-Type!
        credentials: "include",
      }).then((res) =>
        res.ok
          ? res.json()
          : res.json().then((e) => {
              throw e;
            }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["batches", "transactions"]);
      form.reset();
      setFiles([]); // Очистка файлов
      alert("Списание выполнено!");
    },
    onError: (err) => alert(err.message),
  });

  const totalSum = form.values.items.reduce((acc, item) => {
    const batch = batches?.find((b) => String(b.id) === item.batchId);
    const q = Number(item.quantity) || 0;
    const p = Number(batch?.price) || 0;
    return acc + q * p;
  }, 0);

  return (
    <Stack maw={800} mx="auto">
      <div>
        <TextHead title="выдача запчастпей" text="групповая" />
      </div>

      <Paper withBorder p="xl" radius="md">
        <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
          <Stack>
            <Select
              label="Выберите автомобиль"
              placeholder="На какой автомобиль выдаем?"
              data={
                cars?.map((c) => ({
                  value: String(c.id),
                  label: `${c.model} (${c.number})`,
                })) || []
              }
              searchable
              required
              {...form.getInputProps("carId")}
            />

            <Divider label="Список запчастей" labelPosition="center" />

            {form.values.items.map((item, index) => {
              // Фильтруем партии для конкретной выбранной запчасти в этой строке
              const availableBatches =
                batches?.filter(
                  (b) =>
                    String(b.partId) === item.partId && b.currentQuantity > 0,
                ) || [];

              const selectedBatch = availableBatches.find(
                (b) => String(b.id) === item.batchId,
              );

              return (
                <Group key={index} align="flex-end">
                  <Select
                    label="Запчасть"
                    placeholder="Поиск..."
                    style={{ flex: 2 }}
                    data={
                      parts?.map((p) => ({
                        value: String(p.id),
                        label: p.name,
                      })) || []
                    }
                    searchable
                    {...form.getInputProps(`items.${index}.partId`)}
                    onChange={(val) => {
                      form.setFieldValue(`items.${index}.partId`, val);
                      form.setFieldValue(`items.${index}.batchId`, ""); // Сброс партии
                    }}
                  />

                  <Select
                    label="Партия (Накладная)"
                    placeholder="Откуда списываем?"
                    style={{ flex: 3 }}
                    disabled={!item.partId}
                    data={availableBatches.map((b) => ({
                      value: String(b.id),
                      label: `№${b.supplie?.docNumber} (Остаток: ${b.currentQuantity} шт.) - ${b.price}₽`,
                    }))}
                    {...form.getInputProps(`items.${index}.batchId`)}
                  />

                  <NumberInput
                    label="Кол-во"
                    style={{ width: 80 }}
                    min={1}
                    max={selectedBatch?.currentQuantity || 1}
                    {...form.getInputProps(`items.${index}.quantity`)}
                  />

                  <ActionIcon
                    color="red"
                    variant="light"
                    size="lg"
                    onClick={() => form.removeListItem("items", index)}
                    disabled={form.values.items.length === 1}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              );
            })}

            <Button
              variant="outline"
              leftSection={<IconPlus size={16} />}
              onClick={() =>
                form.insertListItem("items", {
                  partId: "",
                  batchId: "",
                  quantity: 1,
                })
              }
            >
              Добавить запчасть в список
            </Button>

            {/* --- СЕКЦИЯ ФОТО (например, фото замененной детали или акта) --- */}
            <Divider
              label="Фотографии (подтверждение списания)"
              labelPosition="center"
            />
            <Stack gap="xs">
              <FileInput
                label="Прикрепить фото"
                placeholder="Выберите фото..."
                accept="image/png,image/jpeg"
                multiple
                value={files}
                onChange={(newFiles) => {
                  setFiles((prev) => {
                    const combined = [...prev, ...(newFiles || [])];
                    return combined.slice(0, 10);
                  });
                }}
                leftSection={<IconPhoto size={18} />}
                clearable
              />

              {files.length > 0 && (
                <SimpleGrid cols={5} spacing="xs">
                  {files.map((file, index) => {
                    const imageUrl = URL.createObjectURL(file);
                    return (
                      <Paper key={index} withBorder p={2} pos="relative">
                        <Image src={imageUrl} radius="sm" h={60} fit="cover" />
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

            <Textarea
              label="Общий комментарий"
              placeholder="Причина ремонта..."
              {...form.getInputProps("comment")}
            />

            <Group justify="space-between" mt="md">
              <Text fw={700} size="xl">
                Итого: {totalSum.toLocaleString()} ₽
              </Text>
            </Group>
            <Button
              type="submit"
              size="lg"
              fullWidth
              color="blue"
              leftSection={<IconCheck size={20} />}
              loading={mutation.isPending}
            >
              Подтвердить выдачу всех позиций
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
