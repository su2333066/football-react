import React from "react";
import axios from "axios";
import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";

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

function Main() {
  const { loginUser } = React.useContext(StoreContext);
  const [data, setData] = React.useState({});
  const navigation = useNavigate();

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
    } else {
      navigation("/Login");
    }
  };

  const 데이터변경 = (event) => {
    const cloneData = { ...data };
    cloneData[event.target.name] = event.target.value;
    setData(cloneData);
  };

  const 매치등록 = async () => {
    await axios({
      url: "http://localhost:4000/match",
      method: "POST",
      data: data,
    }).then((response) => {
      if (response.data.message) {
        alert(response.data.message);
      }

      if (response.data.code === "success") {
        navigation("/");
      }
    });
  };

  console.log(data);

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
                maxLength="100"
                autoComplete="off"
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

      <div className="contentContainer">
        <div className="contentInner">
          <div className="inner">
            <h4>풋살장 위치</h4>
            <input name="place" onChange={데이터변경}></input>
            <h4>링크</h4>
            <input name="link" onChange={데이터변경}></input>
            <h4>레벨</h4>
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
            <h4>경기날짜</h4>
            <input
              className="date"
              type="datetime-local"
              name="matchtime"
              onChange={데이터변경}
            ></input>
            <h4>메모</h4>
            <input name="memo" onChange={데이터변경}></input>

            <button type="button" onClick={매치등록}>
              매치등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
