import { eq, inArray } from "drizzle-orm";
import db from "../db/index.js";
import { cartTable } from "../db/schema/cart.schema.js";
import { orderItemTable, ordersTable } from "../db/schema/order.schema.js";
import { productsTable } from "../db/schema/product.schema.js";
import { addressTable } from "../db/schema/address.schema.js";
import { success } from "zod";
import { usersTable } from "../db/schema/user.schema.js";
import { sendOrderStatusEmail } from "../services/email.services.js";
import { orderStatusEnum } from "../db/schema/enums.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId, totalAmount, paymentMethod } = req.body;

    if (!addressId || !totalAmount || !paymentMethod) {
      return res.status(400).json({
        message: "totalAmount, addressId and paymentMethod are required",
      });
    }

    const cartProducts = await db
      .select({
        id: cartTable.productId,
        count: cartTable.count,
        price: productsTable.price,
      })
      .from(cartTable)
      .where(eq(cartTable.userId, userId))
      .leftJoin(productsTable, eq(productsTable.id, cartTable.productId));

    if (cartProducts.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No Product Found in Cart" });
    }

    await db.transaction(async (trx) => {
      const [order] = await trx
        .insert(ordersTable)
        .values({
          userId,
          addressId,
          totalAmount,
          paymentMethod,
        })
        .returning({ id: ordersTable.id });

      await trx.insert(orderItemTable).values(
        cartProducts.map((cart) => ({
          orderId: order.id,
          productId: cart.id,
          perProductPrice: cart.price,
          perProductQuantity: cart.count,
        })),
      );

      await trx.delete(cartTable).where(eq(cartTable.userId, userId));
    });

    return res.status(201).json({ success: true, message: "Order is Placed" });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await db
      .select({
        orderId: ordersTable.id,
        totalAmount: ordersTable.totalAmount,
        paymentMethod: ordersTable.paymentMethod,
        orderStatus: ordersTable.orderStatus,
        createdAt: ordersTable.createdAt,
        buildingName: addressTable.buildingName,
        phoneNumber: addressTable.phoneNumber,
        city: addressTable.city,
      })
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId))
      .leftJoin(addressTable, eq(addressTable.id, ordersTable.addressId));

    const orderIds = orders.map((order) => order.orderId);

    const items = await db
      .select({
        orderId: orderItemTable.orderId,
        productName: productsTable.title,
        productPrice: orderItemTable.perProductPrice,
        productQuantity: orderItemTable.perProductQuantity,
        image: productsTable.image,
      })
      .from(orderItemTable)
      .where(inArray(orderItemTable.orderId, orderIds))
      .leftJoin(productsTable, eq(productsTable.id, orderItemTable.productId));

    const result = orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.orderId === order.orderId),
    }));

    return res.status(200).json({ success: true, orders: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const getAllOrdersAsAdmin = async (req, res) => {
  try {
    const orders = await db
      .select({
        orderId: ordersTable.id,
        totalAmount: ordersTable.totalAmount,
        paymentMethod: ordersTable.paymentMethod,
        orderStatus: ordersTable.orderStatus,
        createdAt: ordersTable.createdAt,
        buildingName: addressTable.buildingName,
        phoneNumber: addressTable.phoneNumber,
        city: addressTable.city,
      })
      .from(ordersTable)

      .leftJoin(addressTable, eq(addressTable.id, ordersTable.addressId));

    const orderIds = orders.map((order) => order.orderId);

    const items = await db
      .select({
        orderId: orderItemTable.orderId,
        productName: productsTable.title,
        productPrice: orderItemTable.perProductPrice,
        productQuantity: orderItemTable.perProductQuantity,
        image: productsTable.image,
      })
      .from(orderItemTable)
      .where(inArray(orderItemTable.orderId, orderIds))
      .leftJoin(productsTable, eq(productsTable.id, orderItemTable.productId));

    const result = orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.orderId === order.orderId),
    }));

    return res.status(200).json({ success: true, orders: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(id);

    if (!status || !orderStatusEnum.enumValues.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status is not valid" });
    }

    const [order] = await db
      .select({
        orderId: ordersTable.id,
        userId: ordersTable.userId,
        userName: usersTable.name,
        userEmail: usersTable.email,
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id));

    if (!order) {
      return res
        .status(200)
        .json({ success: false, message: "No Order Found" });
    }

    await db
      .update(ordersTable)
      .set({ orderStatus: status })
      .where(eq(ordersTable.id, id));

    await sendOrderStatusEmail({
      // to: order.userEmail,
      to: "ihsankhan886644@gmail.com",
      userName: order.userName,
      orderId: order.orderId,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Order Status Updated & Email Sent to User",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};
