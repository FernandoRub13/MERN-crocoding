const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

var jwtSecret = "mysecrettoken";

//@route POST /users
//@desc Register user
//@access Public
router.post(
  "/",
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //se if the user exists
      let user = await User.findOne({ email });

      if (user) {
         res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      user = new User({
        name,
        email,
        password,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //return Json web token(JWT)
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error("error", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//@route GET /users/auth
//@desc Get user by token/ Loading user
//@access Private
router.get("/auth", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Internal Server Error");
  }
});
//@route POST /users/auth
//@desc Authentication user and get token/Login user
//@access Public
router.post("/auth", [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
],
async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //se if the user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
        .status(400)
        .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        return res.status(400).json({ errors: [{ msg: "Invalid credendiatls" }] });
      }
      //return Json web token(JWT)
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error("error", error.message);
      res.status(500).send("Internal Server Error");
    }
}
);

module.exports = router;
