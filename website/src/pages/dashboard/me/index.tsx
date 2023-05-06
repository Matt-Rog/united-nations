import { Button, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export default function Me() {
  const loaderProp = ({ src }: any) => {
    return src;
  };

  const { data: session }: any = useSession();
  return (
    <>
      {session?.user?.data !== undefined ? (
        <>
          <Title>{session?.user?.data?.username}</Title>
          <Image
            src={session.user.data.pfp_url}
            width={50}
            height={50}
            alt="PFP"
            loader={loaderProp}
          />
          <Button
            disabled={session.user.data.identities.discord_user_id !== "0"}
          >
            Link discord
          </Button>
        </>
      ) : undefined}
    </>
  );
}
