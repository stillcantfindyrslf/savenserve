export const getSortLabel = (sortOrder: string | null): string => {
  switch (sortOrder) {
    case 'priceAsc':
      return 'Сортировка: по цене (возр.)';
    case 'priceDesc':
      return 'Сортировка: по цене (убыв.)';
    case 'discountDesc':
      return 'Сортировка: по скидке';
    case 'newest':
      return 'Сортировка: новинки';
    default:
      return 'Сортировка';
  }
};