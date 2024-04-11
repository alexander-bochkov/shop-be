import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const importProductsFile = async (event) => {
  const client = new S3Client({ region: 'eu-west-1' });
  const command = new PutObjectCommand({ Bucket: 'csv-container1', Key: `uploaded/${event.queryStringParameters.name}` });
  const presignedUrl = await getSignedUrl(client, command, { expiresIn: 60 });
  return formatJSONResponse(presignedUrl)
};

export const main = middyfy(importProductsFile);
