import api from "./api";

export const publicMenuService = {
  async getPublicMenu(slug: string | undefined, menuType = "food") {
    const response = await api.get(`/public/menu/${slug}/${menuType}`);
    return response.data;
  },

  async getRestaurantInfo(slug: string | undefined) {
    const response = await api.get(`/public/restaurant/${slug}`);
    return response.data;
  },

  async getRestaurantMenus(slug: string | undefined) {
    const response = await api.get(`/public/restaurant/${slug}/menus`);
    return response.data;
  },
};
