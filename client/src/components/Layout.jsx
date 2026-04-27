import { AppShell, Burger, NavLink, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>JUPITER ERP</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          component={Link}
          to="/"
          label="Дашборд"
          active={location.pathname === "/"}
        />
        <NavLink
          component={Link}
          to="/supplies"
          label="Накладные"
          active={location.pathname === "/supplies"}
        />
        <NavLink
          component={Link}
          to="/references"
          label="Справочники"
          active={location.pathname.startsWith("/references")}
        />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
