import express from "express";
import {
  createComment,
  deleteComment,
  draftComment,
  editComment,
  getPostComments,
  getcomments,
  likeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "./../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put(
  "/likeComment/:commentId",
  verifyToken,

  likeComment
);
router.put(
  "/editComment/:commentId",
  verifyToken,

  editComment
);
router.delete(
  "/deleteComment/:commentId",
  verifyToken,

  deleteComment
);
router.get("/getcomments", verifyToken, getcomments);
router.post("/comments/draft", verifyToken, draftComment);

export default router;
