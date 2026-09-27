import Image from "next/image";
import { useState, useMemo } from "react";

interface SourceCardProps {
  source: { name: string; url: string };
  onExclude?: () => void;
}

const SourceCard = ({ source, onExclude }: SourceCardProps) => {
  const [imageSrc, setImageSrc] = useState(`https://www.google.com/s2/favicons?domain=${source.url}&sz=128`);

  const handleImageError = () => {
    setImageSrc("/img/globe.svg");
  };
  
  // Extract and format the domain from the URL
  const formattedUrl = useMemo(() => {
    try {
      const urlObj = new URL(source.url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (e) {
      // If URL parsing fails, use the original URL but trim it
      return source.url.length > 50 ? source.url.substring(0, 50) + '...' : source.url;
    }
  }, [source.url]);

  return (
    <div className="flex min-h-[132px] w-full items-start gap-3 rounded-lg border border-solid border-gray-700/30 bg-gray-800/30 px-3 py-3 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-teal-500/30 md:w-[285px]">
      
        <img
          src={imageSrc}
          alt={source.url}
          className="p-1"
          width={44}
          height={44}
          onError={handleImageError}  // Update src on error
        />
      
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <h6 className="line-clamp-2 text-sm font-medium leading-[normal] text-white">
          {source.name}
        </h6>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={source.url}
          className="truncate text-sm font-light text-gray-300/60 hover:text-teal-300/80 transition-colors"
          title={source.url}
        >
          {formattedUrl}
        </a>
        <p className="text-xs leading-5 text-gray-400">
          Selected because its content matched the approved research questions. Inclusion is not a credibility endorsement.
        </p>
        {onExclude && (
          <button
            type="button"
            onClick={onExclude}
            className="min-h-11 self-start rounded-md border border-gray-600 px-3 text-xs font-medium text-gray-200 hover:border-red-400 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Exclude source
          </button>
        )}
      </div>
    </div>
  );
};

export default SourceCard;
