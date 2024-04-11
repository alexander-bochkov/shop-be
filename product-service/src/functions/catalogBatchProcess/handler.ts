import { forEach } from 'p-iteration';
import { PublishCommand , SNSClient } from "@aws-sdk/client-sns";
import { addProduct, addStock } from '@libs/database';
import { ProductType } from '../../types';

const catalogBatchProcess = async (event) => {
  const client = new SNSClient({ region: 'eu-west-1' });

  const products: Array<ProductType & { count: number }> = JSON.parse(event.Records[0].body);

  try {
    await forEach(products, async (product) => {
      const productId = await addProduct({...product, price: parseInt(product.price as unknown as string)});
      await addStock(productId, product.count);
    });

    await client.send(
      new PublishCommand({
        Message: JSON.stringify(products),
        Subject: 'New products we added',
        TopicArn: process.env.SNS_ARN,
      }),
    );
  } catch (_) {
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};

export const main = catalogBatchProcess;
