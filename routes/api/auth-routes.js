const express = require("express");

const authController = require("../../controllers/auth-controller");

const { userRegisterSchema, userSubscrUpdateSchema } = require("../../schemas");

const { validateBody } = require("../../decorators");

const { authenticate } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  validateBody(userRegisterSchema),
  authController.register
);

router.post("/login", validateBody(userRegisterSchema), authController.login);

router.post("/logout", authenticate, authController.logout);

router.get("/current", authenticate, authController.getCurrent);

router.patch(
  "/",
  validateBody(userSubscrUpdateSchema),
  authenticate,
  authController.updateSubscr
);

module.exports = router;
