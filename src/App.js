import React from "react";
import "./App.css";

import Login from "./pages/Login";
import Join from "./pages/Join";
import Main from "./pages/Main";
import Match from "./pages/Match";
import Detail from "./pages/Detail";
import Profile from "./pages/Profile";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export const StoreContext = React.createContext({});

function App() {
  const [loginUser, setLoginUser] = React.useState({});

  const 자동로그인 = async () => {
    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/autoLogin",
        method: "POST",
      }).then((response) => {
        setLoginUser(response.data);
      });
    } else {
      await axios({
        url: "http://localhost:4000/autoLogin",
        method: "POST",
      }).then((response) => {
        setLoginUser(response.data);
      });
    }
  };
  React.useEffect(() => {
    자동로그인();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        loginUser: loginUser,
      }}
    >
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/match" element={<Match />} />
        <Route exact path="/detail/:seq" element={<Detail />} />
        <Route exact path="/profile" element={<Profile />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
