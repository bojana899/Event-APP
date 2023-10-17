
// Client-Side Code
// mailService.js

const mailServiceClient = {
    sendMail: async (mailData) => {
        // Simulate sending an email with mock data
        const { from, to, subject, html } = mailData;

        // You can log the email content for debugging purposes
        console.log('Simulated email content:');
        console.log(`From: ${from}`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('HTML Content:');
        console.log(html);

        // Simulate sending the email (a brief delay)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Email sent successfully (simulated)');
                resolve();
            }, 2000); // Simulate a 2-second delay for sending the email
        });
    },
};

export { mailServiceClient };