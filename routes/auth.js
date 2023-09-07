const router = require("express").Router();//server.jsで使えるようになる。
const { PrismaClient } = require("@prisma/client");//このパッケージを利用することでfindemanyなどが使えるようになる
const bcrypt = require("bcrypt")//ハッシュ化するためのimpiort
const jwt = require("jsonwebtoken"); //tokenを発行するために行うもの。tokenは、ログインできた後に発行されるもの
const generateIdenticon = require("../utils/generateIdenticon");




const prisma = new PrismaClient();//インポートしたPrismaClientを実際にこのコードを書くことで使えるよ



router.post("/register",async(req,res)=>{
  
    const {username,email,password} = req.body; //reqのbodyはjson形式で送られたbody

    const hashedPassword  = await bcrypt.hash(password,10);
    
    const defaultIconImage = generateIdenticon(email);
    const user = await prisma.user.create({
        data:{
            username,
            email,
            password:hashedPassword,
            profile:{
                create:{
                bio:"はじめまして",
                profileImageUrl:defaultIconImage,
                },
            },
            include:{
                profile:true,
            }
        },
    }
    );
    return res.json({user});

})

//ユーザログイン
router.post("/login",async(req,res)=>{
   
    const {email,password} = req.body;

    const user = await prisma.user.findUnique({
        where:{
            email
        }
    });
   
    if(!user){
       
        return res.status(401).json({erorr:"メールアドレスかパスワードが間違っています。"});//userが居なかったらjsonでeror返す。
    }

    const isPasswordVaild = await bcrypt.compare(password,user.password);//password比較
    if(!isPasswordVaild){
     
        return res.status(401).json({erorr:"パスワードが間違っています。"});
        
    }

    const token = jwt.sign({id:user.id},process.env.SECRET_KEY,{expiresIn:"1d"});//1引数：どれをトークン化していくか、第２引数：秘密鍵（サーバ側が持っている）
    //第３引数：有効期限　//SECRET_KEYは、盗まれ内容にenvファイルに書き込む
    return res.json({token});

});
module.exports = router;