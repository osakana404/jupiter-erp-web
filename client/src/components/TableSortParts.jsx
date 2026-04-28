import { useState, useEffect } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  ActionIcon,
  Modal,
  Button,
  Stack,
  Select, // Добавил недостающий импорт
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconPencil,
} from "@tabler/icons-react";

// --- Вспомогательные функции ---
function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th style={{ padding: "0" }}>
      <UnstyledButton
        onClick={onSort}
        style={{ width: "100%", padding: "10px" }}
      >
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(item).some((key) => String(item[key]).toLowerCase().includes(query)),
  );
}

function sortData(data, payload) {
  const { sortBy } = payload;
  if (!sortBy) return filterData(data, payload.search);
  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed)
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }),
    payload.search,
  );
}

// --- Основной компонент ---
export default function TableSort({ data, categories }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      categoryId: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Минимум 2 символа" : null),
      categoryId: (value) => (!value ? "Выберите категорию" : null),
    },
  });

  // Синхронизация при изменении входящих данных
  useEffect(() => {
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search }),
    );
  }, [data, sortBy, reverseSortDirection, search]);

  // МУТАЦИЯ: Обновление запчасти
  const mutation = useMutation({
    mutationFn: async (updatedFields) => {
      const response = await fetch(
        `http://localhost:3000/api/parts/${selectedPart.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при сохранении");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      close();
    },
  });

  const handleEdit = (part) => {
    setSelectedPart(part);
    form.setValues({
      name: part.name,
      description: part.description || "",
      categoryId: String(part.categoryId), // Select работает только со строками
    });
    open();
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td fw={500}>{row.name}</Table.Td>
      <Table.Td>
        <Text size="sm" c="blue" fw={500}>
          {row.categoryName}
        </Text>
      </Table.Td>
      <Table.Td>{row.description || "-"}</Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={() => handleEdit(row)}
        >
          <IconPencil size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <ScrollArea>
        <TextInput
          placeholder="Поиск по всем полям..."
          mb="md"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === "id"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("id")}
              >
                ID
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                Наименование
              </Th>
              <Th
                sorted={sortBy === "categoryName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("categoryName")}
              >
                Категория
              </Th>
              <Th
                sorted={sortBy === "description"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("description")}
              >
                Описание
              </Th>
              <Table.Th style={{ width: rem(80) }}>Правка</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} ta="center">
                  Пусто
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Modal
        opened={opened}
        onClose={close}
        title="Редактирование запчасти"
        centered
      >
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack>
            <TextInput
              label="Наименование"
              required
              {...form.getInputProps("name")}
            />

            <Select
              label="Категория"
              placeholder="Выберите категорию"
              data={
                categories?.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                })) || []
              }
              {...form.getInputProps("categoryId")}
            />

            <TextInput
              label="Описание"
              {...form.getInputProps("description")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Отмена
              </Button>
              <Button type="submit" loading={mutation.isPending}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
