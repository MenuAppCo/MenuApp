import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { usePublicMenu } from "../hooks/usePublicMenu";
import { usePageTitle } from "../hooks/usePageTitle";
import { Star } from "lucide-react";
import ImageWithFallback from "../components/image-with-fallback/imageWithFallback";
import ProductViewModal from "../components/product-view-modal/productViewModal";
import MobileMenuContainer from "../components/mobile-menu-container/mobileMenuContainer";
import Header from "~/components/header/header";
import Footer from "~/components/footer/footer";
import CategoryHeader from "~/components/category-header/categoryHeader";

const PublicMenu = () => {
  const { slug, menuType = "food" } = useParams();
  const { data, isLoading, error } = usePublicMenu(slug, menuType);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRefs = useRef({});
  const scrollContainerRef = useRef(null);

  // Actualizar título de la página con el nombre del restaurante y tipo de menú
  const restaurantName = data?.data?.restaurant?.name;
  const menuTypeText =
    menuType.toLowerCase() === "food"
      ? "Comida"
      : menuType.toLowerCase() === "drinks"
        ? "Bebidas"
        : "Menú";
  usePageTitle(
    restaurantName ? `${restaurantName} - ${menuTypeText}` : menuTypeText,
  );

  useEffect(() => {
    if (data?.data?.categories?.length > 0) {
      setActiveCategory(data.data.categories[0].id);
    }
  }, [data]);

  // Función para hacer scroll a una categoría específica
  const scrollToCategory = (categoryId: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO fix
    const element = categoryRefs.current[categoryId];
    if (element && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const elementTop = element.offsetTop - 200; // Ajustar para el header y nav
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO fix
      container.scrollTo({
        top: elementTop,
        behavior: "smooth",
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO fix
      setActiveCategory(categoryId);
    }
  };

  useEffect(() => {
    // Función para detectar la categoría visible durante el scroll
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO fix
      const scrollTop = container.scrollTop + 200; // Offset para el header y nav

      const categories = data?.data?.categories || [];
      let newActiveCategory = categories[0]?.id;

      for (const category of categories) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TODO fix
        const element = categoryRefs.current[category.id];
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollTop >= elementTop && scrollTop < elementBottom) {
            newActiveCategory = category.id;
            break;
          }
        }
      }

      if (newActiveCategory !== activeCategory) {
        setActiveCategory(newActiveCategory);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO fix
      container.addEventListener("scroll", handleScroll);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO fix
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [data, activeCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Cargando menú...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-3">🍽️</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">
            Menú no encontrado
          </h1>
          <p className="text-gray-500 text-sm">
            El restaurante que buscas no está disponible.
          </p>
        </div>
      </div>
    );
  }

  const { restaurant, categories } = data.data;
  const settings = restaurant.settings || {};

  return (
    <MobileMenuContainer>
      <div className="min-h-screen bg-gray-50">
        {/* Contenedor principal con scroll único */}
        <div
          ref={scrollContainerRef}
          className="max-w-md mx-auto bg-white min-h-screen overflow-y-auto"
          style={{ height: "100vh" }}
        >
          <Header
            restaurant={{
              name: restaurant.name,
              logoUrl: restaurant.logoUrl,
            }}
            backTo={`/restaurants/${slug}/menus`}
          />

          {/* Navegador horizontal de categorías - Parte del scroll */}
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex overflow-x-auto scrollbar-hide">
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore TODO fix */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Contenido del menú */}
          <main className="pb-20">
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-gray-300 text-5xl mb-4">🍽️</div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Menú en preparación
                </h2>
                <p className="text-gray-500 text-sm text-center">
                  Pronto tendremos nuestro menú disponible.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore TODO fix */}
                {categories.map((category) => (
                  <section
                    key={category.id}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore TODO fix
                    ref={(el) => (categoryRefs.current[category.id] = el)}
                    className="border-b border-gray-100"
                  >
                    <CategoryHeader
                      category={{
                        name: category.name,
                        description: category.description,
                        imageUrl: category.imageUrl,
                      }}
                    />

                    {/* Productos de la categoría - Lista vertical centrada */}
                    <div className="divide-y divide-gray-50">
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                      {/* @ts-ignore TODO fix */}
                      {category.products.map((product) => (
                        <div
                          key={product.id}
                          className="px-6 py-6 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowModal(true);
                          }}
                        >
                          <div className="flex space-x-4">
                            {settings.showImages !== false &&
                              product.imageUrl &&
                              product.imageVisible && (
                                <ImageWithFallback
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                                  size="medium"
                                />
                              )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {product.name}
                                    </h3>
                                    {product.featured && (
                                      <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                                    )}
                                  </div>
                                  {product.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                      {product.description}
                                    </p>
                                  )}
                                </div>
                                {settings.showPrices !== false &&
                                  product.price && (
                                    <div className="ml-4 text-right flex-shrink-0">
                                      <span className="text-lg font-bold text-gray-900">
                                        {`$${product.price.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`}
                                      </span>
                                      <span className="text-xs text-gray-500 ml-1">
                                        COP
                                      </span>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>

          <Footer />
        </div>
      </div>

      <ProductViewModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setTimeout(() => setSelectedProduct(null), 300);
        }} // Esperar a que el modal cierre antes de limpiar el producto
        product={selectedProduct}
        restaurant={restaurant}
      />
    </MobileMenuContainer>
  );
};

export default PublicMenu;
