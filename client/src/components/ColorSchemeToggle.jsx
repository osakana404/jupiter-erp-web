import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Switch,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  // Этот хук нужен, чтобы понять, какая тема сейчас реально отображается
  // (учитывает настройки системы, если выбрано 'auto')
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <>
      <Switch
        size="md"
        color="dark.4"
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        onLabel={<IconSun size={16} color="var(--mantine-color-yellow-4)" />}
        offLabel={<IconMoon size={16} color="var(--mantine-color-blue-6)" />}
      />
      {/* <ActionIcon
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        size="md"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === "light" ? (
          <IconMoon stroke={1.5} />
        ) : (
          <IconSun stroke={1.5} />
        )}
      </ActionIcon> */}
    </>
  );
}
