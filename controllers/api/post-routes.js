const router = require("express").Router();
const { Post, User } = require("../../models");
const withAuth = require("../../utils/auth");
const cloudinary = require("../../utils/cloudinary");

// get all posts from a user
router.get("/", (req, res) => {
  Post.findAll({
    order: [["created_at", "DESC"]],
    attributes: ["id", "post_text", "title", "created_at"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});



//Create a new Post
router.post("/", withAuth, (req, res) => {

    const result = cloudinary.uploader.upload(image, {
        folder: 'posts',
    })
    // expects {title, post_text, user_id, optional image upload}
    Post.create({
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      }
    })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;