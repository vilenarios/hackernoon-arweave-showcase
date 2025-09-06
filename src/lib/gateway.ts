export const getGatewayUrl = (txId: string): string => {
  const hostname = window.location.hostname;
  
  // If running on localhost, use arweave.net
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `https://arweave.net/${txId}`;
  }
  
  // Extract the base domain from subdomains like hackernoon.permagate.io
  const parts = hostname.split('.');
  
  // Special case for ar.io - use arweave.net
  if (parts.length >= 2 && parts[parts.length - 2] === 'ar' && parts[parts.length - 1] === 'io') {
    return `https://arweave.net/${txId}`;
  }
  
  // For other gateways, use the gateway's domain
  // Remove the first subdomain (e.g., 'hackernoon' from 'hackernoon.permagate.io')
  if (parts.length > 2) {
    const gatewayDomain = parts.slice(1).join('.');
    return `https://${gatewayDomain}/${txId}`;
  }
  
  // Fallback to using the current domain
  return `https://${hostname}/${txId}`;
};