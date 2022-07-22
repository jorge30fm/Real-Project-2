const { Post } = require("../models");

const postdata = [
	{
		title: "Post 1",
		post_text: "Sample Post 1",
		user_id: 1,
	},
	{
		title: "Post 2",
		post_text: "Sample Post 2",
		user_id: 1,
		image: "https://www.medicalnewstoday.com/articles/322868",
	},
	{
		title: "Post 3",
		post_text: "Sample Post 3",
		user_id: 2,
	},
	{
		title: "Post 4",
		post_text: "Sample Post 4",
		user_id: 3,
	},
	{
		title: "Post 5",
		post_text: "Sample Post 5",
		user_id: 4,
	},
];
const seedPosts = () => Post.bulkCreate(postdata);
module.exports = seedPosts;
