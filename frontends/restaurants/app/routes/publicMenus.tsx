import { useParams, Link } from "react-router";
import { useRestaurantInfo, useRestaurantMenus } from "../hooks/usePublicMenu";
import { usePageTitle } from "../hooks/usePageTitle";
import { ArrowLeft } from "lucide-react";
import MobileMenuContainer from "../components/mobile-menu-container/mobileMenuContainer";
import Header from "~/components/header/header";
import Footer from "~/components/footer/footer";
import SocialNetworks from "~/components/social-networks/socialNetworks";

const PublicMenus = () => {
  const { slug } = useParams();
  const {
    data: restaurantData,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useRestaurantInfo(slug);
  const {
    data: menusData,
    isLoading: menusLoading,
    error: menusError,
  } = useRestaurantMenus(slug);
  // TODO Actualizar título de la página con el nombre del restaurante
  const restaurantName = restaurantData?.data?.restaurant?.name;
  usePageTitle(restaurantName ? `${restaurantName} - Menús` : "Menús");

  const isLoading = restaurantLoading || menusLoading;
  const error = restaurantError || menusError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Cargando menús...</p>
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
            Restaurante no encontrado
          </h1>
          <p className="text-gray-500 text-sm">
            El restaurante que buscas no está disponible.
          </p>
        </div>
      </div>
    );
  }

  const { restaurant } = restaurantData.data;
  const menus = menusData?.data?.menus || [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO fix
  // Verificar si al menos un menú tiene descripción
  const hasAnyDescription = menus.some(
    (menu) => menu.description && menu.description.trim() !== "",
  );

  return (
    <MobileMenuContainer>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          <Header restaurant={restaurant} backTo={`/restaurants/${slug}`} />

          {/* Lista de menús */}
          <main className="p-4 flex-1 flex flex-col justify-start items-center">
            {menus.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-300 text-5xl mb-4">🍽️</div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay menús disponibles
                </h2>
                <p className="text-gray-500 text-sm">
                  Pronto tendremos nuestros menús disponibles.
                </p>
              </div>
            ) : (
              <div className="space-y-4 w-full flex flex-col items-center justify-center">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                {/* @ts-ignore TODO fix */}
                {menus.map((menu) => (
                  <Link
                    key={menu.id}
                    to={`/restaurants/${slug}/menu/${slug}/${menu.type || "food"}`}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all w-full max-w-md"
                  >
                    {hasAnyDescription ? (
                      // Layout consistente cuando al menos uno tiene descripción: todos con flecha
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {menu.name}
                          </h3>
                          {menu.description && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {menu.description}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <ArrowLeft className="h-3 w-3 text-gray-500 rotate-180" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Layout centrado solo cuando NINGUNO tiene descripción
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {menu.name}
                        </h3>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </main>

          <SocialNetworks restaurant={restaurant} />
          <Footer />
        </div>
      </div>
    </MobileMenuContainer>
  );
};

export default PublicMenus;
