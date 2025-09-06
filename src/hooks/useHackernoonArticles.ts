import { useQuery } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';
import { GET_HACKERNOON_ARTICLES, HACKERNOON_WALLET } from '../lib/queries';
import type { Article, TransactionEdge } from '../types/article';

const ARTICLES_PER_PAGE = 100;

export const useHackernoonArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { loading, error, data, fetchMore } = useQuery(GET_HACKERNOON_ARTICLES, {
    variables: {
      owner: HACKERNOON_WALLET,
      limit: ARTICLES_PER_PAGE,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const transformToArticle = (edge: TransactionEdge): Article => {
    const { node } = edge;
    const tags = node.tags || [];
    
    const getTagValue = (name: string): string | undefined => {
      const tag = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
      return tag?.value;
    };

    const title = getTagValue('Title') || getTagValue('Page-Title') || `Article ${node.id.slice(0, 8)}`;
    const description = getTagValue('Description') || getTagValue('OG-Description');
    const author = getTagValue('Author') || getTagValue('Creator');
    const imageUrl = getTagValue('Image') || getTagValue('OG-Image');
    const contentType = getTagValue('Content-Type') || node.data?.type;
    
    const articleTags = tags
      .filter(t => t.name.startsWith('Tag-') || t.name === 'Topic')
      .map(t => t.value);

    const publishedAt = node.block?.timestamp 
      ? new Date(node.block.timestamp * 1000) 
      : undefined;

    const contentSize = parseInt(node.data?.size || '0');
    const wordsPerMinute = 200;
    const avgCharsPerWord = 5;
    const estimatedWords = contentSize / avgCharsPerWord;
    const readingTime = Math.ceil(estimatedWords / wordsPerMinute);

    return {
      id: node.id,
      title,
      description,
      author,
      publishedAt,
      imageUrl,
      contentType,
      tags: articleTags,
      readingTime,
      url: `https://arweave.net/${node.id}`,
    };
  };

  useEffect(() => {
    if (data?.transactions?.edges) {
      const newArticles = data.transactions.edges.map(transformToArticle);
      setArticles(newArticles);
      
      const lastEdge = data.transactions.edges[data.transactions.edges.length - 1];
      setCursor(lastEdge?.cursor || null);
      setHasMore(data.transactions.pageInfo?.hasNextPage || false);
    }
  }, [data]);

  const loadMore = useCallback(async () => {
    if (!cursor || !hasMore || loading) return;

    try {
      const result = await fetchMore({
        variables: {
          cursor,
        },
      });

      if (result.data?.transactions?.edges) {
        const newArticles = result.data.transactions.edges.map(transformToArticle);
        setArticles(prev => [...prev, ...newArticles]);
        
        const lastEdge = result.data.transactions.edges[result.data.transactions.edges.length - 1];
        setCursor(lastEdge?.cursor || null);
        setHasMore(result.data.transactions.pageInfo?.hasNextPage || false);
      }
    } catch (err) {
      console.error('Error loading more articles:', err);
    }
  }, [cursor, hasMore, loading, fetchMore]);

  return {
    articles,
    loading,
    error,
    hasMore,
    loadMore,
  };
};