const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const sendEmailCreateOrder = async (email, orderItems) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
          user: process.env.MAIL_ACCOUNT,
          pass: process.env.MAIL_PASSWORD,
        },
      });

    let listItem = ''
    const attachImage = []
    orderItems.forEach((order) => {
        listItem += `<div>
        <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price}đ</b></div>
        <div><img src=${order.image} alt=${order.name}/></div>
        </div>`
        attachImage.push({path: order.image})
    })
      
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, // sender address
        to: email, // list of receivers
        subject: "Order placed successfully at TikiClone", // Subject line
        text: "Hello world?", // plain text body
        html: `<div><b>Bạn đã đặt hàng tại TikiClone thành công</b></div>${orderItems}`, // html body
        attachments: attachImage,
    });
    
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
}

module.exports = {
    sendEmailCreateOrder
}