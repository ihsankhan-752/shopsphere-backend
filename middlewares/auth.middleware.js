import jwt from "jsonwebtoken";
import db from "../db/index.js";
import { blackListTokenTable } from "../db/schema/blacklist.token.schema.js";
import { eq } from "drizzle-orm";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Auth Header Missing" });
  }

  if (!authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Header must be starts with Bearer" });
  }

  const token = authHeader.split(" ")[1];

  const [blacklisted] = await db
    .select()
    .from(blackListTokenTable)
    .where(eq(blackListTokenTable.token, token));

  if (blacklisted) {
    return res.status(401).json({
      message: "Token is invalid (logged out)",
    });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or Expire Token" });
  }
};
