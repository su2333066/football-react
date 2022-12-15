const express = require("express");
const cors = require("cors");
const session = require("express-session");

// ================== DB연결 수행 전 라이브러리 호출 ========================
const mysql = require("mysql2");
const db = mysql.createPoolCluster();
// ================== DB연결 수행 전 라이브러리 호출 ========================

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

db.add("article_project", {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "",
  port: 3306,
});

// function 디비실행(query) {
//   return new Promise(function (resolve, reject) {
//     db.getConnection("", function (error, connection) {
//       if (error) {
//         console.log("디비 연결 오류", error);
//         reject(true);
//       }

//       connection.query(query, function (error, data) {
//         if (error) {
//           console.log("쿼리 오류", error);
//           reject(true);
//         }

//         resolve(data);
//       });

//       connection.release();
//     });
//   });
// }

app.listen(port, () => {
  console.log("서버가 시작되었습니다");
});
