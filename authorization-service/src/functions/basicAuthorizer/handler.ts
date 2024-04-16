const generatePolicy = (principalId, resource, effect = 'Allow') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    }],
  },
})

const basicAuthorizer = async (event, _, callback) => {
  if (event.type !== 'TOKEN') {
    callback('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;

    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString().split(':');
    const username = plainCreds[0];
    const password = plainCreds[1];

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    callback(null, policy);

  } catch (error) {
    callback(`Unauthorized: ${error.message}`)
  }
};

export const main = basicAuthorizer;
