import { Title, Text } from "@mantine/core";

export default function TextHead(props) {
  return (
    <>
      <Title order={2}>{props.title.toUpperCase()}</Title>
      <Text c="var(--mantine-color-dimmed)" size="sm">
        {props.text.toUpperCase()}
      </Text>
    </>
  );
}
