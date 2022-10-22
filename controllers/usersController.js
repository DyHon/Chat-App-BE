const User = require("../models/userModel");
const bcrypt = require('bcrypt');

module.exports.register = async(req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email, username, password: hashedPassword
    });
    const user = await User.findOne({ username }).lean();
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();
    if (!user)
      return res.json({ msg: "Wrong username or password.", status: false });
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res.json({ msg: "Wrong username or password.", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setavatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage
    });
    const newUserData = await User.findById(userId);
    return res.json({ isSet: newUserData.isAvatarImageSet, image: newUserData.avatarImage });
  } catch (ex) {
    next(ex)
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id"
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex)
  }
};

