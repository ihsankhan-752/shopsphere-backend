import db from "../db/index.js";
import { usersTable } from "../db/schema/user.schema.js";
import {
  authLoginValidation,
  authSignUpValidation,
} from "../validations/auth.validation.js";
import { randomBytes, createHmac } from "node:crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { blackListTokenTable } from "../db/schema/blacklist.token.schema.js";

export const userSignUp = async (req, res) => {
  const validatationRes = await authSignUpValidation.safeParseAsync(req.body);

  if (!validatationRes.success) {
    const error = z.treeifyError(validatationRes.error);
    return res.status(400).json({ error: error });
  }

  const { name, email, password } = validatationRes.data;

  const [existingUser] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser) {
    return res
      .status(409)
      .json({ error: `User with this email ${email} already exist` });
  }

  const salt = randomBytes(32).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id, role: usersTable.role });

  return res.status(201).json({ message: "User Created", role: user.role });
};

export const userLogin = async (req, res) => {
  const validationRes = await authLoginValidation.safeParseAsync(req.body);

  if (!validationRes.success) {
    const error = z.treeifyError(validationRes.error);
    return res.status(400).json({ error: error });
  }

  const { email, password } = validationRes.data;

  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      role: usersTable.role,
      password: usersTable.password,
      salt: usersTable.salt,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!existingUser) {
    return res
      .status(409)
      .json({ error: `User with this email ${email} did not exist` });
  }

  const salt = existingUser.salt;
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (existingUser.password !== hashedPassword) {
    return res.status(401).json({ error: "Incorrect Password" });
  }

  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.status(200).json({ token: token, id: existingUser.id });
};

export const getCurrentUser = async (req, res) => {
  try {
    const [currentUser] = await db
      .select({
        email: usersTable.email,
        name: usersTable.name,
      })
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));

    return res.status(200).json({ success: true, data: currentUser });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

export const logOut = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No Token Provided" });
    }

    await db.insert(blackListTokenTable).values({ token });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
