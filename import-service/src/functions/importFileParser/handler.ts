import { S3 } from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import csv from 'csv-parser';

const importFileParser = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  const clientS3 = new S3({ region: 'eu-west-1' });
  const response = await clientS3.getObject({ Bucket: bucket, Key: key });

  const clientSQS = new SQSClient({ region: 'eu-west-1' });

  const pipeline = new Promise((resolve) => {
    const result = [];

    response.Body
      .pipe(csv())
      .on('data', (data) => result.push(data))
      .on('end', () => resolve(result));
  });

  const result = await pipeline;

  await clientSQS.send(new SendMessageCommand({
    QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/851725244227/catalogItemsQueue',
      MessageBody: JSON.stringify(result),
  }));

  return { statusCode: 200 };
};

export const main = importFileParser;
