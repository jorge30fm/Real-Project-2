const router = require('express').Router();
const sequelise = require('../config/connection');
const{ Post, User} = require('../models');

router.get('/', (req, res) => {
        console.log('>>>>>>>>>>>>>>>>>>>>');
        Post.findAll({
                attributes: [
                        'id',
                        'title',
                        'post_text',
                        'image',
                        'created_at'
                ],
                include: [
                        {model: User,
                        attributes: ['username']}
                ]
        })
        .then(dbPostData => {
                const posts = dbPostData.map(post => post.get({ plain: true}));
                res.render('homepage', {
                        posts,
                        loggedIn: req.session.loggedIn
                });
        }).catch(err => {
                console.log(err);
                res.status(500).json(err);
        });
});

router.get('/post/:id', (req, res) => {
        Post.findOne({
                where: {
                        id: req.params.id
                },
                attributes: [
                        'id',
                        'title',
                        'post_text',
                        'image',
                        'created_at'
                ],
                include: [
                        {model: User,
                        attributes: ['username']}
                ]
        })
        .then(dbPostData => {
                if (!dbPostData) {
                        res.status(404).json({message: 'No post found with this id'});
                        return;
                }
                const post = dbPostData.get({plain: true});
                res.render('single-post', {
                        post,
                        loggedIn: req.session.loggedIn
                });
        })
        .catch(err => {
                console.log(err);
                res.status(500).json(err);
        });
});

//redirect to homepage after login
router.get("/login", (req, res) => {
        if (req.session.loggedIn) {
          res.redirect("/");
          return;
        }
        res.render("login");
      });
      
      // if not logged in, direct to signup page
      router.get("/signup", (req, res) => {
        if (req.session.loggedIn) {
          res.redirect("/");
          return;
        }
        res.render("signup");
      });
      
      module.exports = router;