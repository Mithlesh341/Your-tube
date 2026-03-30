
// import nodemailer from "nodemailer";
// import sgTransport from "nodemailer-sendgrid";

// const transporter = nodemailer.createTransport(
//   sgTransport({
//     apiKey: process.env.SENDGRID_API_KEY,
//   })
// );

// export const sendInvoiceEmail = async (email, name, plan, amount) => {
//   const mailOptions = {
//     from: "mithlesh26cs071@satiengg.in",
//     to: email,
//     subject: "Your Subscription Invoice - YouTube Clone",
//     html: `
//   <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
//     <h2 style="color: #2d3748;">Hello ${name || "User"},</h2>
//     <p style="font-size: 16px;">Thank you for subscribing to the <strong>${plan}</strong> plan on <strong>YouTube Clone</strong>.</p>

//     <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
//       <thead>
//         <tr style="background-color: #f6f6f6;">
//           <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Item</th>
//           <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Details</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td style="padding: 10px; border: 1px solid #ddd;">Plan</td>
//           <td style="padding: 10px; border: 1px solid #ddd;">${plan}</td>
//         </tr>
//         <tr>
//           <td style="padding: 10px; border: 1px solid #ddd;">Amount Paid</td>
//           <td style="padding: 10px; border: 1px solid #ddd;">₹${amount}</td>
//         </tr>
//         <tr>
//           <td style="padding: 10px; border: 1px solid #ddd;">Date</td>
//           <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
//         </tr>
//       </tbody>
//     </table>

//     <p style="font-size: 16px; margin-top: 20px;">We hope you enjoy watching videos without limits! 🎥</p>

//     <p style="font-size: 13px; color: #888; margin-top: 30px;">This is an auto-generated invoice. Please do not reply to this email.</p>
//   </div>
// `,
//   };

//   await transporter.sendMail(mailOptions);
// };


// //CQ4LHCV3XJDQU6CNEU62RJUW- Recovery Code




import nodemailer from "nodemailer";

// ✅ Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your gmail
    pass: process.env.EMAIL_PASS,       // app password (NOT normal password)
  },
});

export const sendInvoiceEmail = async (email, name, plan, amount) => {
  const mailOptions = {
    from: `"YouTube Clone" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Subscription Invoice - YouTube Clone",

    html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2d3748;">Hello ${name || "User"},</h2>
      <p style="font-size: 16px;">Thank you for subscribing to the <strong>${plan}</strong> plan on <strong>YouTube Clone</strong>.</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f6f6f6;">
            <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Plan</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${plan}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Amount Paid</td>
            <td style="padding: 10px; border: 1px solid #ddd;">₹${amount}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Date</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>

      <p style="font-size: 16px; margin-top: 20px;">We hope you enjoy watching videos without limits! 🎥</p>

      <p style="font-size: 13px; color: #888; margin-top: 30px;">
        This is an auto-generated invoice. Please do not reply to this email.
      </p>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};