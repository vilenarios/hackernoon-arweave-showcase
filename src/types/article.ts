export interface ArweaveTag {
  name: string;
  value: string;
}

export interface ArweaveTransaction {
  id: string;
  owner: {
    address: string;
  };
  data: {
    size: string;
    type: string;
  };
  tags: ArweaveTag[];
  block?: {
    timestamp: number;
    height: number;
  };
}

export interface TransactionEdge {
  node: ArweaveTransaction;
  cursor: string;
}

export interface Article {
  id: string;
  title: string;
  description?: string;
  author?: string;
  publishedAt?: Date;
  imageUrl?: string;
  contentType?: string;
  tags: string[];
  readingTime?: number;
  url: string;
}