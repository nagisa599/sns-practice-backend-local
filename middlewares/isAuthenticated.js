const jwt = require("jsonwebtoken");
//tokenがあるかないかを確認するmiddleware
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];//配列の0番目にbear,配列の１番目にtoken
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "権限がありません。" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {//verify-token化したものをidに戻す
    if (err) {
      return res.status(401).json({ message: "権限がありません。" });
    }

    req.userId = decoded.id;

    next();
  });
}

module.exports = isAuthenticated;