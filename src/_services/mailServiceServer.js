// mailService.js

// Import any necessary dependencies here



// Server-Side Code
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // Set your email service
    auth: {
        user: "bojance666@gmail.com",
        pass: "gmailpass8**", // Use environment variables for sensitive information
    },
});

const mailServiceServer = {
    sendEmail: (name, report, res) => {
        const mailOptions = {
            from: "bojance666@gmail.com",
            to: "h.bojana@live.com",
            subject: "New Report",
            text: `Name: ${name}\n\nReport: ${report}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email send error:", error);
                res.status(500).json({ error: "Failed to send email" });
            } else {
                console.log("Email sent: " + info.response);
                res.json({ message: "Email sent successfully" });
            }
        });
    },
};

export { mailServiceServer };
