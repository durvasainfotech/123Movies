/**
 * Combines multiple class names into a single string
 * Handles strings, objects, and arrays
 */
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a date string into a more readable format
 * @example "2023-10-15" -> "October 15, 2023"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatRuntime = (minutes: number): string => {
  if (!minutes) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

export const getYearFromDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear().toString();
};

export const formatCurrency = (amount: number): string => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getTrailerKey = (videos: any[]): string | null => {
  if (!videos || !videos.length) return null;
  
  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? trailer.key : null;
};

/**
 * Generates a URL-friendly slug from a string
 * @example "The Dark Knight (2008)" -> "the-dark-knight-2008"
 */
export const generateSlug = (title: string, year?: string | number): string => {
  if (!title) return '';
  
  // Convert to lowercase and replace spaces with hyphens
  let slug = title
    .toLowerCase()
    // Remove special characters but keep spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with a single hyphen
    .replace(/--+/g, '-')
    // Remove leading/trailing hyphens
    .trim();

  // Add year if provided
  if (year) {
    slug = `${slug}-${year}`;
  }

  return slug;
};
