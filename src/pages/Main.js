import React from "react";
import axios from "axios";

import dayjs from "dayjs";

import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, { Navigation } from "swiper";

import "swiper/css";

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

function getDayOfWeek(day) {
  // 0 => 일요일
  // 1 => 월
  // 6 => 토요일

  //ex) getDayOfWeek('2022-06-13')
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = week[day];
  return dayOfWeek;
}

function Main() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [matchList, setMatchList] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState({
    date: "",
    time: "",
  });

  const [calendar, setCalendar] = React.useState({
    prev: false,
    next: false,
    list: [],
  });

  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  const 마이페이지로이동 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Profile");
    } else {
      navigation("/Login");
    }
  };

  const 현재시간가져오기 = async () => {
    const cloneCurrentDate = { ...currentDate };

    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/time",
      }).then(({ data }) => {
        cloneCurrentDate.date = data[0].DATE;
        cloneCurrentDate.time = data[0].TIME;
        setCurrentDate(cloneCurrentDate);
      });
    } else {
      await axios({
        url: "http://localhost:4000/time",
      }).then(({ data }) => {
        cloneCurrentDate.date = data[0].DATE;
        cloneCurrentDate.time = data[0].TIME;
        setCurrentDate(cloneCurrentDate);
      });
    }

    setLoading(false);
  };

  const 매치등록 = () => {
    if (Object.keys(loginUser).length !== 0) {
      navigation("/Match");
    } else {
      navigation("/Login");
    }
  };

  const 매치목록가져오기 = async () => {
    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/match",
      }).then(({ data }) => {
        캘린더만들기(data.diff_date);
        setMatchList(data.matchList);
      });
    } else {
      await axios({
        url: "http://localhost:4000/match",
      }).then(({ data }) => {
        캘린더만들기(data.diff_date);
        setMatchList(data.matchList);
      });
    }
  };

  const 캘린더만들기 = (data) => {
    const 날짜차이 = data.diff_date;
    const 맨처음경기날짜 = data.min_date;

    if (!날짜차이) {
      return;
    }

    const 맨처음경기날짜형변환 = dayjs(맨처음경기날짜);

    const 날짜들 = [
      {
        active: false,
        date: 맨처음경기날짜형변환.date(),
        day: 맨처음경기날짜형변환.day(),
        month: 맨처음경기날짜형변환.month() + 1,
        year: 맨처음경기날짜형변환.year(),
      },
    ];

    for (let i = 1; i <= 날짜차이; i++) {
      const 날짜 = 맨처음경기날짜형변환.add(i, "days");
      날짜들.push({
        active: false,
        date: 날짜.date(),
        day: 날짜.day(),
        month: 날짜.month() + 1,
        year: 날짜.year(),
      });
    }

    const cloneCalendar = { ...calendar };
    cloneCalendar.list = 날짜들;

    setCalendar(cloneCalendar);
  };

  const 키워드로검색 = async () => {
    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/search",
        params: { search },
      }).then((response) => {
        setMatchList(response.data);
      });
    } else {
      await axios({
        url: "http://localhost:4000/search",
        params: { search },
      }).then((response) => {
        setMatchList(response.data);
      });
    }
  };

  const 데이터변경 = (event) => {
    setSearch(event.target.value);
  };

  const 클릭한날짜경기목록 = async (item) => {
    const 날짜 = `${item.year}${
      item.month < 10 ? `0${item.month}` : item.month
    }${item.date < 10 ? `0${item.date}` : item.date}`;

    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/search/click",
        params: { 날짜 },
      }).then((response) => {
        setMatchList(response.data);
      });
    } else {
      await axios({
        url: "http://localhost:4000/search/click",
        params: { 날짜 },
      }).then((response) => {
        setMatchList(response.data);
      });
    }
  };

  const 전체목록보여주기 = async () => {
    if (process.env.NODE_ENV === "production") {
      await axios({
        url: "http://3.38.255.11:4000/match",
      }).then(({ data }) => {
        setMatchList(data.matchList);
      });
    } else {
      await axios({
        url: "http://localhost:4000/match",
      }).then(({ data }) => {
        setMatchList(data.matchList);
      });
    }
  };

  React.useEffect(() => {
    현재시간가져오기();
    매치목록가져오기();
    setLoading(false);
  }, []);

  SwiperCore.use([Navigation]);

  if (loading) {
    return <div className="loading">로딩중...</div>;
  }

  return (
    <div className="container">
      <Navbar
        myProfile={마이페이지로이동}
        keywordSearch={키워드로검색}
        setData={데이터변경}
      />

      <div className="sliderContainer">
        <div className="sliderBox">
          <Carousel />
        </div>
      </div>

      {calendar.list.length > 0 && (
        <div className="calenderContainer">
          <div className="calenderWrap">
            <button className="swiper-button-prev" ref={navigationPrevRef}>
              ←
            </button>
            <Swiper
              spaceBetween={50}
              slidesPerView={7}
              pagination={{ clickable: true }}
              onSwiper={(swiper) => {}}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
            >
              {calendar.list.map((item, index) => {
                const activeClass = item.active ? "active-calendar" : "";
                const 요일 = getDayOfWeek(item.day);

                return (
                  <SwiperSlide
                    onClick={() => {
                      const cloneCalendar = { ...calendar };
                      cloneCalendar.list = cloneCalendar.list.map(
                        (item, _index) => {
                          item.active = index === _index && !item.active;
                          index === _index &&
                            item.active &&
                            클릭한날짜경기목록(item);
                          index === _index &&
                            item.active === false &&
                            전체목록보여주기();
                          return item;
                        }
                      );
                      setCalendar(cloneCalendar);
                    }}
                    className={`dateWrap ${activeClass}`}
                    key={`calender-${index}`}
                  >
                    <p>{item.date}</p>
                    <span>{요일}</span>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <button className="swiper-button-next" ref={navigationNextRef}>
              →
            </button>
          </div>
        </div>
      )}

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
