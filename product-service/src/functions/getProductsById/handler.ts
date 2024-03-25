import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from '@functions/data';
import type { Product } from '@functions/types';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<Product> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = products.find(({ id }) => id === parseInt(productId));

    if (!product) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Product not found' }) }
    }

    return formatJSONResponse(product);
  } catch(_) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};

export const main = middyfy(getProductsById);
