import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Home: NextPage = () => {
  const { data: session }: any = useSession();

  if (session) {
    const { user } = session;
    console.log(session);

    return (
      <>
        {user?.name ? <text>{user.name}</text> : <></>}
        Hello, {user?.username}!<br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("discord")}>Sign in</button>
    </>
  );
};

export default Home;
