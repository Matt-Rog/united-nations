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
  rem,
  Divider,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { setegid } from "process";
import { base_url } from "@/utils/api";
import { Router, useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { IconBrandDiscord, IconBrandDiscordFilled } from "@tabler/icons-react";

const inter = Inter({ subsets: ["latin"] });
let un_emblem = "/static/images/un_emblem.png";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const theme = useMantineTheme();
  const router = useRouter();

  async function register_account() {
    const response = await fetch("/api/un", {
      method: "POST",
      body: JSON.stringify({
        method: "POST",
        endpoint: "/auth/register",
        payload: { username, password, email },
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message);
    } else {
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
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
            <Link
              href="/auth/login"
              style={{ textDecoration: "none", color: theme.colors.blue[4] }}
            >
              <Text>Log in</Text>
            </Link>
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="xX_EPIC-GAMER_Xx"
            required
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <TextInput
            label="Email"
            placeholder="you@email.com"
            required
            mt={"md"}
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <PasswordInput
            placeholder="Retype password"
            mt="sm"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          />

          {error !== "" ? (
            <Text
              sx={{ color: theme.colors.red[4] }}
              ff={"monospace"}
              transform={"uppercase"}
            >
              {error}
            </Text>
          ) : undefined}
          <Button
            fullWidth
            mt="xl"
            disabled={
              password === "" ||
              username === "" ||
              email === "" ||
              password !== confirmPassword
            }
            onClick={() => register_account()}
          >
            SIGN UP
          </Button>
          <Divider label={"OR"} labelPosition="center" mt={"sm"} mb={"sm"} />
          <Button
            fullWidth
            color={"#5865F2"}
            leftIcon={<IconBrandDiscordFilled size={rem(18)} />}
            styles={(theme) => ({
              root: {
                backgroundColor: "#5865F2",
                border: 0,
                height: rem(42),
                paddingLeft: rem(20),
                paddingRight: rem(20),
                "&:not([data-disabled])": theme.fn.hover({
                  backgroundColor: theme.fn.darken("#5865F2", 0.05),
                }),
              },

              leftIcon: {
                marginRight: theme.spacing.md,
              },
            })}
          >
            SIGN UP WITH DISCORD
          </Button>
        </Paper>
      </Container>
    </>
  );
}
