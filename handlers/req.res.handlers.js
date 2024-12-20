const logger = require("../logger");

const responseHandler = (req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({
    errorCode = "UNHANDLED_ERROR",
    reason = null,
    data = null,
  }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    logger.error(
      "이미 응답이 전송된 요청에 대해 에러 핸들러가 호출되었습니다."
    );
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
};

module.exports = {
  responseHandler,
  errorHandler,
};
