import React from "react";
import axios from "axios";
import { StoreContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";

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
    }).then(({ data }) => {});
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
        <div className="detailBody">
          <div className="bodyLeft"></div>
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
