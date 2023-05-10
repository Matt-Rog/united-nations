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
  Divider,
  rem,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { base_url } from "@/utils/api";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { IconBrandDiscord, IconBrandDiscordFilled } from "@tabler/icons-react";

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
            CONTINUE WITH DISCORD
          </Button>
        </Paper>
      </Container>
    </>
  );
}
