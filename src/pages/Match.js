import React from "react";
import axios from "axios";
import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

function Match() {
  const { loginUser } = React.useContext(StoreContext);
  const [data, setData] = React.useState({});
  const navigation = useNavigate();

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
            <h5>장소</h5>
            <input name="place" onChange={데이터변경}></input>
            <h5>주소</h5>
            <input name="link" onChange={데이터변경}></input>
            <h5>레벨</h5>
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
            <h5>경기날짜</h5>
            <input
              className="date"
              type="datetime-local"
              name="matchtime"
              onChange={데이터변경}
            ></input>
            <h5>메모</h5>
            <input name="memo" onChange={데이터변경}></input>

            <button type="button" onClick={매치등록}>
              매치등록
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Match;
