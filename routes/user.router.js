// * /users GET
// * /users/:id GET -> /:id GET
// * /users/:id PATCH -> /Patch
// * /users/:id DELETE -> /DELETE
import express from "express";
import {
  saveUser,
  getUsers,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", saveUser);
router.get("/", getUsers);
router.delete("/:id", deleteUser);

export default router;