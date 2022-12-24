import React from "react";
import axios from "axios";
import { StoreContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import Location from "../components/Location";

function Detail() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();
  const { seq } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({});

  const 매치방가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/detail",
      method: "GET",
      params: {
        seq: seq,
      },
    }).then(({ data }) => {
      setData(data);
    });

    setLoading(false);
  };

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
    } else {
      navigation("/Login");
    }
  };

  const 주소복사 = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("주소가 복사되었습니다.");
    } catch (e) {
      alert("주소복사에 실패하였습니다");
    }
  };

  React.useEffect(() => {
    매치방가져오기();
  }, []);

  const 신청하기 = async () => {
    await axios({
      url: "http://localhost:4000/match/apply",
      method: "POST",
      data: {
        seq: seq,
      },
    }).then(({ data }) => {
      if (data.message) {
        alert(data.message);
      }

      if (data.code === "success") {
        window.location = "/";
      }
    });
  };

  if (loading) {
    return <div>로딩중</div>;
  }

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

      <div className="detailWrap">
        <div className="detailHeader">
          <div className="mapWrap">
            <Location link={data.link} />
          </div>
        </div>
        <div className="detailBody">
          <div className="bodyLeft">
            <div className="section">
              <div className="matchPoint">
                <h3>매치 포인트</h3>
              </div>
              <div className="matchRule">
                <ul>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_level.svg"
                      className="icon"
                    ></img>
                    <div>
                      <p>모든 레벨 신청가능!</p>
                    </div>
                  </li>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_gender.svg"
                      className="icon"
                    ></img>
                    <div>
                      <p>상관없음</p>
                    </div>
                  </li>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_stadium.svg"
                      className="icon"
                    ></img>
                    <div>
                      <p>6vs6 (18명일 경우 3파전)</p>
                    </div>
                  </li>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_max_player_cnt.svg"
                      className="icon"
                    ></img>
                    <div>
                      <p>12~18명</p>
                    </div>
                  </li>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_shoes.svg"
                      className="icon"
                    ></img>
                    <div>
                      <p>풋살화/운동화</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bodyRight">
            <div className="section">
              <div className="matchTime">
                <p>
                  {`${data.matchday.substring(0, 4)}-${data.matchday.substring(
                    4,
                    6
                  )}-${data.matchday.substring(6, 8)} `}
                  {` ${data.matchhour.substring(
                    0,
                    2
                  )}:${data.matchhour.substring(2, 4)}`}
                </p>
              </div>
              <div className="matchPlace">
                <a>{data.place}</a>
              </div>
              <div className="matchAddress">
                <p>{data.link}</p>
                <p
                  className="address"
                  onClick={() => {
                    주소복사(`${data.link}`);
                  }}
                >
                  주소복사{" "}
                </p>
              </div>
            </div>
            <div className="sectionBtnWrap">
              <div className="applyBtn" onClick={신청하기}>
                <button>
                  <p>신청하기</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
