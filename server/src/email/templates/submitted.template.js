const submittedTemplate = (name, trackingId) => ({
    subject: `Application Received - Your Tracking ID: ${trackingId}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Received</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333;">

        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; border-collapse: collapse;">
                        
                        <tr>
                            <td style="background-color: #4f46e5; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Application Received</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Dear <strong>${name}</strong>,
                                </p>
                                <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Thank you for applying to volunteer with us! We appreciate your interest in making a difference.
                                </p>

                                <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-left: 4px solid #4f46e5; border-radius: 4px; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <p style="margin: 0 0 10px 0; font-size: 16px; color: #1f2937;">
                                                📌 <strong>Your Tracking ID:</strong> <span style="font-family: monospace; font-size: 18px; color: #4f46e5; background-color: #e0e7ff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${trackingId}</span>
                                            </p>
                                            <p style="margin: 0; font-size: 15px; color: #4b5563; line-height: 1.5;">
                                                Use this ID to check your application status anytime.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 35px;">
                                    <tr>
                                        <td align="center">
                                            <a href="${process.env.WEBSITE_URL}/track-status" target="_blank" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; box-shadow: 0 2px 5px rgba(79, 70, 229, 0.3);">
                                                Track Application Status
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 30px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
                                    We will review your application and notify you once a decision is made.<br>
                                    <span style="display: inline-block; margin-top: 10px; background-color: #fef3c7; color: #d97706; padding: 4px 12px; border-radius: 50px; font-size: 14px; font-weight: 600;">
                                        Current Status: Pending Review
                                    </span>
                                </p>

                                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
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

module.exports = submittedTemplate;