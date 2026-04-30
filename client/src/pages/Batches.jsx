import { useQuery } from "@tanstack/react-query";
import TextHead from "../components/TextHead";
import {
  Table,
  Title,
  Paper,
  Badge,
  Group,
  Text,
  Progress,
  Stack,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { IconSearch, IconBox } from "@tabler/icons-react";

export default function Batches() {
  const [search, setSearch] = useState("");

  const { data: batches, isLoading } = useQuery({
    queryKey: ["batches"],
    queryFn: () =>
      fetch("http://localhost:3000/api/batches", {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const filteredBatches = batches?.filter((b) =>
    b.part?.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          {" "}
          <TextHead title="складские партии" text="остатки" />
        </div>

        <TextInput
          placeholder="Поиск по названию или OEM..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={300}
        />
      </Group>

      <Paper withBorder p="md">
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Запчасть</Table.Th>
              <Table.Th>Поставщик / Док.</Table.Th>
              <Table.Th>Цена закуп.</Table.Th>
              <Table.Th>Остаток</Table.Th>
              <Table.Th>Прогресс</Table.Th>
              <Table.Th>Статус</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredBatches?.map((batch) => {
              const percent =
                (batch.currentQuantity / batch.initialQuantity) * 100;
              const color =
                percent > 50 ? "green" : percent > 10 ? "orange" : "red";

              return (
                <Table.Tr key={batch.id}>
                  <Table.Td>
                    <Text fw={500}>{batch.part?.name}</Text>
                    <Text size="xs" c="dimmed">
                      {batch.part?.category?.name || "Без категории"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{batch.supplie?.agent?.name}</Text>
                    <Text size="xs" c="dimmed">
                      Док: {batch.supplie?.docNumber}
                    </Text>
                  </Table.Td>
                  <Table.Td>{batch.price.toLocaleString()} ₽</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconBox size={14} />
                      <Text fw={700}>{batch.currentQuantity}</Text>
                      <Text size="xs" c="dimmed">
                        / {batch.initialQuantity}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td w={150}>
                    <Progress
                      value={percent}
                      color={color}
                      size="sm"
                      radius="xl"
                    />
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={batch.currentQuantity > 0 ? "blue" : "gray"}
                      variant="light"
                    >
                      {batch.currentQuantity > 0 ? "В наличии" : "Пусто"}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
