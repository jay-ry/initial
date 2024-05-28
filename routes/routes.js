const express = require("express");
const router = express.Router();
const User = require("../models/users");

// get all users

router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render("index", { title: "Members", members: users });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id);
    if (user == null) {
      res.redirect("/");
    } else {
      res.render("edit", { title: "Edit Member", member: user });
    }
  } catch (err) {
    res.redirect("/");
  }
});

router.post("/update/:id", async (req, res) => {
  let id = req.params.id;
  try {
    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
    });
    req.session.message = {
      type: "success",
      message: "user updated successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// router.get("/delete/:id", (req, res) => {
//   let id = req.params.id;
//   User.findByIdAndDelete(id, (err, result) => {
//     if (err) {
//       res.json({
//         message: err.message,
//       });
//     } else {
//       req.session.message = {
//         type: "info",
//         message: "user deleted successfully",
//       };
//       res.redirect("/");
//     }
//   });
// });

router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    req.session.message = {
      type: "info",
      message: "user deleted successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
    });
    await user.save();
    req.session.message = {
      type: "success",
      message: "user added successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

router.use((req, res) => {
  res.status(404).render("404");
});

router.get("/users", (req, res) => {
  res.send("All users");
});

module.exports = router;
