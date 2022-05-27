import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import logo from "../Gallery.png";
import { useNavigate } from "react-router-dom";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.patch("/user/logout");
      setMe();
      toast.success("Logout success", {
        position: "top-right",
        autoClose: 1000,
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
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#fff",
          paddingTop: "10px",
          marginBottom: "10px",
        }}
      >
        <img src={logo} style={{ width: "150px" }} />
      </Link>

      {me ? (
        <div
          onClick={logoutHandler}
          style={{ float: "right", cursor: "pointer" }}
        >
          Logout
          <span
            style={{ fontSize: "20px", marginLeft: "5px", color: "#5541f5" }}
          >
            {me.name}
          </span>
        </div>
      ) : (
        <div>
          <Link to="/auth/login">
            <h3
              style={{ textDecoration: "none", color: "#fff", float: "right" }}
            >
              Login
            </h3>
          </Link>
          <Link to="/auth/register">
            <h3
              style={{
                float: "right",
                marginRight: 15,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Signup
            </h3>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ToolBar;
