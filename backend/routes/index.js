var express = require("express");
var router = express.Router();
const app = express();
var User = require("../models/userModel");
var bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
var noteModel = require("../models/noteModel");
require("dotenv").config();
let secret = "secret";
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
  const { userId } = req.body;
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, msg: "No User Found!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
  fileFilter: fileFilter,
});

router.post("/user/profile-pic", (req, res) => {
  upload.single("profilePic")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ error: err.message });
    }

    // Everything went fine.
    try {
      console.log("Received request for profile picture upload");
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      if (!req.file) {
        console.error("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { userId } = req.body;
      if (!userId) {
        console.error("User ID is missing");
        return res.status(400).json({ error: "User ID is required" });
      }

      const profilePicPath = "uploads/" + req.file.filename;

      console.log("Updating user with ID:", userId);
      console.log("Profile picture path:", profilePicPath);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: profilePicPath },
        { new: true }
      );

      if (!updatedUser) {
        console.error("User not found:", userId);
        return res.status(404).json({ error: "User not found" });
      }

      console.log("User updated successfully:", updatedUser);

      res.json({
        success: true,
        message: "Profile picture uploaded successfully",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Error updating profile picture:", err);
      res.status(500).json({
        success: false,
        error: "Failed to update profile picture",
        details: err.message,
      });
    }
  });
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate JWT as reset token
    const resetToken = jwt.sign(
      { userId: user._id }, // Embed user ID in the token
      secret, // Use a secure secret key
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Save token metadata to the user (optional, for additional security)
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Replace with your email provider
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Error in /forgot-password:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.post("/reset-password/:token", async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secret);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the user and update the password
    const user = await User.findByIdAndUpdate(decoded.userId, {
      password: hashedPassword,
      resetToken: null, // Clear reset token for added security
      resetTokenExpiry: null, // Clear expiry
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found or token expired" });
    }

    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    console.error("Error in password reset:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
