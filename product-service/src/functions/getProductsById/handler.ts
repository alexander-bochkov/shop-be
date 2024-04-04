import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductById, getStockByProductId } from '@libs/database';

const getProductsById = async (event) => {
  try {
    const { productId } = event.pathParameters;

    const product = await getProductById(productId);
    const stock = await getStockByProductId(productId);

    console.log('product: ', product);
    console.log('stock: ', stock);

    return formatJSONResponse({ ...product, count: stock.count });
  } catch(_) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};

export const main = middyfy(getProductsById);
