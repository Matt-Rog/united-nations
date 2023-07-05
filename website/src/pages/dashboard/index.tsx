import { Button, Space, Stack, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { base_url, web_url } from "@/utils/api";
import type { GetServerSidePropsContext } from "next";

interface DashboardProps {
  session: any;
  games: any;
}

export default function DashboardIndex({ user, games }: any) {
  console.log(user);
  return (
    <div>
      <>
        <Title>{user.username}</Title>
        <Link href={"/dashboard/me"}>
          <Button variant="outline">Account settings</Button>
        </Link>
      </>
      {games.map((game: any) => {
        return (
          <div>
            <Title>{game.name}</Title>
          </div>
        );
      })}

      <Space h={100} />
      {user ? (
        <Button onClick={() => signOut({ callbackUrl: "/auth" })}>
          SIGN OUT
        </Button>
      ) : (
        <Button onClick={() => signIn()}>LOG IN</Button>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session: any = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  var res = await fetch(`${web_url}/api/un`, {
    method: "POST",
    body: JSON.stringify({
      method: "GET",
      endpoint: `/users/${session.user.id}/games`,
    }),
  });
  var user = session.user;
  const games = await res.json();
  return { props: { user, games } };
}
