import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export const sendOrderStatusEmail = async ({
  to,
  userName,
  orderId,
  status,
}) => {
  const statusMessages = {
    confirmed: {
      subject: "Your order has been confirmed ✅",
      heading: "Order Confirmed!",
      message:
        "Great news! Your order has been confirmed and is being prepared.",
      color: "#2E86AB",
    },
    shipped: {
      subject: "Your order is on the way 🚚",
      heading: "Order Shipped!",
      message:
        "Your order is on its way. Sit tight and we will deliver it soon.",
      color: "#8E44AD",
    },
    delivered: {
      subject: "Your order has been delivered 📦",
      heading: "Order Delivered!",
      message:
        "Your order has been delivered successfully. Enjoy your purchase!",
      color: "#27AE60",
    },
    cancelled: {
      subject: "Your order has been cancelled ❌",
      heading: "Order Cancelled",
      message:
        "Unfortunately your order has been cancelled. Contact support if you have questions.",
      color: "#E74C3C",
    },
  };

  const template = statusMessages[status];

  if (!template) return;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: to,
    subject: template.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        
        <!-- Header -->
        <div style="background-color: ${template.color}; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">ShopSphere</h1>
        </div>

        <!-- Body -->
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1E3A5F;">${template.heading}</h2>
          <p style="color: #555; font-size: 15px;">Hi ${userName},</p>
          <p style="color: #555; font-size: 15px;">${template.message}</p>

          <!-- Order ID Box -->
          <div style="background-color: white; border: 1px solid #eee; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #999; font-size: 12px;">Order ID</p>
            <p style="margin: 4px 0 0; color: #1E3A5F; font-weight: bold; font-size: 16px;">
              #${orderId.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <!-- Status Badge -->
          <div style="text-align: center; margin: 20px 0;">
            <span style="background-color: ${template.color}20; color: ${template.color}; 
              padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px;
              border: 1px solid ${template.color}40;">
              ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            Thank you for shopping with ShopSphere
          </p>
        </div>

      </div>
    `,
  });

  //   console.log("EMAIL RESPONSE:", response);
};
