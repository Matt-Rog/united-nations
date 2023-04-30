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
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });
let un_emblem = "/static/images/un_emblem.png";

export default function Home() {
  const [pass, setPass] = useState("");

  return (
    <>
      <Head>
        <title>United Nations</title>
        <meta name="description" content="United Nations Role-playing Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        h={"100vh"}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container size={"lg"}>
          <Center>
            <Stack sx={{ margin: "auto", marginTop: 200 }}>
              <Container size={100}>
                <Image src={un_emblem} alt={"un emblem"} fit={"contain"} />
              </Container>
              <Title sx={{ margin: "auto" }}>United Nations</Title>
            </Stack>
          </Center>
        </Container>
      </Container>
    </>
  );
}
