const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Button,
  Modal,
  TextInput,
  Select,
  Paper,
  Stack,
  Loader,
  Badge,
  SimpleGrid,
  Box,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconTrash,
  IconEdit,
  IconPlus,
  IconPhone,
  IconDeviceMobile,
  IconBuildingCommunity,
  IconSearch,
  IconFileDownload,
} from "@tabler/icons-react";
import TextHead from "../components/TextHead";

// Библиотеки для DOCX
import {
  Document,
  Packer,
  Paragraph,
  Table as DocTable,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

export default function TelView() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // --- ЗАГРУЗКА ДАННЫХ ---
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/tels`, { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/departments`, { credentials: "include" }).then(
        (res) => res.json(),
      ),
  });

  // --- ЛОГИКА ФИЛЬТРАЦИИ И ГРУППИРОВКИ ---
  const groupedContacts = useMemo(() => {
    if (!contacts) return {};

    // 1. Фильтруем по поиску
    const filtered = contacts.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );

    // 2. Группируем по отделу
    return filtered.reduce((acc, contact) => {
      const deptName = contact.department?.name || "Вне отдела";
      if (!acc[deptName]) acc[deptName] = [];
      acc[deptName].push(contact);
      return acc;
    }, {});
  }, [contacts, search]);

  // --- ЭКСПОРТ В DOCX ---
  const exportToDocx = () => {
    const rows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("ФИО")] }),
          new TableCell({ children: [new Paragraph("Должность")] }),
          new TableCell({ children: [new Paragraph("Отдел")] }),
          new TableCell({ children: [new Paragraph("Внутр.")] }),
          new TableCell({ children: [new Paragraph("Город.")] }),
          new TableCell({ children: [new Paragraph("Моб.")] }),
        ],
      }),
    ];

    Object.entries(groupedContacts).forEach(([dept, people]) => {
      people.forEach((p) => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(p.name)] }),
              new TableCell({ children: [new Paragraph(p.position || "-")] }),
              new TableCell({ children: [new Paragraph(dept)] }),
              new TableCell({
                children: [new Paragraph(p.internal_tel || "-")],
              }),
              new TableCell({ children: [new Paragraph(p.city_tel || "-")] }),
              new TableCell({ children: [new Paragraph(p.mobile_tel || "-")] }),
            ],
          }),
        );
      });
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Телефонный справочник",
              heading: "Heading1",
            }),
            new DocTable({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows,
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => saveAs(blob, "contacts.docx"));
  };

  // --- ФОРМА И МУТАЦИИ (без изменений) ---
  const form = useForm({
    initialValues: {
      name: "",
      position: "",
      internal_tel: "",
      city_tel: "",
      mobile_tel: "",
      department_id: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Слишком короткое имя" : null),
      department_id: (value) => (!value ? "Выберите отдел" : null),
    },
  });

  const saveMutation = useMutation({
    mutationFn: (values) => {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE_URL}/api/tels/${editingId}`
        : `${API_BASE_URL}/api/tels`;
      return fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`${API_BASE_URL}/api/tels/${id}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => queryClient.invalidateQueries(["contacts"]),
  });

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    form.setValues({
      name: contact.name,
      position: contact.position || "",
      internal_tel: contact.internal_tel || "",
      city_tel: contact.city_tel || "",
      mobile_tel: contact.mobile_tel || "",
      department_id: String(contact.department_id),
    });
    open();
  };

  const handleClose = () => {
    setEditingId(null);
    form.reset();
    close();
  };

  if (contactsLoading) {
    return (
      <Center style={{ height: "70vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <TextHead title="Телефонный справочник" text="Контакты сотрудников" />
        </div>

        <Group>
          <Button
            variant="light"
            color="gray"
            leftSection={<IconFileDownload size={18} />}
            onClick={exportToDocx}
          >
            Скачать .docx
          </Button>
          {user?.role === "admin" && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={open}
              radius="md"
            >
              Добавить сотрудника
            </Button>
          )}
        </Group>
      </Group>

      <Paper withBorder p="md" radius="md">
        <TextInput
          placeholder="Поиск по ФИО..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Paper>

      <Box>
        {Object.keys(groupedContacts).length === 0 ? (
          <Text c="dimmed" textAlign="center" py="xl">
            Ничего не найдено
          </Text>
        ) : (
          Object.entries(groupedContacts).map(([deptName, people]) => (
            <Stack key={deptName} gap="xs" mb="xl">
              <Badge
                size="lg"
                radius="sm"
                variant="filled"
                color="blue"
                fullWidth
                justify="flex-start"
                py="md"
              >
                {deptName}
              </Badge>

              <Paper withBorder radius="md" p={0}>
                <Table verticalSpacing="sm">
                  <Table.Tbody>
                    {people.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td fw={500} style={{ width: "25%" }}>
                          <Text fw={500}>{item.name}</Text>
                          <Text size="xs" c="dimmed" fw={400}>
                            {item.position || "Должность не указана"}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ width: "15%" }}>
                          <Text size="xs" c="dimmed">
                            Внутр.
                          </Text>
                          <Text size="sm" fw={600} c="blue">
                            {item.internal_tel || "—"}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ width: "20%" }}>
                          <Text size="xs" c="dimmed">
                            Городской
                          </Text>
                          <Text size="sm">{item.city_tel || "—"}</Text>
                        </Table.Td>
                        <Table.Td style={{ width: "20%" }}>
                          <Text size="xs" c="dimmed">
                            Мобильный
                          </Text>
                          <Text size="sm">{item.mobile_tel || "—"}</Text>
                        </Table.Td>
                        {user?.role === "admin" && (
                          <Table.Td>
                            <Group gap={4} justify="flex-end">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => handleEdit(item)}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() =>
                                  confirm(`Удалить ${item.name}?`) &&
                                  deleteMutation.mutate(item.id)
                                }
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Paper>
            </Stack>
          ))
        )}
      </Box>

      {/* Модалка остается прежней */}
      <Modal
        opened={opened}
        onClose={handleClose}
        title={editingId ? "Редактировать" : "Новый сотрудник"}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit((v) => saveMutation.mutate(v))}>
          <Stack gap="md">
            <TextInput label="ФИО" required {...form.getInputProps("name")} />
            <TextInput
              label="Должность"
              placeholder="Например: Старший механик"
              {...form.getInputProps("position")}
            />
            <Select
              label="Отдел"
              data={
                departments?.map((d) => ({
                  value: String(d.id),
                  label: d.name,
                })) || []
              }
              required
              {...form.getInputProps("department_id")}
            />
            <SimpleGrid cols={3}>
              <TextInput
                label="Внутренний"
                {...form.getInputProps("internal_tel")}
              />
              <TextInput
                label="Городской"
                {...form.getInputProps("city_tel")}
              />
              <TextInput
                label="Мобильный"
                {...form.getInputProps("mobile_tel")}
              />
            </SimpleGrid>
            <Button
              type="submit"
              loading={saveMutation.isPending}
              fullWidth
              mt="xl"
            >
              Сохранить
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
