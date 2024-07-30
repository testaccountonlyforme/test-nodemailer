import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

let browser;

/*
Ye function browser launch karne ke liye hai, agar pehle se browser nahi hai toh naya launch karega.
*/
const launchBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true, // Headless mode mein run karta hai
      args: ['--no-sandbox', '--disable-setuid-sandbox'], 
    });
  }
};

/*
Nodemailer ka transport setup, yahaan pe Gmail service use ki ja rahi hai
*/
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'yourgmail',
    pass: 'yourpass'
  }
});

/*
Yeh endpoint HTML ko PDF mein convert karke email send karne ke liye hai
*/
app.post('/generate-pdf-and-send', async (req, res) => {
  try {
    const { html, recipientEmail } = req.body;

    await launchBrowser(); // Browser launch karo
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0', // Network idle hone tak wait karega
    });

    const pdfBuffer = await page.pdf({
      format: 'A3',
      printBackground: true,
      timeout: 30000, // 30 seconds ka timeout
    });

    // Email ka content define karo
    const mailOptions = {
      from: 'tested.acc.gml.ndmlr@gmail.com',
      to: recipientEmail,
      subject: 'Your PDF Document',
      html: html, // HTML content email ke body mein
      attachments: [
        {
          filename: 'document.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions); // Email send karo

    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error generating PDF or sending email', error);
    res.status(500).send('Error generating PDF or sending email');
  }
});

// Server ko port 3001 pe listen karwao
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
