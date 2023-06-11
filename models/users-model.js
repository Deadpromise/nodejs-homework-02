const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");

const {
  emailRegexp,
  starterSubscr,
  proSubscr,
  businessSubscr,
} = require("../constants/users");

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    subscription: {
      type: String,
      enum: [starterSubscr, proSubscr, businessSubscr],
      default: starterSubscr,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = User;
