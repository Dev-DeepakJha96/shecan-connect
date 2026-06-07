const rejectedTemplate = (name, trackingId) => ({
    subject: "Update on Your Application",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333;">

        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; border-collapse: collapse;">
                        
                        <tr>
                            <td style="background-color: #64748b; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Application Update</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Dear <strong>${name}</strong>,
                                </p>
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Thank you for your interest in volunteering with us.
                                </p>
                                <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    After careful review, we regret to inform you that your application has not been approved at this time. We receive many applications and often have to make difficult decisions based on our current capacity and project requirements.
                                </p>

                                <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-left: 4px solid #94a3b8; border-radius: 4px; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 15px 20px;">
                                            <p style="margin: 0; font-size: 15px; color: #1f2937;">
                                                📌 <strong>Tracking ID:</strong> <span style="font-family: monospace; font-size: 16px; color: #475569; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${trackingId}</span>
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 30px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
                                    We encourage you to reapply in the future when new opportunities arise. Your desire to contribute is highly valued, and we wish you the very best.
                                </p>

                                <p style="margin: 0 0 30px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
                                    Thank you for your understanding.
                                </p>

                                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Best regards,<br>
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

module.exports = rejectedTemplate;