import type { AWS } from '@serverless/typescript';

import catalogBatchProcess from '@functions/catalogBatchProcess';
import createProduct from '@functions/createProduct';
import getProductsById from '@functions/getProductsById';
import getProductsList from '@functions/getProductsList';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SNS_ARN: {
        Ref: 'SNSTopic',
      },
    },
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
      Resource: 'arn:aws:dynamodb:eu-west-1:851725244227:table/products',
    }, {
      Effect: 'Allow',
      Action: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
      Resource: 'arn:aws:dynamodb:eu-west-1:851725244227:table/stocks',
    }, {
      Effect: 'Allow',
      Action: 'sqs:*',
      Resource: [{ 'Fn::GetAtt': ['SQSQueue', 'Arn'] }],
    }, {
      Effect: 'Allow',
      Action: 'sns:*',
      Resource: '*',
    }],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'bijiwi1668@abnovel.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
    },
  },
  // import the function via paths
  functions: { catalogBatchProcess, createProduct, getProductsList, getProductsById },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
