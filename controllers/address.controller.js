import { and, eq } from "drizzle-orm";
import db from "../db/index.js";
import { addressTable } from "../db/schema/address.schema.js";
import { addressValidation } from "../validations/address.validation.js";
import { success, z } from "zod";
import { usersTable } from "../db/schema/user.schema.js";

export const addAddress = async (req, res) => {
  try {
    const validateAddress = addressValidation.safeParse(req.body);

    if (!validateAddress.success) {
      const error = z.treeifyError(validateAddress.error);
      return res.status(400).json({ success: false, error });
    }

    const { phoneNumber, address, buildingName, roomNumber, city } =
      validateAddress.data;

    const userId = req.user.id;

    const [result] = await db
      .insert(addressTable)
      .values({
        phoneNumber,
        address,
        buildingName,
        roomNumber,
        city,
        userId,
      })
      .returning({ id: addressTable.id });

    return res
      .status(201)
      .json({ success: true, message: "Address Added", id: result.id });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const myAddresses = async (req, res) => {
  try {
    const addresses = await db
      .select({
        id: addressTable.id,

        address: addressTable.address,

        phoneNumber: addressTable.phoneNumber,
        city: addressTable.city,
        buildingName: addressTable.buildingName,
        roomNumber: addressTable.roomNumber,
      })
      .from(addressTable)
      .where(eq(addressTable.userId, req.user.id));

    if (addresses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Address Found" });
    }

    return res.status(200).json({ success: true, addresses });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    const validateAddress = addressValidation.safeParse(req.body);
    if (!validateAddress.success) {
      const error = z.treeifyError(validateAddress.error);
      return res.status(400).json({ success: false, error });
    }

    const [existingAddress] = await db
      .select()
      .from(addressTable)
      .where(
        and(
          eq(addressTable.id, addressId),
          eq(addressTable.userId, req.user.id),
        ),
      );

    if (!existingAddress) {
      return res
        .status(404)
        .json({ success: false, message: "No Address Found" });
    }

    const { phoneNumber, address, buildingName, roomNumber, city } =
      validateAddress.data;

    await db
      .update(addressTable)
      .set({ phoneNumber, address, buildingName, roomNumber, city })
      .where(
        and(
          eq(addressTable.id, addressId),
          eq(addressTable.userId, req.user.id),
        ),
      );

    return res.status(200).json({ success: true, message: "Address Updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    const [result] = await db
      .delete(addressTable)
      .where(
        and(
          eq(addressTable.userId, req.user.id),
          eq(addressTable.id, addressId),
        ),
      )
      .returning();

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "No Address found to delete" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Address Deleted!!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
