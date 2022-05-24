import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState();

  useEffect(() => {
    const sessionId = localStorage.getItem("session");

    if (me) {
      axios.defaults.headers.common.sessionid = me.sessionId;
      localStorage.setItem("session", me.sessionId);
    } else if (sessionId) {
      axios
        .get("/user/me", { headers: { sessionid: sessionId } })
        .then((result) => {
          // console.log(result.data);
          setMe({
            name: result.data.name,
            sessionId: result.data.sessionId,
            userId: result.data.userId,
          });
        })
        .catch((error) => {
          localStorage.removeItem("session");
          delete axios.defaults.headers.common.sessionid;
        });
    } else {
      delete axios.defaults.headers.common.sessionid;
    }
  }, [me]);

  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  );
};
