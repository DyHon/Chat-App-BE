const { addMessage, getAllMessage, seenMessage } = require("../controllers/messagesController");


const router = require("express").Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessage);
router.post("/seen", seenMessage);

module.exports = router;