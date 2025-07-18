const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let listItem = "";
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
    <div><img src=${order.image} alt="sản phẩm"/></div>
  </div>`;
  attachImage.push({path: order.image})
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: "Bạn đã đặt hàng tại shop LinhKienTot ✔",
    text: "Hello world?", // plain‑text body
    html: `<div><b>Bạn đã đặt hàng thành công tại shop LinhKienTot</b></div>${listItem}`, // HTML body
    attachments : attachImage,
  });
};

module.exports = {
  sendEmailCreateOrder,
};
