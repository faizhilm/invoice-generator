const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-pdf', (req, res) => {
    const invoice = req.body;
    const html = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .invoice-box { width: 100%; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
                .heading { font-size: 18px; margin-bottom: 20px; }
                .item { padding: 10px 0; }
                .total { margin-top: 20px; font-size: 18px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="heading">
                    <strong>Company Name:</strong> ${invoice.companyName} <br>
                    <strong>Client Name:</strong> ${invoice.clientName} <br>
                    <strong>Date:</strong> ${invoice.invoiceDate}
                </div>
                <hr>
                ${invoice.items.map(item => `
                    <div class="item">
                        <strong>Description:</strong> ${item.description} <br>
                        <strong>Quantity:</strong> ${item.quantity} <br>
                        <strong>Price:</strong> $${item.price} <br>
                        <strong>Total:</strong> $${item.quantity * item.price}
                    </div>
                    <hr>
                `).join('')}
                <div class="total">
                    <strong>Total Amount: </strong> $${invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0)}
                </div>
            </div>
        </body>
        </html>
    `;

    pdf.create(html).toStream((err, stream) => {
        if (err) return res.status(500).send(err);
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
