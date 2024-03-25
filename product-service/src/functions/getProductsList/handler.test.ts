import { products } from '@functions/data';
import { main as getProductsList } from './handler';

type Event = Parameters<typeof getProductsList>[0];
type Context = Parameters<typeof getProductsList>[1];

jest.mock('@libs/lambda', () => ({
  middyfy: (fn: Function) => fn
}));

describe('getProductsList', () => {
  it('should return a list of products', async () => {
    const res = await getProductsList({} as Event, {} as Context)
    expect(res).toStrictEqual({ statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(products) });
  });
});
