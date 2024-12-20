// Written by Kyeoung Woon Park https://github.com/kyeoungwoon

// npm 패키지 import
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
// const https = require("https"); // https를 사용해야 하는 경우 사용하면 됩니다.
const http = require("http");
// 로컬 파일들 import, 기능별로 구분해주세요.
const logger = require("./logger");
const { corsOptions, sslOptions } = require("./options");

const ENV = process.env.NODE_ENV || "development"; // false 부분에 추후 정리
const { PORT } = require("./config.json")[ENV];

const { AccessTokenStrategy } = require("./passport.setup");
const { errorHandler } = require("./handlers/req.res.handlers");

// Routers는 이 주석 아래에 import 해주시면 됩니다.

// ** 중요 ** 미들웨어 순서를 변경할 때는 신경써서 작업해 주세요.
const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport 초기화
app.use(passport.initialize());
// Passport Strategy 설정
passport.use("accessToken", AccessTokenStrategy);

// 이 주석 하단에 Router들을 use 해주시면 됩니다.
// ex) app.use("/example", exampleRouter);

// 에러 핸들러는 최하단에 위치해야 하는 미들웨어입니다. 절대 순서를 변경하지 마세요.
app.use(errorHandler);

// http, https 사용하실 프로토콜에 맞추어 주석 해제하고 사용하시면 됩니다.
// const server = https.createServer(sslOptions, app);
const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server is running on PORT ${PORT}`);
});

const io = new Server(server, {
  cors: corsOptions,
  // CORS option은 HTTP 서버와 공유합니다.
  // 따로 설정하시려면 다시 작성하시면 됩니다.
  cookie: true,
});

// 하단에 Socket.io Router를 추가하면 됩니다.
// ex) exapmpleSocketRouter(io);
