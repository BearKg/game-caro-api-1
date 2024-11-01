const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
  const users = await User.getAllUsers();
  return res.status(StatusCodes.OK).json({ users });
};

const getUserByToken = async (req, res) => {
  const { userId } = req.user;
  const user = await User.getUserById(userId);
  return res.status(StatusCodes.OK).json({ user });
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.getUserById(userId);
  return res.status(StatusCodes.OK).json({ user });
};

const createUser = async (req, res) => {
  const user = await User.createUser(req.body);
  return res
    .status(StatusCodes.OK)
    .json({ record_inserted: user.affectedRows });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.updateUserById(id, req.body);
  return res.status(StatusCodes.OK).json({ record_updated: user.affectedRows });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.deleteUser(id);
  return res.status(StatusCodes.OK).json({ record_deleted: user.affectedRows });
};

const updateInfo = async (req, res) => {
  const { userId } = req.user;
  const user = await User.updateInfo(userId, req.body);
  return res.status(StatusCodes.OK).json({ record_updated: user.affectedRows });
};

const changePassword = async (req, res) => {
  const { userId } = req.user;
  const user = await User.changePassword(userId, req.body);
  return res.status(StatusCodes.OK).json({ record_updated: user.affectedRows });
};

const updateAllScore = async (req, res) => {
  const response = await User.updateAllScore();
  return res
    .status(StatusCodes.OK)
    .json({ record_updated: response.affectedRows });
};
const changeName = async (req, res) => {
  const { id } = req.params;
  const user = await User.changeName(id, req.body);
  return res.status(StatusCodes.OK).json({ record_updated: user.affectedRows });
};
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateInfo,
  changePassword,
  updateAllScore,
  getUserByToken,
  changeName,
};
