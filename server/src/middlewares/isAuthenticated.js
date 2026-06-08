import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Bearer token check validation
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing or invalid format structure",
      });
    }

    const token = authHeader.split(" ")[1];

    // Env configuration check protection
    if (!process.env.JWT_ACCESS_TOKEN) {
      console.error("🚨 CRITICAL ENV ERROR: JWT_ACCESS_TOKEN configuration missing!");
      return res.status(500).json({
        success: false,
        message: "Internal server security configuration error",
      });
    }

    // Decode execution thread validation
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

    // Schema payload tracking parameter inject karo
    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    // Catch block global logging stream pipeline
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid authorization token credentials",
    });
  }
};

export default isAuthenticated;