import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { addProduct, addStock } from '@libs/database';
import type { ProductType } from 'src/types';

const FIELDS_TO_VALIDATE = ['count', 'description', 'price', 'title'];

const isValidate = (product: Omit<ProductType, 'id'> & { count: number }) => {
  const isValid = FIELDS_TO_VALIDATE.every((fieldName) => {
    if (fieldName === 'count' && typeof product[fieldName] === 'number') {
      return true;
    }

    if (fieldName === 'description' && typeof product[fieldName] === 'string') {
      return true;
    }

    if (fieldName === 'price' && typeof product[fieldName] === 'number') {
      return true;
    }

    if (fieldName === 'title' && typeof product[fieldName] === 'string') {
      return true;
    }

    return false;
  });

  return isValid;
};

const createProduct = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (!isValidate(body)) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Product data is invalid' }) };
    }

    const productId = await addProduct(body)
    await addStock(productId, body.count);

    console.log('productId: ', productId);

    return formatJSONResponse({...body, id: productId});
  } catch(_) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};

export const main = middyfy(createProduct);
