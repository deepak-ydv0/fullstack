import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  //get token
  //validate token
  //extracte token

  try {
    console.log(req.cookies);
    let token = req.cookies?.token;

    console.log("Token found", token ? "Yes" : " No");

    if (!token) {
      console.log("Token not found");

      return res.status(401).json({
        success: false,
        message: "Authentication faild",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded Data", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("Auth middleware faild", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
  next();
};
