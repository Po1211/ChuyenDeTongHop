const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

/* ===== Multer config ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/covers");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + file.fieldname + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  },
});

/* ===== Upload endpoint ===== */
router.post("/cover", auth, adminOnly, upload.single("cover"), (req, res) => {
  res.json({
    url: `/covers/${req.file.filename}`,
  });
});

module.exports = router;
