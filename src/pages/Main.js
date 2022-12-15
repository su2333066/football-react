import React from "react";
import { StoreContext } from "../App";

function Main() {
  const { loginUser } = React.useContext(StoreContext);

  return <div>안녕하세요 {loginUser.nickname}님~</div>;
}

export default Main;
