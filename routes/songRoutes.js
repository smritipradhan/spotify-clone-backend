const { Router } = require("express");
const songController = require("../controllers/songController");

const router = Router();

router.get("/song", songController.song_get);
router.post("/song", songController.song_post);
router.put("/song", songController.song_put);
router.delete("/song", songController.song_delete);

module.exports = router;
