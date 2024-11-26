import express from "express";
import db from "../db/config.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//  Alínea 18
// POST /comments: Add a new comment to a book.
router.post("/", async (req, res) => {
    try {
      const book_id = req.body.book_id;
      const user_id = req.body.user_id;
      const comment = req.body.comment;
  
      if (!book_id || !user_id || !comment) {
        const missingFields = [];
        if (!book_id) missingFields.push("book_id");
        if (!user_id) missingFields.push("user_id");
        if (!comment) missingFields.push("comment");
        return res.status(400).send({ error: `Missing fields: ${missingFields.join(", ")}` });
      }
  
      const parsedBookId = parseInt(book_id);
      const parsedUserId = parseInt(user_id);
      if (isNaN(parsedBookId) || isNaN(parsedUserId)) {
        return res.status(400).send({ error: "book_id and user_id must be valid numbers." });
      }
  
      const lastComment = await db.collection("comments").find().sort({ _id: -1 }).limit(1).toArray();
      const newCommentId = lastComment.length > 0 ? lastComment[0]._id + 1 : 1;
  
      const newComment = {
        _id: newCommentId,
        book_id: parsedBookId,
        user_id: parsedUserId,
        comment: comment,
        date: Date.now()
      };
  
      const result = await db.collection("comments").insertOne(newComment);
  
      if (!result || !result.insertedId) {
        return res.status(500).send({ error: "Failed to insert comment." });
      }
  
      res.status(201).send({
        message: "Comment added successfully.",
        comment: newComment
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).send({ error: "An error occurred while adding the comment." });
    }
});

//  Alínea 19
// DELETE /comments/id Remover comentario por ID
router.delete("/:id", async (req, res) => {
    const commentId = parseInt(req.params.id);
  
    try {
        if (isNaN(commentId)) {
            return res.status(400).send({ error: "Invalid comment ID format. Must be a number." });
        }
  
        const result = await db.collection("comments").deleteOne({ _id: commentId });
  
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: "Comment not found." });
        }
  
        res.status(200).send({ message: "Comment deleted successfully." });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).send({ error: "An error occurred while deleting the comment." });
    }
});

export default router;