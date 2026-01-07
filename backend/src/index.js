require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const profileRoutes = require("./routes/profile");

const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use("/covers", express.static(path.join(__dirname, "../public/covers")));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/mybooks", require("./routes/mybooks"));

app.use("/api/admin/authors", require("./routes/admin/authors"));
app.use("/api/admin/books", require("./routes/admin/books"));
app.use("/api/admin/categories", require("./routes/admin/categories"));

app.use("/api/upload", require("./routes/upload"));

/* ================= START SERVER ================= */
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
