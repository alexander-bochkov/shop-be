import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProducts, getStockByProductId } from '@libs/database';

const getProductsList = async () => {
  try {
    const products = await getProducts();
    const result = await Promise.all(products.map(async (product) => {
      const stock = await getStockByProductId(product.id);
      return {
        ...product,
        count: stock.count,
      };
    }))

    console.log('products: ', products);
    console.log('result: ', result);

    return formatJSONResponse(result);
  } catch (_) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};

export const main = middyfy(getProductsList);
