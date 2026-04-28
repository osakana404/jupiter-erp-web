import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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
import { IconPlus, IconTrash, IconFileInvoice } from "@tabler/icons-react";

export default function Supplies() {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  // Загружаем данные для селектов
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () =>
      fetch("http://localhost:3000/api/agents", {
        credentials: "include",
      }).then((res) => res.json()),
  });
  const { data: parts } = useQuery({
    queryKey: ["parts"],
    queryFn: () =>
      fetch("http://localhost:3000/api/parts", { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });
  const { data: supplies, isLoading } = useQuery({
    queryKey: ["supplies"],
    queryFn: () =>
      fetch("http://localhost:3000/api/supplies", {
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
    mutationFn: (values) =>
      fetch("http://localhost:3000/api/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["supplies", "batches"]);
      close();
      form.reset();
    },
  });

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
        precision={2}
        {...form.getInputProps(`items.${index}.price`)}
      />
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => form.removeListItem("items", index)}
        size="lg"
        mb={5}
      >
        <IconTrash size={18} />
      </ActionIcon>
    </Group>
  ));

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>ПРИХОДНЫЕ НАКЛАДНЫЕ</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={open}>
          Оформить приход
        </Button>
      </Group>

      <Paper withBorder p="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Дата</Table.Th>
              <Table.Th>Номер док.</Table.Th>
              <Table.Th>Контрагент</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th>Автор</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {supplies?.map((s) => (
              <Table.Tr key={s.id}>
                <Table.Td>{new Date(s.date).toLocaleDateString()}</Table.Td>
                <Table.Td fw={500}>{s.docNumber}</Table.Td>
                <Table.Td>{s.agent?.name}</Table.Td>
                <Table.Td>{s.totalSum?.toLocaleString()} ₽</Table.Td>
                <Table.Td size="xs">{s.user?.login}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title="Новое поступление"
        size="xl"
      >
        <form onSubmit={form.onSubmit((v) => mutation.mutate(v))}>
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

            <Group justify="flex-end" mt="xl">
              <Text fw={700} size="lg">
                Итого:{" "}
                {form.values.items
                  .reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
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
    </Stack>
  );
}
