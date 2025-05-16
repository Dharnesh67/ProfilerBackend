const express = require("express");
const {
  signup,
  signin,
  googleSignIn,
  googleSignUp,
  deleteUser,
  findUser,
  findUserByemail,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.post("/signin/google", googleSignIn);
router.post("/signup/google", googleSignUp);

router.delete("/:userId", deleteUser);
// router.get("/:userId", findUser);

router.get("/findbyemail", findUserByemail);


module.exports = router;
