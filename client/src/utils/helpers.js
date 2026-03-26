export const formatPrice = (amount, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

export const truncate = (str, n) => str.length > n ? str.slice(0, n) + '…' : str;

export const getCoverImage = (images) =>
  images?.find(i => i.isCover)?.url || images?.[0]?.url || '/placeholder.jpg';