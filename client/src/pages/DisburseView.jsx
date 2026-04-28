import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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
import { IconTrash, IconPlus, IconCheck, IconBox } from "@tabler/icons-react";

export default function DisburseView() {
  const queryClient = useQueryClient();

  const { data: parts } = useQuery({
    queryKey: ["parts"],
    queryFn: () =>
      fetch("http://localhost:3000/api/parts", { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });
  const { data: cars } = useQuery({
    queryKey: ["cars"],
    queryFn: () =>
      fetch("http://localhost:3000/api/cars", { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });
  const { data: batches } = useQuery({
    queryKey: ["batches"],
    queryFn: () =>
      fetch("http://localhost:3000/api/batches", {
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
    mutationFn: (values) =>
      fetch("http://localhost:3000/api/disburse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      }).then((res) =>
        res.ok
          ? res.json()
          : res.json().then((e) => {
              throw e;
            }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["batches", "transactions"]);
      form.reset();
      alert("Списание выполнено!");
    },
    onError: (err) => alert(err.message),
  });

  const totalSum = form.values.items.reduce((acc, item) => {
    const batch = batches?.find((b) => String(b.id) === item.batchId);
    return acc + (batch ? batch.price * item.quantity : 0);
  }, 0);

  return (
    <Stack maw={800} mx="auto">
      <Title order={2}>ВЫДАЧА ЗАПЧАСТЕЙ (ГРУППОВАЯ)</Title>

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
