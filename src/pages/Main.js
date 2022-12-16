import React from "react";
import { StoreContext } from "../App";

function Main() {
  const { loginUser } = React.useContext(StoreContext);

  return (
    <div className="container">
      <div className="navbar">
        <div className="navContainer">
          <div className="navLogo">
            <a href="/">
              <img
                src="https://plab-football.s3.amazonaws.com/static/img/logo.svg"
                alt="플랩풋볼"
              ></img>
            </a>
          </div>
          <div className="navRight">
            <div className="navSearch">
              <button>
                <img src="https://plab-football.s3.amazonaws.com/static/img/ic_search.svg"></img>
              </button>
              <input
                type="search"
                maxlength="100"
                autocomplete="off"
                placeholder="지역, 구장 이름으로 찾기"
              ></input>
            </div>
            <button>
              <img src="https://plab-football.s3.amazonaws.com/static/img/ic_my.svg"></img>
            </button>
            <button>•••</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
