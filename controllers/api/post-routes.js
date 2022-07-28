const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const { Post, User } = require("../../models");
const withAuth = require("../../utils/auth");

// const multer = require("../../utils/multer");

const cloudinaryConfig = cloudinary.config({
	cloud_name: 'degnyzbus',
	api_key: '523429575836714',
	api_secret: 'zTKZf16B_4OxxKbmS6Km-9uGdzk',
	secure: true,
});

router.get("/get-signature", (req, res) => {
	const timestamp = Math.round(new Date().getTime() / 1000);
	const signature = cloudinary.utils.api_sign_request(
		{
			timestamp: timestamp,
		},
		cloudinaryConfig.api_secret
	);
	res.json({ timestamp, signature })
});

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
		attributes: ["id", "post_text", "title", "image", "created_at"],
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
router.post("/", (req, res) => {
	//based on public_id and version (maybe malicious) that user is submitting, combine those values along with our SECRET key to see what we would expect the signature to be if it was valid and coming from cloudinary
	const expectedSignature = cloudinary.utils.api_sign_request(
		{ public_id: req.body.public_id, version: req.body.version },
		cloudinaryConfig.api_secret
	);
	//can trust visitor data iftheir signature is as we would expect, since without secret they can not know what the signature should be
	if (expectedSignature === req.body.signature) {
		Post.create({
			title: req.body.title,
			post_text: req.body.post_text,
			user_id: req.session.user_id,
			image: req.body.public_id,
		})
			.then((dbPostData) => res.json(dbPostData))
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	}
});

//update a Post
router.put("/:id", withAuth, (req, res) => {
	//>>>>>>>>>>>>>>
	Post.update(
		{
			title: req.body.title,
			post_text: req.body.post_text,
			image: req.body.image,
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
