const router = require("express").Router();
const { Post, User } = require("../../models");
const withAuth = require("../../utils/auth");
const cloudinary = require("../../utils/cloudinary");

// get all posts from a user
router.get("/", (req, res) => {
  Post.findAll({
    order: [["created_at", "DESC"]],
    attributes: ["id", "post_text", "title", "image", "created_at"],
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

//get single post from a user
router.get("/:id", (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: [
        "id",
        "post_text",
        "title",
        "image",
        "created_at",
      ],
      include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
    })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
        }
        res.json(dbPostData);
      })
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
      image: result.secure_url
    })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  //update a Post
router.put("/:id", withAuth, (req, res) => {

    const result = cloudinary.uploader.upload(image, {
        folder: 'posts',
    })
    Post.update(
      {
        title: req.body.title,
        post_text: req.body.post_text,
        image: result.secure_url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  //delete a post
router.delete("/:id", withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;