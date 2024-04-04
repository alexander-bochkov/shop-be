const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');

const products = [
  {
    description: "Dragon’s Dogma is a single player, narrative driven action-RPG series that challenges the players to choose their own experience – from the appearance of their Arisen, their vocation, their party, how to approach different situations and more. Now, in this long-awaited sequel, the deep, explorable fantasy world of Dragon’s Dogma 2 awaits.",
    price: 51,
    title: "Dragon's Dogma 2",
  },
  {
    description: "Join Aloy as she braves a majestic but dangerous new frontier that holds mysterious new threats. This Complete Edition allows you to enjoy the critically acclaimed Horizon Forbidden West on PC in its entirety with bonus content, including the Burning Shores story expansion that picks up after the main game.",
    price: 49,
    title: "Horizon Forbidden West™ Complete Edition",
  },
  {
    description: "Enlist in the Helldivers and join the fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter.",
    price: 39,
    title: "HELLDIVERS™ 2",
  },
  {
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    price: 29,
    title: "Baldur's Gate 3",
  },
  {
    description: "EA SPORTS FC™ 24 kicks off a new era of The World's Game. Meet the new brand and the three technologies powering the true-to-football experience.",
    price: 69,
    title: "EA SPORTS FC™ 24",
  },
  {
    description: "Tom Clancy's Rainbow Six® Siege is an elite, realistic, tactical team-based shooter where superior planning and execution triumph. It features 5v5 attack vs. defense gameplay and intense close-quarters combat in destructible environments.",
    price: 9,
    title: "Tom Clancy's Rainbow Six® Siege",
  },
];

const fillDatabase = () => {
  const client = new DynamoDB({ region: 'eu-west-1' });

  const addToStock = (productId) => {
    const params = {
      TableName: "stocks",
      Item: {
        product_id: { S: productId },
        count: { N: String(Math.floor((Math.random() * 3) + 1)) }
      }
    };

    client.putItem(params, (err, data) => {
      if (err) {
         console.error(err);
      } else {
          console.log(data);
      }
    });
  };

  const createProduct = (product) => {
    const id = uuidv4();

    const params = {
      TableName: "products",
      Item: {
        id: { S: id },
        title: { S: product.title },
        description: { S: product.description },
        // send as string to avoid issue with serialization - https://stackoverflow.com/questions/71488712/number-value-cannot-be-converted-to-string-when-updating-item
        price: { N: String(product.price) },
      },
    };

    client.putItem(params, (err, data) => {
      if (err) {
         console.error(err);
      } else {
          console.log(data);
          addToStock(id);
      }
    });
  };

  products.forEach((product) => createProduct(product));
};

fillDatabase();
