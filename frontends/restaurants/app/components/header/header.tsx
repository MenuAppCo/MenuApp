import { ArrowLeft, Languages } from "lucide-react";
import { Link } from "react-router";
import ImageWithFallback from "../image-with-fallback/imageWithFallback";

export default function Header({
  backTo,
  restaurant,
}: {
  backTo: string;
  restaurant: { name: string; logoUrl?: string };
}) {
  return (
    <header className="px-4 py-4 bg-white border-b border-gray-200">
      <div className="relative flex items-center justify-center">
        <Link
          to={backTo}
          className="absolute left-0 text-gray-600 hover:text-gray-900 p-2 -ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="mx-auto flex items-center justify-center">
          {restaurant.logoUrl ? (
            <ImageWithFallback
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="h-24 w-24 rounded-full object-cover flex-shrink-0"
              size="medium"
            />
          ) : (
            <h1 className="text-lg font-bold text-gray-900">
              {restaurant.name}
            </h1>
          )}
        </div>

        <Languages className="absolute right-0 h-5 w-5" />
      </div>
    </header>
  );
}
