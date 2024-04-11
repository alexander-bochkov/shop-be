import { S3 } from '@aws-sdk/client-s3';
import csv from 'csv-parser';

const importFileParser = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  const client = new S3({ region: 'eu-west-1' });
  const response = await client.getObject({ Bucket: bucket, Key: key });

  response.Body.pipe(csv()).on('data', (data) => console.log(data));
};

export const main = importFileParser;
