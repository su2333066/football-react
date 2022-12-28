import axios from "axios";
import React from "react";
import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

axios.defaults.withCredentials = true;

function Login() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();

  const [data, setData] = React.useState({});

  const 데이터변경 = (event) => {
    const cloneData = { ...data };
    cloneData[event.target.name] = event.target.value;
    setData(cloneData);
  };

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Profile");
    } else {
      navigation("/Login");
    }
  };

  const 로그인하기 = async () => {
    await axios({
      url: "http://3.38.255.11:4000/login",
      method: "POST",
      data: data,
    }).then((response) => {
      if (response.data.message) {
        alert(response.data.message);
      }

      if (response.data.code === "success") {
        window.location = "/";
      }
    });
  };

  const 회원가입페이지로이동 = () => {
    navigation("/Join");
  };

  return (
    <div className="container">
      <Navbar myProfile={마이페이지로이동} />

      <div className="contentContainer">
        <div className="contentInner">
          <div className="inner">
            <div className="headMessage">
              <h2>풋살하고싶을땐</h2>
              <h2 className="hlt">플랩풋볼</h2>
            </div>
            <input
              name="id"
              placeholder="아이디 또는 이메일"
              onChange={데이터변경}
            />
            <input
              type="password"
              name="pw"
              placeholder="비밀번호"
              onChange={데이터변경}
            />
            <label>
              <span className="checkbox"></span>
              <span>아이디 저장</span>
            </label>
            <button type="button" onClick={로그인하기}>
              로그인
            </button>

            <span className="joinBtn" onClick={회원가입페이지로이동}>
              회원가입
            </span>
          </div>
          <div className="loginOrJoinKakao">
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/ic_kakao.svg"
              alt="카카오이메일"
            ></img>
            <span className="kakaoBtn"> 카카오 로그인</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
