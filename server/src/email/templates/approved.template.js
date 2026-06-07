const approvedTemplate = (name, trackingId, whatsappLink, profileLink) => ({
    subject: "Great News! Your Application Has Been Approved 🎉",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Approved</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333;">

        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; border-collapse: collapse;">
                        
                        <tr>
                            <td style="background-color: #10b981; padding: 35px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">Congratulations! 🎉</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Dear <strong>${name}</strong>,
                                </p>
                                <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Great news! Your volunteer application has been <strong style="color: #10b981;">APPROVED</strong>. We're incredibly excited to have you on board and making a difference with us!
                                </p>

                                <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-left: 4px solid #10b981; border-radius: 4px; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 15px 20px;">
                                            <p style="margin: 0; font-size: 16px; color: #1f2937;">
                                                📌 <strong>Tracking ID:</strong> <span style="font-family: monospace; font-size: 16px; color: #047857; background-color: #d1fae5; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${trackingId}</span>
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937; font-weight: 600;">Next Steps:</h3>
                                
                                <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                                    <tr>
                                        <td valign="top" style="padding: 0 10px 15px 0; font-size: 16px; font-weight: bold; color: #10b981;">1.</td>
                                        <td style="padding-bottom: 15px; font-size: 15px; color: #4b5563; line-height: 1.5;">
                                            Please wait for our onboarding email with further instructions.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="padding: 0 10px 15px 0; font-size: 16px; font-weight: bold; color: #10b981;">2.</td>
                                        <td style="padding-bottom: 15px; font-size: 15px; color: #4b5563; line-height: 1.5;">
                                            Join our volunteer WhatsApp group: <br>
                                            <a href="${whatsappLink}" target="_blank" style="color: #25d366; font-weight: 600; text-decoration: underline; display: inline-block; margin-top: 4px;">Click here to join WhatsApp Group</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="padding: 0 10px 15px 0; font-size: 16px; font-weight: bold; color: #10b981;">3.</td>
                                        <td style="padding-bottom: 15px; font-size: 15px; color: #4b5563; line-height: 1.5;">
                                            Complete your volunteer profile: <br>
                                            <a href="${profileLink}" target="_blank" style="color: #10b981; font-weight: 600; text-decoration: underline; display: inline-block; margin-top: 4px;">Complete Your Profile</a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 40px 0 0 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Thank you,<br>
                                    <strong style="color: #1f2937;">- NGO Team</strong>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                                    This is an automated email, please do not reply directly to this message.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>

    </body>
    </html>
    `
});

module.exports = approvedTemplate;