import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "../components/CustomInput";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3 || password.length < 6) {
        throw new Error("The information you entered is incorrect");
      }
      const result = await axios.post("/user/login", {
        username,
        password,
      });
      setMe({
        name: result.data.name,
        sessionId: result.data.sessionId,
      });
      toast.success("Login success", {
        position: "top-right",
        autoClose: 500,
      });
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message, {
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
      <h3>Login</h3>
      <form onSubmit={loginHandler}>
        <CustomInput label="username" value={username} setValue={setUsername} />
        <CustomInput
          label="password"
          type="password"
          value={password}
          setValue={setPassword}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LoginPage;
