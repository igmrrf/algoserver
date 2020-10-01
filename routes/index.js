const router = require("express").Router();

router.get("/", (req, res) => {
  res.send({
    title: "Forbidden",
    message: "You attempted to access restricted content",
  });
});

module.exports = router;
