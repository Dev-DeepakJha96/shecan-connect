const nodemailer = require('nodemailer'); 

const submittedTemplate = require('./templates/submitted.template.js');
const approvedTemplate = require('./templates/approved.template.js');
const rejectedTemplate = require('./templates/rejected.template.js');
const transporter = require("./email.config.js")

// 1. Nodemailer Transporter Configure Karein
// Note: Isse function ke bahar rakha hai taaki transporter ek hi baar initialize ho, baar-baar nahi.


const sendStatusEmail = async (email, name, status, trackingId, extraData = {}) => {
  
  // 2. Status ke mutabik sahi template function select karein
  let templateData;

  switch (status) {
    case 'submitted':
      templateData = submittedTemplate(name, trackingId);
      break;
    
    case 'approved':
      templateData = approvedTemplate(
        name, 
        trackingId, 
        extraData.whatsappLink || '#', 
        extraData.profileLink || '#'
      );
      break;
    
    case 'rejected':
      templateData = rejectedTemplate(name, trackingId);
      break;
    
    default:
      console.error(`Invalid status: ${status}`);
      return;
  }

  // 3. Mail Options Taiyar Karein
  const mailOptions = {
    from: `"NGO Team  -Admin" <${process.env.SENDER_EMAIL}>`, // Sender details
    to: email,                                       // Receiver email
    subject: templateData.subject,                   // Dynamic Subject
    html: templateData.html,                         // Dynamic HTML Content
  };

  // 4. Nodemailer se Email Bhejein
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Nodemailer Error: Failed to send email:', error);
    throw error; // Isse aage controller me catch kiya ja sakta hai
  }
};

module.exports = sendStatusEmail;