import {
  AppShell,
  Burger,
  NavLink,
  Group,
  Title,
  Container,
  Text,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  IconDatabase,
  IconFilePlus,
  IconDashboard,
  IconVocabulary,
  IconMobiledata,
  IconLogout,
  IconFileMinus,
  IconCarGarage,
} from "@tabler/icons-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="space-between" h="100%">
          <Group gap="xs">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={4}>MERCURY | ССМП</Title>
          </Group>

          <Group>
            <Stack gap={0} align="flex-end">
              <Text size="sm" fw={500}>
                {user?.login || "Пользователь"}
              </Text>
              <Text size="xs" c="dimmed">
                {user?.role === "admin" ? "Администратор" : "Сотрудник"}
              </Text>
            </Stack>
            <ActionIcon
              onClick={logout}
              variant="subtle"
              color="red"
              title="Выйти"
            >
              <IconLogout size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          bdrs="md"
          component={Link}
          to="/"
          label="Дашборд"
          leftSection={<IconDashboard size={24} />}
          active={location.pathname === "/"}
        />
        <NavLink
          bdrs="md"
          component={Link}
          to="/supplies"
          label="Накладные"
          leftSection={<IconFilePlus size={24} />}
          active={location.pathname === "/supplies"}
        />
        <NavLink
          bdrs="md"
          component={Link}
          to="/disburse"
          label="Списание"
          leftSection={<IconFileMinus size={24} />}
          active={location.pathname === "/disburse"}
        />
        <NavLink
          bdrs="md"
          component={Link}
          to="/batches"
          label="Партии"
          leftSection={<IconDatabase size={24} />}
          active={location.pathname === "/batches"}
        />

        {/* СКРЫВАЕМ СПРАВОЧНИКИ ДЛЯ ОБЫЧНЫХ ПОЛЬЗОВАТЕЛЕЙ */}
        {user?.role === "admin" && (
          <NavLink
            bdrs="md"
            label="Справочники"
            leftSection={<IconVocabulary size={24} />}
            childrenOffset={28}
            defaultOpened={location.pathname.startsWith("/references")}
          >
            <NavLink
              bdrs="md"
              label="Запчасти"
              component={Link}
              to="/references/parts"
              active={location.pathname === "/references/parts"}
            />
            <NavLink
              bdrs="md"
              label="Категории"
              component={Link}
              to="/references/category"
              active={location.pathname === "/references/category"}
            />
            <NavLink
              bdrs="md"
              label="Машины"
              component={Link}
              to="/references/cars"
              active={location.pathname === "/references/cars"}
            />
            <NavLink
              bdrs="md"
              label="Контрагенты"
              component={Link}
              to="/references/agents"
              active={location.pathname === "/references/agents"}
            />
          </NavLink>
        )}

        <NavLink
          bdrs="md"
          component={Link}
          to="/repair"
          label="Ремонт"
          leftSection={<IconCarGarage size={24} />}
          active={location.pathname === "/repair"}
        />

        <NavLink
          bdrs="md"
          component={Link}
          to="/transactions"
          label="Транзакции"
          leftSection={<IconMobiledata size={24} />}
          active={location.pathname === "/transactions"}
        />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Container size="xl" py="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
