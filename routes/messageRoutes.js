const { addMessage, getAllMessage, seenMessage, checkUnSeenMessage } = require("../controllers/messagesController");


const router = require("express").Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessage);
router.post("/seen", seenMessage);
router.get("/unseen/:id", checkUnSeenMessage);

module.exports = router;