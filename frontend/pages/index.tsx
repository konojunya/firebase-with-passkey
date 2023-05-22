import { NotLoggedIn } from "../components/NotLoggedIn";
import { useAuth } from "../hooks/auth";

export default function Home() {
  const { user, signout, canUsePassKey } = useAuth();

  if (user == null) {
    return <NotLoggedIn />;
  }

  return (
    <div>
      <h1>Hello, {user.email}</h1>
      <button onClick={signout}>logout</button>

      {canUsePassKey && <button>passkey を設定する</button>}
    </div>
  );
}
