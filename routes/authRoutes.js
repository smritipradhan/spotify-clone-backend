const { Router } = require("express");
const authController = require("../controllers/authController");
const { checkUser } = require("../middleware/authGuard");

const router = Router();

router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.get("/user", checkUser, authController.user);
router.get("/logout", authController.logout);

module.exports = router;
