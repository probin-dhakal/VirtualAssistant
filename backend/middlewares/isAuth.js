import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Token not found. Unauthorized access.",
      });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId; // assumes your token payload has userId
    next();
  } catch (error) {
    console.log("Error in isAuthenticated middleware", error);
    return res.status(401).json({
      message: "Invalid or expired token. Unauthorized access.",
    });
  }
};

export default isAuthenticated;
