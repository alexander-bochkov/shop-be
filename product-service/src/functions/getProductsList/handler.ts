import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from '@functions/data';
import type { Product } from '@functions/types';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<Array<Product>> = async () => {
  return formatJSONResponse(products);
};

export const main = middyfy(getProductsList);
