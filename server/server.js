const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mysql = require("mysql2");

const db = mysql.createPoolCluster();

const cron = require("node-cron");

const app = express();

const port = 4000;

app.use(express.json());
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

db.add("football_project", {
  host: "3.38.255.11",
  user: "root2",
  password: "@!Asd5653@!",
  database: "football_project",
  port: 3306,
});

function 디비실행(query) {
  return new Promise(function (resolve, reject) {
    db.getConnection("football_project", function (error, connection) {
      if (error) {
        console.log("디비 연결 오류", error);
        reject(true);
      }

      connection.query(query, function (error, data) {
        if (error) {
          console.log("쿼리 오류", error);
          reject(true);
        }

        resolve(data);
      });

      connection.release();
    });
  });
}

cron.schedule("0 */6 * * *", async function () {
  console.log("6시간 마다 작업 실행");

  const 자동매치목록 = await 디비실행(
    `SELECT * FROM matching WHERE matchtry = 'NO' AND attend_user_seq != ''`
  );

  if (자동매치목록.length === 0) {
    return;
  }

  for (let key in 자동매치목록) {
    const 자동매치값 = 자동매치목록[key];
    const 방레벨 = 자동매치값.level;
    const 방번호 = 자동매치값.seq;

    const 참여자번호 = 자동매치값.attend_user_seq
      .split("/")
      .filter((item) => {
        return item !== "";
      })
      .join("','");

    const 참여자들 = await 디비실행(
      `SELECT * FROM user WHERE seq IN ('${참여자번호}')`
    );

    let 최솟값 = Number.MAX_SAFE_INTEGER;
    let 최종선택자 = {};

    참여자들.forEach((item) => {
      const 근사값 = Math.abs(방레벨 - item.level);

      if (근사값 < 최솟값) {
        최솟값 = 근사값;
        최종선택자 = item;
      }
    });

    const 최종선택자유저번호 = 최종선택자.seq;

    console.log(최종선택자유저번호);

    const query = `UPDATE matching SET match_user_seq='${최종선택자유저번호}' WHERE seq='${방번호}'`;
    await 디비실행(query);
  }
});

/**
 * 마감처리 (1시간마다 실행 시킬거임)
 */
cron.schedule("0 */1 * * *", async function () {
  console.log("1시간 마다 작업 실행 :", new Date().toString());

  const 마감매칭목록 = await 디비실행(
    `SELECT * , DATEDIFF(matchtime, NOW()) as date_diff FROM matching WHERE DATEDIFF(matchtime, NOW()) < 2`
  );

  if (마감매칭목록.length === 0) {
    return;
  }

  for (let key in 마감매칭목록) {
    const 마감매칭값 = 마감매칭목록[key];

    let matchtry = "DEL";

    if (마감매칭값.date_diff == 1) {
      matchtry = "NO";
    }

    const query = `UPDATE matching SET matchtry='${matchtry}' WHERE seq='${마감매칭값.seq}'`;
    await 디비실행(query);
  }
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/detail", async (req, res) => {
  const { seq } = req.query;
  const data = await 디비실행(
    `SELECT seq, place, link, memo, LEVEL, matchtry, DATE_FORMAT(matchtime, '%Y%m%d') AS matchday, DATE_FORMAT(matchtime, '%H%i') AS matchhour, regdate, updatedate, user_seq, attend_user_seq, match_user_seq FROM matching WHERE seq = '${seq}'`
  );
  res.send(data[0]);
});

app.post("/autoLogin", (req, res) => {
  res.send(req.session.loginUser);
});

app.post("/login", async (req, res) => {
  const { id, pw } = req.body;

  const result = {
    code: "success",
    message: "로그인 되었습니다",
  };

  if (id === "") {
    result.code = "fail";
    result.message = "아이디를 입력해주세요";
  }

  if (pw === "") {
    result.code = "fail";
    result.message = "비밀번호를 입력해주세요";
  }

  const user = await 디비실행(
    `SELECT * FROM user WHERE id='${id}' AND password = '${pw}'`
  );

  if (user.length === 0) {
    result.code = "fail";
    result.message = "아이디가 존재하지 않습니다";
  }

  if (result.code === "fail") {
    res.send(result);
    return;
  }

  req.session.loginUser = user[0];
  req.session.save();

  res.send(result);
});

app.post("/join", async (req, res) => {
  const { id, name, level, pw } = req.body;

  const result = {
    code: "success",
    message: "회원가입 되었습니다",
  };

  if (id === "") {
    result.code = "fail";
    result.message = "아이디를 입력해주세요";
  }

  if (pw === "") {
    result.code = "fail";
    result.message = "비밀번호를 입력해주세요";
  }

  const user = await 디비실행(`SELECT * FROM user WHERE id='${id}'`);

  if (user.length > 0) {
    result.code = "fail";
    result.message = "이미 동일한 아이디가 존재합니다";
  }

  if (result.code === "fail") {
    res.send(result);
    return;
  }

  await 디비실행(
    `INSERT INTO user(id,password,name,level) VALUES('${id}','${pw}','${name}','${level}')`
  );

  res.send(result);
});

