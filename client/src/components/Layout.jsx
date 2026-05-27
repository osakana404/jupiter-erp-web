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
  Anchor,
  Tooltip,
  Box,
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
  IconDeviceLandlinePhone,
  IconBrandGithub,
  IconFileWord,
} from "@tabler/icons-react";
import { ColorSchemeToggle } from "./ColorSchemeToggle.jsx";

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
          {/* ЛЕВАЯ ЧАСТЬ: Лого и Бургер */}
          <Group gap="xs">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title
              component={Link}
              to="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                whiteSpace: "nowrap",
              }}
              order={4}
            >
              MERCURY | ССМП
            </Title>
            <Text c="dimmed" size="xs" mt={4}>
              v.0.8.3
            </Text>
          </Group>

          {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Быстрые ссылки */}
          {/* Скрываем на мобилках, чтобы не ломать шапку */}
          <Group visibleFrom="md" gap="xl">
            <Anchor
              component={Link}
              to="/ord"
              size="sm"
              c="dimmed"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <IconFileWord size={16} />
              Как работать с ЕСЭД
            </Anchor>
            <Anchor
              component={Link}
              to="/tel"
              size="sm"
              c="dimmed"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <IconDeviceLandlinePhone size={16} />
              Телефонный справочник
            </Anchor>
          </Group>

          {/* ПРАВАЯ ЧАСТЬ: Профиль и Выход */}
          <Group gap="md">
            <ColorSchemeToggle />
            <Stack gap={0} align="flex-end" visibleFrom="xs">
              <Text size="sm" fw={600} style={{ lineHeight: 1 }}>
                {user?.login || "Пользователь"}
              </Text>
              <Text size="xs" c="dimmed">
                {user?.role === "admin"
                  ? "Администратор"
                  : user?.role === "mechanic"
                    ? "Механик"
                    : "Сотрудник"}
              </Text>
            </Stack>

            <ActionIcon
              onClick={logout}
              variant="light"
              color="red"
              size="lg" // Чуть больше для удобства нажатия
              title="Выйти"
            >
              <IconLogout size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/* Эта секция будет растягиваться и прижимать нижнюю часть вниз */}
        <AppShell.Section grow>
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
            to="/tel"
            label="Телефоны"
            leftSection={<IconDeviceLandlinePhone size={24} />}
            active={location.pathname === "/tel"}
          />
          <NavLink
            bdrs="md"
            component={Link}
            to="/ord"
            label="Документация"
            leftSection={<IconFileWord size={24} />}
            active={location.pathname === "/ord"}
          />

          {(user?.role === "admin" || user?.role === "mechanic") && (
            <>
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
            </>
          )}
          <Tooltip
            label="У вас нет доступа"
            disabled={user?.role === "admin" || user?.role === "mechanic"}
          >
            <Box>
              <NavLink
                bdrs="md"
                component={Link}
                to="/batches"
                label="Партии"
                leftSection={<IconDatabase size={24} />}
                active={location.pathname === "/batches"}
                disabled={
                  !(user?.role === "admin" || user?.role === "mechanic")
                }
              />
            </Box>
          </Tooltip>

          {/* СКРЫВАЕМ СПРАВОЧНИКИ ДЛЯ ОБЫЧНЫХ ПОЛЬЗОВАТЕЛЕЙ */}

          <Tooltip
            label="У вас нет доступа"
            disabled={user?.role === "admin" || user?.role === "mechanic"}
          >
            <Box>
              <NavLink
                bdrs="md"
                label="Справочники"
                leftSection={<IconVocabulary size={24} />}
                // Если доступа нет - делаем кнопку неактивной
                disabled={
                  !(user?.role === "admin" || user?.role === "mechanic")
                }
                childrenOffset={28}
                // Если нет доступа, меню не должно открываться
                defaultOpened={
                  location.pathname.startsWith("/references") &&
                  (user?.role === "admin" || user?.role === "mechanic")
                }
              >
                {/* Вложенные ссылки можно оставить или тоже спрятать */}

                <>
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
                  <NavLink
                    bdrs="md"
                    label="Отделы"
                    component={Link}
                    to="/references/departments"
                    active={location.pathname === "/references/departments"}
                  />
                </>
              </NavLink>
            </Box>
          </Tooltip>
          <Tooltip
            label="У вас нет доступа"
            disabled={user?.role === "admin" || user?.role === "mechanic"}
          >
            <Box>
              <NavLink
                bdrs="md"
                component={Link}
                to="/transactions"
                label="Транзакции"
                leftSection={<IconMobiledata size={24} />}
                active={location.pathname === "/transactions"}
                disabled={
                  !(user?.role === "admin" || user?.role === "mechanic")
                }
              />
            </Box>
          </Tooltip>
        </AppShell.Section>
        {/* Эта секция всегда будет в самом низу */}
        <AppShell.Section>
          <NavLink
            bdrs="md"
            component="a" // Для внешних ссылок лучше использовать нативный тег 'a'
            href="https://github.com/osakana404/jupiter-erp-web"
            target="_blank" // Открывать в новой вкладке
            label="Наш проект на GitHub"
            description="GitHub Репозиторий"
            leftSection={<IconBrandGithub size={24} />}
            variant="subtle"
            color="gray"
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main bg="var(--mantine-color-body)">
        <Container size="xl" py="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
