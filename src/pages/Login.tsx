import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { TextInput } from "../components/TextInput";
import { ClosedEye, OpenEye } from "../components/Icons";
import { CARD_WIDTHS } from "../constants";
import { auth } from "../firebase";
import { useApp } from "../providers/AppProvider";

function Login(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const app = useApp();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      app.addNotification({
        type: "alert-error",
        message: "Please enter a valid email address",
        timeout: 1000,
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center h-screen"
    >
      <div className={`card ${CARD_WIDTHS}`}>
        <div className="card-body">
          <h1 className="card-title">Munitests</h1>
          <div className="items-center justify-center">
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <TextInput
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              right={
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ClosedEye /> : <OpenEye />}
                </button>
              }
            />
          </div>
          <div className="card-actions">
            <button type="submit" className="btn btn-success btn-block mt-4">
              Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
