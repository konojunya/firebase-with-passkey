import { useAuth } from "../hooks/auth";

export const NotLoggedIn = () => {
  const {
    signinWithEmailLink,
    signinWithPassKey,
    email,
    setEmail,
    canUsePassKey,
  } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <h1>以下からログインしてください</h1>
      <ul>
        <li style={{ display: "flex", gap: "16px" }}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="hoge@example.com"
            autoComplete="email webauthn"
            value={email}
            onChange={handleEmailChange}
          />
          <button onClick={signinWithEmailLink}>Email Link でログイン</button>
        </li>
        {canUsePassKey && (
          <button onClick={signinWithPassKey}>Passkey でログイン</button>
        )}
      </ul>
    </div>
  );
};
