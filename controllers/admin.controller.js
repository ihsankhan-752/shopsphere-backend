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

export const adminSignUpController = async (req, res) => {
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
      role: "admin",
    })
    .returning({ id: usersTable.id, role: usersTable.role });

  return res.status(201).json({ message: "Admin Created", role: user.role });
};

export const adminLoginController = async (req, res) => {
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

  return res.status(200).json({ token: token });
};