app.get("/match", async (req, res) => {
  const { loginUser } = req.session;

  if (loginUser === undefined) {
    return;
  }

  const query = `SELECT seq, place, link, memo, LEVEL, matchtry, DATE_FORMAT(matchtime, '%Y%m%d') AS matchday, DATE_FORMAT(matchtime, '%H%i') AS matchhour, regdate, updatedate, user_seq, attend_user_seq, match_user_seq, DATEDIFF(matchtime, NOW()) AS date_diff FROM matching WHERE matchtime > NOW() AND user_seq != '${loginUser.seq}'ORDER BY matchtime DESC`;

  const 날짜차이 = await 디비실행(
    "SELECT DATEDIFF((SELECT matchtime FROM matching WHERE matchtry = 'YES' ORDER BY matchtime DESC LIMIT 1),(SELECT matchtime FROM matching WHERE matchtry = 'YES' ORDER BY matchtime ASC LIMIT 1)) AS diff_date , DATE_FORMAT(matchtime, '%Y-%m-%d') AS DATE FROM matching WHERE matchtry = 'YES' ORDER BY matchtime ASC LIMIT 1;"
  );

  const matchList = await 디비실행(query);
  res.send({
    matchList: matchList,
    diff_date: 날짜차이[0],
  });
});

// Profile
app.get("/success", async (req, res) => {
  const { loginUser } = req.session;

  if (loginUser === undefined) {
    return;
  }

  const query = `SELECT seq, place, link, memo, LEVEL, DATE_FORMAT(matchtime, '%Y-%m-%d') AS matchday, DATE_FORMAT(matchtime, '%H:%i') AS matchhour FROM matching WHERE match_user_seq = ${loginUser.seq}`;

  const matchList = await 디비실행(query);

  if (matchList.length === 0) {
    return;
  }

  res.send({ matchList });
});

/**
 * 신청하기
 */
app.post("/match/apply", async (req, res) => {
  const { seq } = req.body;
  const {
    loginUser: { seq: loginUserSeq = "1" },
  } = req.session;
  const result = {
    code: "success",
    message: "신청되었습니다",
  };

  let [{ attend_user_seq = "" }] = await 디비실행(
    `SELECT * FROM matching WHERE seq = '${seq}'`
  );

  if (attend_user_seq !== "") {
    const 참여자번호 = attend_user_seq
      .split("/")
      .filter((item) => {
        return item !== "";
      })
      .join("','");

    if (참여자번호.includes(loginUserSeq)) {
      result.code = "fail";
      result.message = "이미 신청하였습니다";
      res.send(result);
      return;
    }
  }

  let new_attend_user_seq = `${attend_user_seq}${loginUserSeq}/`;
  const query = `UPDATE matching SET attend_user_seq='${new_attend_user_seq}' WHERE seq='${seq}'`;

  await 디비실행(query);

  res.send(result);
});

app.post("/match", async (req, res) => {
  const { place, link, matchtime, memo, level } = req.body;
  const { loginUser } = req.session;

  const result = {
    code: "success",
    message: "매치가 등록 되었습니다",
  };

  if (place === "") {
    result.code = "fail";
    result.message = "풋살장 위치를 입력해주세요";
  }

  if (link === "") {
    result.code = "fail";
    result.message = "링크를 입력해주세요";
  }

  if (matchtime === "") {
    result.code = "fail";
    result.message = "경기 날짜를 입력해주세요";
  }

  if (result.code === "fail") {
    res.send(result);
    return;
  }

  await 디비실행(
    `INSERT INTO matching(place,link,matchtime,memo,level,user_seq) VALUES('${place}','${link}','${matchtime}','${memo}','${level}','${loginUser.seq}')`
  );

  res.send(result);
});

app.get("/search", async (req, res) => {
  const { search } = req.query;
  const { loginUser } = req.session;

  const query = `SELECT seq, place, link, memo, LEVEL, matchtry, DATE_FORMAT(matchtime, '%Y%m%d') AS matchday, DATE_FORMAT(matchtime, '%H%i') AS matchhour, regdate, updatedate, user_seq, attend_user_seq, match_user_seq, DATEDIFF(matchtime, NOW()) AS date_diff FROM matching WHERE matchtime > NOW() AND matching.place LIKE '%${search}%' AND user_seq != '${loginUser.seq}'ORDER BY matchtime DESC`;

  const matchList = await 디비실행(query);
  res.send(matchList);
});

app.get("/search/click", async (req, res) => {
  const { 날짜 } = req.query;
  const { loginUser } = req.session;

  const query = `SELECT seq, place, link, memo, LEVEL, matchtry, DATE_FORMAT(matchtime, '%Y%m%d') AS matchday, DATE_FORMAT(matchtime, '%H%i') AS matchhour, regdate, updatedate, user_seq, attend_user_seq, match_user_seq, DATEDIFF(matchtime, NOW()) AS date_diff FROM matching WHERE DATE_FORMAT(matchtime, '%Y%m%d') = '${날짜}' AND user_seq != '${loginUser.seq}'ORDER BY matchtime DESC`;

  const matchList = await 디비실행(query);
  res.send(matchList);
});

app.listen(port, () => {
  console.log("서버가 실행되었습니다");
});
