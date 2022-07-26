const sequelize = require("../config/connection");
const { User, Post } = require("../models");

const userdata = [
  {
    username: "jorgeM",
    email: "jorgeM@gmail.com",
    password: "12345",
  },
  {
    username: "chrisH",
    email: "chrisH@gmail.com",
    password: "12345",
  },
  {
    username: "colinA",
    email: "colinA@gmail.com",
    password: "12345",
  },
  {
    username: "craigH",
    email: "craigHgmail.com",
    password: "12345",
  },
];
const seedUsers = () => User.bulkCreate(userdata, { individualHooks: true });
module.exports = seedUsers;
