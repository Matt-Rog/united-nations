import { Button, Space, Stack, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardIndex() {
  // const { data: session } = useSession();
  // const session: any = useSession();
  const { data: session }: any = useSession();
  // const [user, setUser] = useState<any>({});
  // const [games, setGames] = useState<any>([]);
  // const [userData, setUserData] = useState();

  // useEffect(() => {
  //   if (session?.user?.data !== undefined) {
  //     console.log(session.user.data._id);
  //     fetch("/api/un", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         method: "GET",
  //         endpoint: "/users/" + session.user.data._id + "/games",
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //         setGames(data);
  //       });
  //   }
  // }, [session]);

  return (
    <div>
      {session?.user ? (
        <>
          <Title>{session.user.username}</Title>
          <Link href={"/dashboard/me"}>
            <Button variant="outline">Account settings</Button>
          </Link>
        </>
      ) : undefined}

      <Space h={100} />
      {session?.user ? (
        <Button onClick={() => signOut({ callbackUrl: "/auth" })}>
          SIGN OUT
        </Button>
      ) : (
        <Button onClick={() => signIn()}>LOG IN</Button>
      )}
    </div>
  );
}
