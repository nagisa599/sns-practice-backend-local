
const express = require("express");//Node.jsで利用できるWebアプリケーションフレームワーク
const app = express(); 
const authRoute = require("./routes/auth");//routesファイルのauth.jsが読み込まれた。注意することは、必ずauth.jsはexpress.router()使うこと
const postsRoute = require("./routes/post");
const usersRoute = require("./routes/user");
// const bodyParser = require('body-parser');
const cors =require("cors");//localhost3000（front)からlocalhost5000(backend)に対してapiを叩くとエラーになる
//その許可を解消しなければならないためcorsを入れる。


require("dotenv").config();//processを使うため（envファイルに書き込まれている環境変数の読み込み)

//const port = process.env.PORT||10000;//ポート番号を指定
const port = "5050";


app.use(express.json());
//app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());


app.use("/api/auth",authRoute);
app.use("/api/posts",postsRoute);
app.use("/api/users",usersRoute);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
