var express = require("express");
var router = express.Router();
const app = express();
var User = require("../models/userModel");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var noteModel = require("../models/noteModel");
let secret = "secret";
router.get("/", function (req, res, next) {
  res.render("index", { title: "Note App" });
});

router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;

  // Check if email already exists
  let emailCondition = await User.findOne({ email });
  if (emailCondition) {
    return res.json({
      success: false,
      message: "Email already exists",
    });
  } else {
    // Hash the password
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          return res.json({
            success: false,
            message: "Error hashing password",
          });
        }

        // Create user
        let user = await User.create({
          name,
          email,
          password: hash,
        });

        // Generate JWT token
        var token = jwt.sign({ email: user.email, userId: user.id }, secret);

        // Respond with success and token
        res.json({
          success: true,
          userId: user.id,
          message: "User registered successfully",
          token: token,
        });
      });
    });
  }
});
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        var token = jwt.sign({ email: user.email, userId: user.id }, secret);
        res.json({
          success: true,
          userId: user.id,
          message: "User logged in successfully",
          token: token,
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid Credentials",
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: "Email don't exists",
    });
  }
});

router.post("/getNotes", async (req, res) => {
  try {
    let notes = await noteModel.find({ uploadedBy: req.body.userId });
    if (notes.length > 0) {
      res.json({
        success: true,
        data: notes,
      });
    } else {
      res.json({
        success: false,
        message: "No Notes Found",
      });
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/addNote", async (req, res) => {
  try {
    let { title, description, content, uploadedBy, isImportant } = req.body;

    // Check if the required fields are provided
    if (!title || !description || !content || !uploadedBy) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Create the note
    let note = await noteModel.create({
      title,
      description,
      content,
      isImportant,
      uploadedBy,
    });

    // Return the success response with note ID
    res.json({
      success: true,
      noteId: note.id,
      userId: uploadedBy,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

router.post("/deleteNote", async (req, res) => {
  try {
    const { noteId } = req.body;

    const note = await noteModel.findOneAndDelete({ _id: noteId });

    if (note) {
      res.json({
        success: true,
        deletedNoteId: noteId,
        message: "Note deleted successfully",
      });
    } else {
      res.json({
        success: false,
        message: "Note not found",
      });
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
});

router.post("/updateNote", async (req, res) => {
  try {
    const { noteId, title, description, content, isImportant } = req.body;

    // Find and update the note
    const updatedNote = await noteModel.findOneAndUpdate(
      { _id: noteId }, // Filter by noteId
      { title, description, content, isImportant }, // Fields to update
      { new: true } // Return the updated document
    );

    if (updatedNote) {
      res.json({
        success: true,
        message: "Note updated successfully",
        updatedNote,
      });
    } else {
      res.json({
        success: false,
        message: "Note not found",
      });
    }
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update note",
    });
  }
});
router.get("/getNote/:noteId", async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await noteModel.findById(noteId); // Replace with your database logic
    if (note) {
      res.json({ success: true, data: note });
    } else {
      res.json({ success: false, message: "Note not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.post("/getUserDetails", async (req, res) => {
  let { userId } = req.body;
  let user = await User.findOne({ _id: userId });
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.json({
      success: false,
      msg: "No User Found !",
    });
  }
});

module.exports = router;
