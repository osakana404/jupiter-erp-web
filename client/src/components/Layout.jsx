import { AppShell, Burger, NavLink, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  IconDatabase,
  IconFilePlus,
  IconDashboard,
  IconVocabulary,
  IconMobiledata,
} from "@tabler/icons-react";

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
      <AppShell.Navbar p="md">
        <NavLink
          component={Link}
          to="/"
          label="Дашборд"
          leftSection={<IconDashboard size={24} />}
          active={location.pathname === "/"}
        />
        <NavLink
          component={Link}
          to="/supplies"
          label="Накладные"
          leftSection={<IconFilePlus size={24} />}
          active={location.pathname === "/supplies"}
        />
        <NavLink
          component={Link}
          to="/batches"
          label="Партии"
          leftSection={<IconDatabase size={24} />}
          active={location.pathname === "/batches"}
        />
        <NavLink
          href="#required-for-focus"
          label="Справочники"
          leftSection={<IconVocabulary size={24} />}
          childrenOffset={28}
        >
          <NavLink
            href="#required-for-focus"
            label="Запчасти"
            component={Link}
            to="/references/parts"
            active={location.pathname === "/references/parts"}
          />
          <NavLink
            label="Машины"
            href="#required-for-focus"
            component={Link}
            to="/references/cars"
            active={location.pathname === "/references/cars"}
          />
          <NavLink
            label="Контрагенты"
            href="#required-for-focus"
            component={Link}
            to="/references/agents"
            active={location.pathname === "/references/agents"}
          />
        </NavLink>
        <NavLink
          component={Link}
          to="/transactions"
          label="Транзакции"
          leftSection={<IconMobiledata size={24} />}
          active={location.pathname === "/transactions"}
        />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
