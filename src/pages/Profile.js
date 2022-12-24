import React from "react";
import axios from "axios";
import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
    } else {
      navigation("/Login");
    }
  };

  return (
    <div className="container">
      <Navbar myProfile={마이페이지로이동} />

      <div>{loginUser.name}</div>
    </div>
  );
}

export default Profile;
