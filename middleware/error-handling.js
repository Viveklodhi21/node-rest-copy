// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // setDefault
    statusCode: err.statusCode || Statuscodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrongtry again later",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }
  if (err.name === "CasteError") {
    `No item found with id: ${err.value}`;

    customError.statusCode = 404;
  }
  if (err.code && err.code == 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  // return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
