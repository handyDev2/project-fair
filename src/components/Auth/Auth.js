import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import InputControl from "../InputControl/InputControl";

import { auth, updateUserDatabase } from "../../firebase";

import styles from "./Auth.module.css";

function Auth(props) {
  const isSignup = props.signup ? true : false;
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleLogin = () => {
    if (!values.email || !values.password) {
      setErrorMsg("All fields required");
      return;
    }

    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(async () => {
        setSubmitButtonDisabled(false);
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  const handleSignup = () => {
    if (!values.name || !values.email || !values.password) {
      setErrorMsg("All fields required");
      return;
    }

    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (response) => {
        const userId = response.user.uid;
        await updateUserDatabase(
          { name: values.name, email: values.email },
          userId
        );
        setSubmitButtonDisabled(false);
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  const handleSubmission = (event) => {
    event.preventDefault();

    if (isSignup) handleSignup();
    else handleLogin();
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmission}>
        <p className={styles.smallLink}>
          <Link to="/">{"< Back to Home"}</Link>
        </p>
        <p className={styles.heading}>{isSignup ? "Signup" : "Login"}</p>

        {isSignup && (
          <InputControl
            label="Name"
            placeholder="Enter your name"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        )}
        <InputControl
          label="Email"
          placeholder="Enter your email"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <InputControl
          label="Password"
          placeholder="Enter your password"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, password: event.target.value }))
          }
          isPassword
        />

        <p className={styles.error}>{errorMsg}</p>

        <button type="submit" disabled={submitButtonDisabled}>
          {isSignup ? "Signup" : "Login"}
        </button>

        <div className={styles.bottom}>
          {isSignup ? (
            <p>
              Already have an account ? <Link to="/login">Login here</Link>
            </p>
          ) : (
            <p>
              New here ? <Link to="/signup">Create an account</Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Auth;
