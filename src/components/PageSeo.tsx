import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

interface PageSEOProps {
  title: string;
  location?: string; 
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  children?: React.ReactNode;
}

/**
 * PageSEO component for optimizing page titles and metadata with location
 * 
 * @example
 * <PageSEO 
 *   title="User Management" 
 *   location="Mumbai" 
 *   description="Manage your Netsbay users efficiently"
 * />
 */
export const PageSEO = ({ 
  title, 
  location, 
  description, 
  keywords = [], 
  canonicalUrl,
  children 
}: PageSEOProps) => {
  const formattedTitle =`Netbay | ${title}`;

  const seoDescription = description || 
    `Explore ${title} ${location ? `in ${location}` : ''} with Netbay - Your trusted cloud solution provider`;

  const seoKeywords = [
    "netbay",
    "cloud hosting",
    title.toLowerCase(),
    ...(location ? [location.toLowerCase()] : []),
    ...keywords
  ].join(", ");

  // Update document title directly for cases when Helmet might be delayed
  useEffect(() => {
    document.title = formattedTitle;
  }, [formattedTitle]);

  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={seoDescription} />
      {location && <meta property="og:locale" content={`en_${location.replace(/\s+/g, '')}`} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={seoDescription} />
      
      {/* Schema.org structured data */}
      {location && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Netbay",
            "url": window.location.href,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location
            }
          })}
        </script>
      )}
      {children}
    </Helmet>
  );
};