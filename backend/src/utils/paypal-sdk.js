import { Client, Environment, OrdersController } from '@paypal/paypal-server-sdk';
import { env } from '../config/env.js';

let ordersController;

function getController() {
  if (!env.paypal.clientId || !env.paypal.clientSecret) {
    const error = new Error('PayPal credentials are not configured.');
    error.status = 503;
    throw error;
  }
  if (!ordersController) {
    const environment = env.paypal.mode === 'production'
      ? Environment.Production
      : Environment.Sandbox;
    const client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: env.paypal.clientId,
        oAuthClientSecret: env.paypal.clientSecret,
      },
      environment,
      timeout: 30000,
    });
    ordersController = new OrdersController(client);
  }
  return ordersController;
}

function unwrap(response) {
  return response?.result ?? response?.body ?? response;
}

export async function paypalCreateOrder(body, requestId) {
  const response = await getController().createOrder({
    body,
    paypalRequestId: requestId,
    prefer: 'return=representation',
  });
  return unwrap(response);
}

export async function paypalGetOrder(id) {
  const response = await getController().getOrder({ id });
  return unwrap(response);
}

export async function paypalCaptureOrder(id, requestId) {
  const response = await getController().captureOrder({
    id,
    paypalRequestId: requestId,
    prefer: 'return=representation',
    body: {},
  });
  return unwrap(response);
}

export function paypalField(object, camelName, snakeName) {
  return object?.[camelName] ?? object?.[snakeName] ?? null;
}

export function normalizePaypalMoney(value) {
  if (!value) return null;
  return {
    currency_code: paypalField(value, 'currencyCode', 'currency_code'),
    value: value.value == null ? null : String(value.value),
  };
}

export function normalizePaypalExchangeRate(value) {
  if (!value) return null;
  return {
    value: value.value == null ? null : String(value.value),
    source_currency: paypalField(value, 'sourceCurrency', 'source_currency'),
    target_currency: paypalField(value, 'targetCurrency', 'target_currency'),
  };
}
