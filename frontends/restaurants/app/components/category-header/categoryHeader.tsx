import ImageWithFallback from "../image-with-fallback/imageWithFallback";

export default function CategoryHeader({
  category,
}: {
  category: { name: string; description?: string; imageUrl?: string };
}) {
  return (
    <div className="bg-white my-2">
      {category.imageUrl ? (
        <div className="flex justify-center">
          <ImageWithFallback
            src={category.imageUrl}
            alt={category.name}
            className="h-32 w-full object-cover"
            size="original"
          />
        </div>
      ) : (
        <div className="px-6 py-6 mb-4">
          <h2 className="text-xl font-bold text-gray-900 text-center">
            {category.name}
          </h2>
          {category.description && (
            <p className="text-gray-600 text-sm mt-1 text-center">
              {category.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
