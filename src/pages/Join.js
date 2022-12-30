import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../App";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

axios.defaults.withCredentials = true;

const levelButtons = [
  {
    name: "루키",
    value: 1,
  },
  {
    name: "비기너",
    value: 2,
  },
  {
    name: "아마추어",
    value: 3,
  },
  {
    name: "세미프로",
    value: 4,
  },
  {
    name: "프로",
    value: 5,
  },
];

function Join() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();

  const [data, setData] = React.useState({});

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Profile");
    } else {
      navigation("/Login");
    }
  };

  const 데이터변경 = (event) => {
    const cloneData = { ...data };
    cloneData[event.target.name] = event.target.value;
    setData(cloneData);
  };

  const 가입하기 = async () => {
    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/join",
        method: "POST",
        data: data,
      }).then((response) => {
        if (response.data.message) {
          alert(response.data.message);
        }

        if (response.data.code === "success") {
          navigation("/Login");
        }
      });
    } else {
      await axios({
        url: "http://localhost:4000/join",
        method: "POST",
        data: data,
      }).then((response) => {
        if (response.data.message) {
          alert(response.data.message);
        }

        if (response.data.code === "success") {
          navigation("/Login");
        }
      });
    }
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
              placeholder="아이디를 입력해주세요"
              onChange={데이터변경}
            />
            <input
              name="name"
              placeholder="이름을 입력해주세요"
              onChange={데이터변경}
            />
            <span className="levelCheck">Level Check</span>
            <div className="level">
              {levelButtons.map((item, index) => {
                const className =
                  data.level == item.value ? "button-active" : "";

                return (
                  <button
                    name="level"
                    type="radio"
                    className={className}
                    key={`levelButtons-${index}`}
                    value={item.value}
                    onClick={데이터변경}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
            <input
              type="password"
              name="pw"
              placeholder="비밀번호를 입력해주세요"
              onChange={데이터변경}
            />

            <button type="button" onClick={가입하기}>
              회원가입
            </button>
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

export default Join;
