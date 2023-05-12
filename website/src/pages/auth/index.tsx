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
    const res = await signIn("discord", {
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
      <Container size={420} my={100}>
        <Container size={100}>
          <Image
            src={un_emblem}
            alt={"un emblem"}
            fit={"contain"}
            sx={{ marginBottom: 15 }}
          />
        </Container>
        <Title align="center">UNITED NATIONS</Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Button
            onClick={() => login()}
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
