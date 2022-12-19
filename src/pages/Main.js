import React from "react";
import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel";

function Main() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
    } else {
      navigation("/Login");
    }
  };

  const 매치등록 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Match");
    } else {
      navigation("/Login");
    }
  };

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
                <img
                  src="https://plab-football.s3.amazonaws.com/static/img/ic_search.svg"
                  alt="내정보"
                ></img>
              </button>
              <input
                type="search"
                maxlength="100"
                autocomplete="off"
                placeholder="지역, 구장 이름으로 찾기"
              ></input>
            </div>
            <button onClick={마이페이지로이동}>
              <img
                src="https://plab-football.s3.amazonaws.com/static/img/ic_my.svg"
                alt="더보기"
              ></img>
            </button>
            <button>•••</button>
          </div>
        </div>
      </div>

      <div className="sliderContainer">
        <div className="sliderBox">
          <Carousel />
        </div>
      </div>

      <button className="matchBtn" onClick={매치등록}>
        ➕
      </button>
    </div>
  );
}

export default Main;
