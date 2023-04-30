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
import { setegid } from "process";

const inter = Inter({ subsets: ["latin"] });
let un_emblem = "/static/images/un_emblem.png";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const theme = useMantineTheme();

  async function register_account() {
    console.log(JSON.stringify({ username, password, email }));
    const response = await fetch("https://api.un.mattrog.com/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message);
    }
  }

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
          Already have an account?{" "}
          <Anchor size="sm" component="button">
            <a
              href="/auth"
              style={{ textDecoration: "none", color: theme.colors.blue[4] }}
            >
              <Text>Log in</Text>
            </a>
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Username" placeholder="xX_EPIC-GAMER_Xx" required />
          <TextInput
            label="Email"
            placeholder="you@email.com"
            required
            mt={"md"}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
          />
          {error !== "" ? (
            <Text sx={{ color: theme.colors.red }} ff={"monospace"}>
              error
            </Text>
          ) : undefined}
          <Button fullWidth mt="xl" onClick={() => register_account()}>
            SIGN UP
          </Button>
        </Paper>
      </Container>
    </>
  );
}
