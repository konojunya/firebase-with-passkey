import { initializeApp } from "firebase/app";
import {
  User,
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectOnce } from "react-use";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
});

export function useAuth() {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [canUsePassKey, setCanUsePassKey] = useState(false);
  const router = useRouter();

  const updateUserState = () => {
    onAuthStateChanged(getAuth(app), setUser);
  };

  const signinWithEmailLink = async () => {
    await sendSignInLinkToEmail(auth, email, {
      url: "http://localhost:3001/signin",
      handleCodeInApp: true,
    });

    window.localStorage.setItem("emailForSignIn", email);

    alert(`Email sent to ${email}. Click the link to sign in.`);
  };

  const verifySignInWithEmailLink = async () => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      return;
    }

    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }

    await signInWithEmailLink(auth, email!, window.location.href);

    window.localStorage.removeItem("emailForSignIn");
    updateUserState();

    router.push("/");
  };

  const signout = () => {
    signOut(auth);
    updateUserState();
  };

  const passKeyFeatureDetection = () => {
    // feature detection
    // ref: https://web.dev/passkey-registration/#feature-detection
    if (
      window.PublicKeyCredential &&
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
      PublicKeyCredential.isConditionalMediationAvailable
    ) {
      // Check if user verifying platform authenticator is available.
      Promise.all([
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        PublicKeyCredential.isConditionalMediationAvailable(),
      ]).then((results) => {
        if (results.every((r) => r === true)) {
          setCanUsePassKey(true);
        }
      });
    }
  };

  useEffectOnce(() => {
    updateUserState();
    passKeyFeatureDetection();
  });

  return {
    signinWithEmailLink,
    verifySignInWithEmailLink,
    signout,
    email,
    setEmail,
    auth,
    user,
    canUsePassKey,
  };
}
