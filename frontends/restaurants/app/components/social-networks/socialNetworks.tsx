import { Instagram, Facebook, Star, ExternalLink } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SocialNetworks({ restaurant }: { restaurant: any }) {
  return (
    <>
      {Object.keys(restaurant.socialMedia).length > 0 && (
        <div className="rounded-lg p-4">
          <div className="flex justify-center space-x-4">
            {Object.entries(restaurant.socialMedia)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore TODO fix
              .filter(
                ([_, config]) =>
                  (config.active === true || config.isActive === true) &&
                  config.url &&
                  config.url.trim() !== "",
              )
              .map(([platform, config]) => (
                <button
                  key={platform}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore TODO fix
                  onClick={() => window.open(config.url, "_blank")}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-shadow hover:shadow-md"
                  title={`Síguenos en ${platform}`}
                >
                  {platform === "instagram" && (
                    <Instagram className="h-5 w-5 text-pink-600" />
                  )}
                  {platform === "facebook" && (
                    <Facebook className="h-5 w-5 text-blue-600" />
                  )}
                  {platform === "tripadvisor" && (
                    <Star className="h-5 w-5 text-green-600" />
                  )}
                  {platform === "tiktok" && (
                    <span className="text-black font-bold text-sm">TikTok</span>
                  )}
                  {!["instagram", "facebook", "tripadvisor", "tiktok"].includes(
                    platform,
                  ) && <ExternalLink className="h-5 w-5 text-gray-600" />}
                </button>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
