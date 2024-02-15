const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email must is provided"], // Custom Error Message
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password must is provided"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// Fire a function before doc saved to DB
userSchema.pre("save", async function (next) {
  // We don't get the doc because it is not yet saved into the Database

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); // Takes two arguement
  console.log("New User will be created !!", this);
  next();
});

// Static Method to Login the User
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password!!");
  }
  throw Error("Incorrect Email!!");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
