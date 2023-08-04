import cors from 'cors';
import express from 'express';
import proxy from 'express-http-proxy';

const host = process.env.GATEWAY_SERVICE_HOST;
const port = Number(process.env.GATEWAY_SERVICE_PORT);

const app = express();

app.use(cors());
app.use(express.json());

const shopPath = `http://${process.env.SHOP_SERVICE_HOST}:${process.env.SHOP_SERVICE_PORT}`;
const userPath = `http://${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}`;
const productPath = `http://${process.env.PRODUCT_SERVICE_HOST}:${process.env.PRODUCT_SERVICE_PORT}`;
const paymentPath = `http://${process.env.PAYMENT_SERVICE_HOST}:${process.env.PAYMENT_SERVICE_PORT}`;

app.use('/shop', proxy(shopPath));
app.use('/user', proxy(userPath));
app.use('/product', proxy(productPath));
app.use('/payment', proxy(paymentPath));

app.listen(port, host, () => {
    console.log(`Service is ready and running on path: http://${host}:${port}`);
});
