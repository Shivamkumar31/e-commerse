export interface CartProduct {
  id: number;
  slug: string;
  title: string;
  price: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

export function addItemToCart(items: CartItem[], product: CartProduct): CartItem[] {
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [...items, { ...product, quantity: 1 }];
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
