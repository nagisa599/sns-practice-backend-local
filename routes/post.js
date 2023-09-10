const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//投稿用api
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body; 
  //console.log(content);
  if (!content) {//もし投稿内容がなかったら
    //console.log(req.userId);
    return res.status(400).json({ message: "投稿内容がありません" });
  }
 
  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: req.userId,//だれが投稿したのか
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
   
    res.status(201).json(newPost);//newpostを貸す。
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

//最新呟き取得用API
router.get("/get_latest_post", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10, //10件
      orderBy: { createdAt: "desc" },//最新順
      include: {
      author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.json(latestPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

//その閲覧しているユーザーの投稿内容だけを取得
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });

    return res.status(200).json(userPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

module.exports = router