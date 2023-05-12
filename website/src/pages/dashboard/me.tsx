import { Button, Title, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Me() {
  const loaderProp = ({ src }: any) => {
    return src;
  };

  const { data: session }: any = useSession();
  return (
    <>
      {session?.user !== undefined ? (
        <>
          <Title>{session?.user?.username}</Title>
          {/* <Image
            src={session.user.data.pfp_url}
            width={50}
            height={50}
            alt="PFP"
            loader={loaderProp}
          /> */}
          <Link
            href={
              "https://discord.com/oauth2/authorize?client_id=1101958978046541894&redirect_uri=https%3A%2F%2Funited-nations.vercel.app%2Fdashboard&response_type=code&scope=identify%20guilds%20email"
            }
          ></Link>
        </>
      ) : undefined}
    </>
  );
}
