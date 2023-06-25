const express = require("express");

const authController = require("../../controllers/auth-controller");

const {
  userRegisterSchema,
  userSubscrUpdateSchema,
  userEmailSchema,
} = require("../../schemas");

const { validateBody } = require("../../decorators");

const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  validateBody(userRegisterSchema),
  authController.register
);

router.post("/login", validateBody(userRegisterSchema), authController.login);

router.get("/verify/:verificationToken", authController.verify);

router.post(
  "/verify",
  validateBody(userEmailSchema),
  authController.resendVerify
);

router.post("/logout", authenticate, authController.logout);

router.get("/current", authenticate, authController.getCurrent);

router.patch(
  "/",
  validateBody(userSubscrUpdateSchema),
  authenticate,
  authController.updateSubscr
);

router.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authController.updateAvatar
);

module.exports = router;
