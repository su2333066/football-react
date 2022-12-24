import React from "react";
import axios from "axios";
import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const levelList = [
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
  const navigation = useNavigate();
  const [matchList, setMatchList] = React.useState([]);
  const [currentDate, setCurrentDate] = React.useState({
    date: "",
    time: "",
  });

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Profile");
    } else {
      navigation("/Login");
    }
  };

  const 현재시간가져오기 = async () => {
    const cloneCurrentDate = { ...currentDate };

    await axios({
      url: "http://localhost:4000/time",
    }).then(({ data }) => {
      cloneCurrentDate.date = data[0].DATE;
      cloneCurrentDate.time = data[0].TIME;
      setCurrentDate(cloneCurrentDate);
    });
  };

  const 매치등록 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Match");
    } else {
      navigation("/Login");
    }
  };

  const 매치목록가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/match",
    }).then((response) => {
      setMatchList(response.data);
    });
  };

  React.useEffect(() => {
    현재시간가져오기();
    매치목록가져오기();
  }, []);

  return (
    <div className="container">
      <Navbar myProfile={마이페이지로이동} />

      <div className="sliderContainer">
        <div className="sliderBox">
          <Carousel />
        </div>
      </div>

      <div className="matchListContainer">
        {matchList.length > 0 &&
          matchList.map((item, index) => {
            return (
              <div key={index} className="matchList">
                <ul>
                  <li className="itemContainer">
                    <a>
                      <div className="itemTime">
                        <p type="datetime">{`${item.matchday.substring(
                          0,
                          4
                        )}-${item.matchday.substring(
                          4,
                          6
                        )}-${item.matchday.substring(6, 8)}`}</p>
                        <p type="datetime">{`${item.matchhour.substring(
                          0,
                          2
                        )}:${item.matchhour.substring(2, 4)}`}</p>
                      </div>
                      <div className="itemInfo">
                        <div className="infoTitle">
                          <h3>{item.place}</h3>
                        </div>
                        <div className="infoMatchLevel">
                          {levelList.map((level, index) => {
                            if (level.value === item.LEVEL) {
                              return <span key={index}>{level.name}</span>;
                            }
                          })}
                        </div>
                      </div>
                      <div className="itemStatus">
                        {parseInt(item.date_diff) < 2 ? (
                          item.match_user_seq !== null &&
                          item.match_user_seq === loginUser.seq ? (
                            <div className="matchStatus myMatch">
                              <p
                                onClick={() => {
                                  if (Object.keys(loginUser).length !== 0) {
                                    navigation(`/detail/${item.seq}`);
                                  } else {
                                    navigation("/Login");
                                  }
                                }}
                                className="yes"
                              >
                                매치 성공!
                              </p>
                            </div>
                          ) : (
                            <div className="matchStatus isFull">
                              <p>마감</p>
                            </div>
                          )
                        ) : (
                          <div className="matchStatus isHurry">
                            <p
                              onClick={() => {
                                if (Object.keys(loginUser).length !== 0) {
                                  navigation(`/detail/${item.seq}`);
                                } else {
                                  navigation("/Login");
                                }
                              }}
                              className="yes"
                            >
                              신청가능
                            </p>
                          </div>
                        )}
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            );
          })}
      </div>

      <button className="matchBtn" onClick={매치등록}>
        +
      </button>

      <Footer />
    </div>
  );
}

export default Main;
