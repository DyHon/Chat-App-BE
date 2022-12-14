const messageModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: message,
      users: [from, to],
      sender: from,
    });
    if (data) res.json({ msg: "Message add successfully." });
    return res.json({msg: "Failed to add message."})
  } catch (ex) {
    next(ex);
  };
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const getMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        id: msg._id
      };
    });
    res.json(getMessages);
  } catch (ex) {
    next(ex);
  };
};

module.exports.checkUnSeenMessage = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const messages = await messageModel.find( message.seenfalse );
    console.log(messages);
    const from = messages.map((message) => {
      return {
        from: message.sender.toString()
      }
    })
    res.json(from);
  } catch (ex) {
    next(ex);
  };
};

module.exports.seenMessage = async (req, res, next) => {
  try {
    const messageId = req.body.id;
    const msg = req.body.message;
    await messageModel.findByIdAndUpdate(messageId, {
      message: msg
    });
    return res.json({ status: true });
  } catch (ex) {
    next(ex);
  };
};

