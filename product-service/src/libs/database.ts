import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import type { ProductType, StockType} from '../types'

const REGION = 'eu-west-1';

const PRODUCTS_TABLE_NAME = 'products';
const STOCKS_TABLE_NAME = 'stocks';

const mapDynamoDBObject = (object: Object) => Object.keys(object).reduce((result, key) => {
  const originalValue = object[key];
  const type = Object.keys(originalValue)[0];

  return {
    ...result,
    [key]: type === 'S' ? originalValue[type] : parseInt(originalValue[type])
  };
}, {});

export const getProducts = async (): Promise<Array<ProductType>> => {
  const client = new DynamoDB({ region: REGION });
  const products = await client.scan({ TableName: PRODUCTS_TABLE_NAME });
  return products.Items.map(mapDynamoDBObject) as Array<ProductType>;
};

export const getProductById = async (id: string): Promise<ProductType> => {
  const client = new DynamoDB({ region: REGION });
  const product = await client.getItem({ TableName: PRODUCTS_TABLE_NAME, Key: { id: { 'S': id } } });
  return mapDynamoDBObject(product.Item) as ProductType;
};

export const addProduct = async (product: Omit<ProductType, 'id'>): Promise<ProductType['id']> => {
  const client = new DynamoDB({ region: REGION });
  const id = uuidv4();
  const params = {
    TableName: PRODUCTS_TABLE_NAME,
    Item: {
      id: { S: id },
      title: { S: product.title },
      description: { S: product.description },
      // send as string to avoid issue with serialization - https://stackoverflow.com/questions/71488712/number-value-cannot-be-converted-to-string-when-updating-item
      price: { N: String(product.price) },
    },
  }
  await client.putItem(params);
  return id;
}

export const getStockByProductId = async (productId: string): Promise<StockType> => {
  const client = new DynamoDB({ region: REGION });
  const stock = await client.getItem({ TableName: STOCKS_TABLE_NAME, Key: { product_id: { 'S': productId } } });
  return mapDynamoDBObject(stock.Item) as StockType;
};

export const addStock = async (productId: string, count: number) => {
  const client = new DynamoDB({ region: REGION });
  const params = {
    TableName: STOCKS_TABLE_NAME,
    Item: {
      product_id: { S: productId },
      // send as string to avoid issue with serialization - https://stackoverflow.com/questions/71488712/number-value-cannot-be-converted-to-string-when-updating-item
      count: { N: String(count) }
    }
  }
  await client.putItem(params);
  return;
};
