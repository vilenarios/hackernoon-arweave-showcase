import { getGatewayUrl } from './gateway';

export interface ArticleMetadata {
  title?: string;
  description?: string;
  author?: string;
  authorUrl?: string;
  publishedDate?: string;
  tags?: string[];
  tldr?: string;
  imageUrl?: string;
  readingTime?: number;
  searchableContent?: string; // Extracted text content for search
}

// Cache to avoid repeated fetches
const metadataCache = new Map<string, ArticleMetadata>();

// Export function to get cached metadata for search
export const getCachedMetadata = (txId: string): ArticleMetadata | null => {
  return metadataCache.get(txId) || null;
};

// Export function to get all cached metadata for search
export const getAllCachedMetadata = (): Map<string, ArticleMetadata> => {
  return new Map(metadataCache);
};

export const parseHackerNoonHTML = (html: string): ArticleMetadata => {
  const metadata: ArticleMetadata = {};
  
  // Parse title from <title> tag or h1
  const titleMatch = html.match(/<title>(.*?)<\/title>/i) || 
                     html.match(/<h1[^>]*>.*?<a[^>]*>(.*?)<\/a>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1]
      .replace('| HackerNoon', '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Parse TLDR from details summary
  const tldrMatch = html.match(/<summary>TLDR<\/summary>(.*?)(?:<\/details>|<a href)/si);
  if (tldrMatch) {
    metadata.tldr = tldrMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);
  }
  
  // Parse author
  const authorMatch = html.match(/Written by.*?<a[^>]*href="([^"]*)"[^>]*>\s*(.*?)\s*<\/a>/i);
  if (authorMatch) {
    metadata.authorUrl = authorMatch[1];
    // Remove HTML comments and clean up the author name
    metadata.author = authorMatch[2]
      .replace(/<!--\s*-->/g, '') // Remove HTML comments
      .replace(/<[^>]*>/g, '') // Remove any HTML tags
      .trim();
  }
  
  // Parse published date
  const dateMatch = html.match(/Published.*?(\d{4}\/\d{2}\/\d{2})/i);
  if (dateMatch) {
    metadata.publishedDate = dateMatch[1];
  }
  
  // Parse tags
  const tagMatches = html.matchAll(/<a href="[^"]*\/tagged\/([^"]+)"[^>]*>([^<]+)<\/a>/gi);
  const tags = new Set<string>();
  for (const match of tagMatches) {
    const tag = match[2].trim();
    if (tag && !tag.includes('Tech Story Tags')) {
      tags.add(tag);
    }
  }
  metadata.tags = Array.from(tags).slice(0, 5);
  
  // Parse first image
  const imgMatch = html.match(/<img[^>]*src="(https?:\/\/[^"]+)"[^>]*>/i);
  if (imgMatch) {
    metadata.imageUrl = imgMatch[1];
  }
  
  // Estimate reading time from content length and extract searchable content
  const contentMatch = html.match(/<article[^>]*>(.*?)<\/article>/si);
  if (contentMatch) {
    const cleanContent = contentMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = cleanContent.split(/\s+/).length;
    metadata.readingTime = Math.ceil(wordCount / 200);
    
    // Store first 1000 characters of clean content for search
    metadata.searchableContent = cleanContent.slice(0, 1000);
  }
  
  // If no article tag, try to extract from main content areas
  if (!metadata.searchableContent) {
    // Try main content selectors
    const mainContentMatches = [
      html.match(/<main[^>]*>(.*?)<\/main>/si),
      html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>(.*?)<\/div>/si),
      html.match(/<div[^>]*class="[^"]*post[^"]*"[^>]*>(.*?)<\/div>/si)
    ];
    
    for (const match of mainContentMatches) {
      if (match) {
        const cleanContent = match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanContent.length > 100) {
          metadata.searchableContent = cleanContent.slice(0, 1000);
          break;
        }
      }
    }
  }
  
  return metadata;
};

export const fetchArticleMetadata = async (
  txId: string, 
  signal?: AbortSignal
): Promise<ArticleMetadata | null> => {
  // Check cache first
  if (metadataCache.has(txId)) {
    return metadataCache.get(txId)!;
  }
  
  try {
    const url = getGatewayUrl(txId);
    
    // Fetch with timeout and size limit (first 50KB should contain metadata)
    const response = await fetch(url, {
      signal,
      headers: {
        'Range': 'bytes=0-51200' // Only fetch first 50KB for metadata
      }
    });
    
    if (!response.ok) {
      // If Range not supported, try regular fetch with abort after partial read
      const fullResponse = await fetch(url, { signal });
      const reader = fullResponse.body?.getReader();
      if (!reader) return null;
      
      let html = '';
      let bytesRead = 0;
      const maxBytes = 51200; // 50KB
      
      while (bytesRead < maxBytes) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        html += chunk;
        bytesRead += value.byteLength;
        
        // Stop if we have enough for metadata
        if (html.includes('</article>') || html.includes('</head>')) {
          reader.cancel();
          break;
        }
      }
      
      const metadata = parseHackerNoonHTML(html);
      metadataCache.set(txId, metadata);
      return metadata;
    }
    
    const html = await response.text();
    const metadata = parseHackerNoonHTML(html);
    
    // Cache the result
    metadataCache.set(txId, metadata);
    
    return metadata;
  } catch (error) {
    console.error(`Failed to fetch metadata for ${txId}:`, error);
    return null;
  }
};

// Batch fetch with concurrency control
export const fetchArticlesMetadata = async (
  txIds: string[],
  maxConcurrent = 3
): Promise<Map<string, ArticleMetadata>> => {
  const results = new Map<string, ArticleMetadata>();
  
  // Process in batches to avoid overwhelming the network
  for (let i = 0; i < txIds.length; i += maxConcurrent) {
    const batch = txIds.slice(i, i + maxConcurrent);
    const promises = batch.map(txId => 
      fetchArticleMetadata(txId)
        .then(metadata => {
          if (metadata) {
            results.set(txId, metadata);
          }
        })
        .catch(err => console.error(`Error fetching ${txId}:`, err))
    );
    
    await Promise.all(promises);
  }
  
  return results;
};

// Clear cache if needed (e.g., on memory pressure)
export const clearMetadataCache = () => {
  metadataCache.clear();
};