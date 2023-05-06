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
import { base_url } from "@/utils/api";
import { useRouter } from "next/router";
import { setAuthToken } from "@/pages/api/cookie";
import { setCookie } from "cookies-next";
import { signIn } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });
let un_emblem = "/static/images/un_emblem.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const theme = useMantineTheme();
  const router = useRouter();

  async function login() {
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
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
          Do not have an account yet?{" "}
          <Anchor size="sm" component="button">
            <Link
              href="/auth/register"
              style={{ textDecoration: "none", color: theme.colors.blue[4] }}
            >
              <Text>Create account</Text>
            </Link>
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email"
            placeholder="you@email.com"
            required
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
          <Group position="apart" mt="lg">
            {/* <Checkbox label="Remember me" /> */}
            {/* <Anchor component="button" size="sm">
              Forgot password?
            </Anchor> */}
          </Group>
          {error === "" ? undefined : (
            <Text
              sx={{ color: theme.colors.red[4] }}
              ff={"monospace"}
              transform={"uppercase"}
            >
              {error}
            </Text>
          )}
          <Button
            fullWidth
            mt="xl"
            disabled={email === "" || password === ""}
            onClick={() => login()}
          >
            LOG IN
          </Button>
        </Paper>
      </Container>
    </>
  );
}
