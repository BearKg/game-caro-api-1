const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  CustomAPIError,
} = require("../errors");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const user = await User.register({ ...req.body });
  const token = User.createJWT(user[0].ID, user[0].USERNAME, false);
  return res.status(StatusCodes.CREATED).json({
    User: {
      id: user[0].ID,
      username: user[0].USERNAME,
    },
    token,
  });
};

const loginController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    throw new BadRequestError("Please provide username and password!");

  const user = await User.login(username, password);

  if (user[0]) {
    const token = User.createJWT(user[0].ID, user[0].username, false);
    req.session.token = token;
    res.cookie("token", token, { maxAge: 1000 * 60 * 60, httpOnly: true });
    return res.status(StatusCodes.CREATED).json({
      User: {
        id: user[0].ID,
        username: user[0].USERNAME,
      },
      token,
    });
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "password or username is wrong!" });
  }
};

const loginControllerForAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ msg: "Please provide both username and password!" });
  }

  await User.login(username, password)
    .then((response) => {
      const user = response[0];
      const token = User.createJWT(user.ID, user.username, user.ADMIN);
      req.session.token = token;
      res.cookie("token", token, { maxAge: 1000 * 60 * 60, httpOnly: true });
      return res.status(StatusCodes.CREATED).send({
        User: {
          id: user.ID,
          username: user.USERNAME,
        },
        token,
      });
    })
    .catch((err) => {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: "password or username is wrong!" });
    });
};

const logoutController = (req, res) => {
  res.cookie("newtoken", null, {
    expires: new Date(Date.now()),
  });
  res.status(201).send({ msg: "Log out successfully!", token: res.cookie });
};

module.exports = {
  loginController,
  registerController,
  loginControllerForAdmin,
  logoutController,
};
