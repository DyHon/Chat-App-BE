const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
      seen: { type: Boolean, default: false },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageSchema); 