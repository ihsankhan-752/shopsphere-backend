import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Auth Header Missing" });
  }

  if (!authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Header must be starts with Bearer" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or Expire Token" });
  }
};
