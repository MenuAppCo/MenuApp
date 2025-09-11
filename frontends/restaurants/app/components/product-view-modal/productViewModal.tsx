import { X, Star } from "lucide-react";
import ImageWithFallback from "../image-with-fallback/imageWithFallback";
import Modal from "../modal/modal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductViewModal = ({
  isOpen,
  onClose,
  product,
  restaurant,
}: {
  isOpen: boolean;
  onClose?: () => void;
  product?: any;
  restaurant?: any;
}) => {
  const settings = restaurant?.settings || {};

  return (
    <Modal open={isOpen} onClose={onClose}>
      {product && (
        <div className="relative  bg-white rounded-lg w-full max-w-md max-h-[90vh] m-auto overflow-y-auto z-100">
          <div className="absolute right-0 top-0 px-4 py-3 flex w-full flex items-center justify-end gap-2">
            {product.featured && (
              <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="h-4 w-4 mr-1 fill-current" />
                Destacado
              </div>
            )}
            <button
              onClick={onClose}
              className="text-black rounded-full p-1 hover:text-black-600 bg-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {settings.showImages !== false &&
            product.imageUrl &&
            product.imageVisible && (
              <ImageWithFallback
                src={product.imageUrl}
                alt={product.name}
                className="h-[350px] w-full object-cover sm:h-[450px]"
                size="large"
              />
            )}
          <div className="p-4 space-y-3 flex flex-col">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {product.name}
              </h3>
              {settings.showPrices !== false && product.price && (
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {`$${product.price.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">COP</span>
                </div>
              )}
            </div>

            {product.description && (
              <div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductViewModal;
