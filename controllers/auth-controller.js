const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const User = require("../models/users-model");

const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../decorators");

const avatarsDir = path.resolve("public", "avatars");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const defaultAvatarUrl = gravatar.url(email, { s: "250" }, true);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: defaultAvatarUrl,
  });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });
  const currentUser = await User.findById(id);

  res.json({
    token,
    user: { email: currentUser.email, subscription: currentUser.subscription },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json({});
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscr = async (req, res) => {
  const { _id: id, email, subscription } = req.user;
  const { email: newEmail, subscription: newSubscription } = req.body;
  if (newEmail !== email || newSubscription === subscription) {
    throw HttpError(400);
  }
  await User.findByIdAndUpdate(id, { subscription: newSubscription });
  const currentUser = await User.findById(id);
  res.json({
    user: { email: currentUser.email, subscription: currentUser.subscription },
  });
};

const updateAvatar = async (req, res) => {
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsDir, filename);
  await fs.rename(oldPath, newPath);

  const resizedAvatar = await Jimp.read(newPath);
  resizedAvatar.resize(250, 250);
  await resizedAvatar.writeAsync(newPath);

  const avatar = path.join("avatars", filename);
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { avatarURL: avatar });
  res.json({ avatarURL: avatar });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscr: ctrlWrapper(updateSubscr),
  updateAvatar: ctrlWrapper(updateAvatar),
};
