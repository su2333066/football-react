import React from "react";
import { StoreContext } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

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

function Profile() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();

  const [matchList, setMatchList] = React.useState([]);

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Profile");
    } else {
      navigation("/Login");
    }
  };

  const 성공된매치가져오기 = async () => {
    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/match/success",
      }).then(({ data }) => {
        setMatchList(data.matchList);
      });
    } else {
      await axios({
        url: "http://localhost:4000/match/success",
      }).then(({ data }) => {
        setMatchList(data.matchList);
      });
    }
  };

  React.useEffect(() => {
    성공된매치가져오기();
  }, []);

  return (
    <div className="container">
      <Navbar myProfile={마이페이지로이동} />

      <div className="profile">
        <div className="profile__container">
          <div className="profile__left">
            <h2>매치 목록</h2>
            {matchList.length !== 0 &&
              matchList.map((match, index) => {
                return (
                  <ul className="match" key={index}>
                    <li className="match__time">
                      {match.matchday} {match.matchhour}
                    </li>
                    <li className="match__place">장소 : {match.place}</li>
                    <li className="match__address">주소 : {match.link}</li>
                    <li className="match__level">
                      <span className="match__level-star">⭐</span>
                      {levelList.map((level, index) => {
                        if (level.value === match.LEVEL) {
                          return <span key={index}>{level.name}</span>;
                        }
                      })}
                    </li>
                    <li className="match__memo">메모 : {match.memo}</li>
                  </ul>
                );
              })}
          </div>
          <div className="profile__right"></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
