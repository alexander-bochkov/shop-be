export type ProductType = {
  description: string;
  id: string;
  price: number;
  title: string;
};

export type StockType = {
  product_id: string;
  count: number;
};
