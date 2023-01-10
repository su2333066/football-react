import React from "react";
import axios from "axios";
import { StoreContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import Location from "../components/Location";
import Navbar from "../components/Navbar";
import Spinner from "../assets/loading.gif";
import { CopyToClipboard } from "react-copy-to-clipboard/src";

function Detail() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();
  const { seq } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({});

  const 매치방가져오기 = async () => {
    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/detail",
        params: {
          seq: seq,
        },
      }).then(({ data }) => {
        setData(data);
      });
    } else {
      await axios({
        url: "http://localhost:4000/detail",
        params: {
          seq: seq,
        },
      }).then(({ data }) => {
        setData(data);
      });
    }

    setLoading(false);
  };

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Profile");
    } else {
      navigation("/Login");
    }
  };

  React.useEffect(() => {
    매치방가져오기();
  }, []);

  const 신청하기 = async () => {
    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/match/apply",
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
    } else {
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
    }
  };

  if (loading) {
    return (
      <div className="loadingORlogin detail__loading">
        <img src={Spinner} alt="로딩중"></img>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar myProfile={마이페이지로이동} />

      <div className="detailWrap">
        <Location link={data.link} />
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
                      alt="레벨"
                    ></img>
                    <div>
                      <p>모든 레벨 신청가능!</p>
                    </div>
                  </li>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_gender.svg"
                      className="icon"
                      alt="성별"
                    ></img>
                    <div>
                      <p>상관없음</p>
                    </div>
                  </li>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_stadium.svg"
                      className="icon"
                      alt="스타디움"
                    ></img>
                    <div>
                      <p>6vs6 (18명일 경우 3파전)</p>
                    </div>
                  </li>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_max_player_cnt.svg"
                      className="icon"
                      alt="최대인원"
                    ></img>
                    <div>
                      <p>12~18명</p>
                    </div>
                  </li>
                  <li className="infoList">
                    <img
                      src="https://plab-football.s3.amazonaws.com/static/img/ic_info_shoes.svg"
                      className="icon"
                      alt="신발"
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
                <p>{data.place}</p>
              </div>
              <div className="matchAddress">
                <p>{data.link}</p>
                {/* <CopyToClipboard
                  className="address"
                  text={`${data.link}`}
                  onCopy={() => alert("주소가 복사되었습니다.")}
                >
                  <text>주소복사</text>
                </CopyToClipboard> */}
                <CopyToClipboard
                  text={`${data.link}`}
                  onCopy={() => alert("주소가 복사되었습니다")}
                >
                  <span className="address">주소복사</span>
                </CopyToClipboard>
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
