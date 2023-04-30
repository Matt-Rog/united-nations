import Head from "next/head";
import { Inter } from "next/font/google";
import {
  Button,
  Center,
  Container,
  Stack,
  Text,
  Title,
  Image,
  PasswordInput,
  TextInput,
  Paper,
  Anchor,
  Group,
  Checkbox,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });
let un_emblem = "/static/images/un_emblem.png";

export default function IndexAuth() {
  const [pass, setPass] = useState("");
  const theme = useMantineTheme();
  return (
    <>
      <Head>
        <title>United Nations</title>
        <meta name="description" content="United Nations Role-playing Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container size={420} my={80}>
        <Container size={100}>
          <Image
            src={un_emblem}
            alt={"un emblem"}
            fit={"contain"}
            sx={{ marginBottom: 15 }}
          />
        </Container>
        <Title align="center">UNITED NATIONS</Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component="button">
            <a
              href="/auth/register"
              style={{ textDecoration: "none", color: theme.colors.blue[4] }}
            >
              <Text>Create account</Text>
            </a>
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@email.com" required />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
          />
          <Group position="apart" mt="lg">
            <Checkbox label="Remember me" />
            {/* <Anchor component="button" size="sm">
              Forgot password?
            </Anchor> */}
          </Group>
          <Button fullWidth mt="xl">
            LOG IN
          </Button>
        </Paper>
      </Container>
    </>
  );
}
