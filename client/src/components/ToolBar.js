import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  const logoutHandler = async () => {
    try {
      await axios.patch("/user/logout");
      setMe();
      toast.success("Logout success", {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <Link to="/">
        <div>Home</div>
      </Link>
      {me ? (
        <div
          onClick={logoutHandler}
          style={{ float: "right", cursor: "pointer" }}
        >
          Logout {me.name}
        </div>
      ) : (
        <>
          <Link to="/auth/login">
            <div style={{ float: "right" }}>Login</div>
          </Link>
          <Link to="/auth/register">
            <div style={{ float: "right", marginRight: 15 }}>Signup</div>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
