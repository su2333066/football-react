const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mysql = require("mysql2");

const db = mysql.createPoolCluster();

// const cron = require("node-cron");

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
  host: "127.0.0.1",
  user: "root",
  password: "",
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

// cron.schedule("* * * * *", function () {
//   console.log("매 분 마다 작업 실행");
// });

// cron.schedule("* * * * * *", function () {
//   console.log("매 초 마다 작업 실행 :", new Date().toString());
// });

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/detail", async (req, res) => {
  const { seq } = req.query;
  const data = await 디비실행(`SELECT * FROM matching WHERE seq = '${seq}'`);
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

app.listen(port, () => {
  console.log("서버가 실행되었습니다");
});
