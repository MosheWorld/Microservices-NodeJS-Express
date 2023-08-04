import fetch from 'node-fetch';
import fetchRetry from 'fetch-retry';
import { HttpStatusCode } from 'axios';
import * as SwaggerShop from './swagger-shop';
import * as SwaggerUser from './swagger-user';
import * as SwaggerProduct from './swagger-product';
import * as SwaggerPayment from './swagger-payment';

const MEX_RETRIES = 2;
function createApiConfiguration(Class, basePath: string) {
    return new Class.Configuration({
        basePath,
        fetchApi: fetchRetry(fetch, {
            retryDelay: 300,
            retryOn: function (attempt, error, response) {
                if (attempt > MEX_RETRIES) {
                    return false;
                }

                if (error !== null || response.status >= HttpStatusCode.InternalServerError) {
                    return true;
                }
            },
        }),
    });
}

const gatewayPath = `http://${process.env.GATEWAY_SERVICE_HOST}:${process.env.GATEWAY_SERVICE_PORT}`;

const apiConfigurationShop = createApiConfiguration(SwaggerShop, gatewayPath + '/shop');
const apiConfigurationUser = createApiConfiguration(SwaggerUser, gatewayPath + '/user');
const apiConfigurationProduct = createApiConfiguration(SwaggerProduct, gatewayPath + '/product');
const apiConfigurationPayment = createApiConfiguration(SwaggerPayment, gatewayPath + '/payment');

export const shopApi = new SwaggerShop.ShopApi(apiConfigurationShop);
export const userApi = new SwaggerUser.UserApi(apiConfigurationUser);
export const productApi = new SwaggerProduct.ProductApi(apiConfigurationProduct);
export const paymentApi = new SwaggerPayment.PaymentApi(apiConfigurationPayment);

export * as SwaggerShop from './swagger-shop';
export * as SwaggerUser from './swagger-user';
export * as SwaggerProduct from './swagger-product';
export * as SwaggerPayment from './swagger-payment';
