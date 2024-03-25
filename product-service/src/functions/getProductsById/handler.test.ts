import { products } from '@functions/data';
import { main as getProductsById } from './handler';

type Event = Parameters<typeof getProductsById>[0];
type Context = Parameters<typeof getProductsById>[1];

jest.mock('@libs/lambda', () => ({
  middyfy: (fn: Function) => fn
}));

describe('getProductsById', () => {
  it('should return a products by id', async () => {
    const productId = 1;
    const res = await getProductsById({ pathParameters: { productId: String(productId) } } as {} as Event, {} as Context)
    expect(res).toStrictEqual({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(products.find(({ id }) => id === productId))
    });
  });

  it('should return error message if product not found', async () => {
    const productId = 10;
    const res = await getProductsById({ pathParameters: { productId: String(productId) } } as {} as Event, {} as Context)
    expect(res).toStrictEqual({
      statusCode: 404,
      body: JSON.stringify({ message: 'Product not found' })
    });
  });
});
