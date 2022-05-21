import React, { useState, useContext } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters long");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      if (password !== passwordCheck) {
        throw new Error("Password is different");
      }
      const result = await axios.post("/user/register", {
        name,
        username,
        password,
      });
      setMe({
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        name: result.data.name,
      });
      toast.success("Success!", {
        position: "top-right",
        autoClose: 500,
      });
      navigate("/");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>Sign up</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label="Name" setValue={setName} value={name} />
        <CustomInput
          label="User Name"
          setValue={setUsername}
          value={username}
        />
        <CustomInput
          label="Password"
          setValue={setPassword}
          value={password}
          type="password"
        />
        <CustomInput
          type="password"
          label="Password Check"
          setValue={setPasswordCheck}
          value={passwordCheck}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage;
