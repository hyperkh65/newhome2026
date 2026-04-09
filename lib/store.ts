import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  specs: Record<string, string>;
  images: string[];
  certificates?: string[];
  badge?: string;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdminState {
  isLoggedIn: boolean;
  products: Product[];
  login: (pw: string) => boolean;
  logout: () => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  cartTotal: () => number;
  cartCount: () => number;
}

// Demo products
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1', name: 'SmartMesh 게이트웨이 Pro', category: '스마트조명시스템',
    price: 350000,
    description: '공장 및 대형 빌딩을 위한 무선 스마트 조명 제어 허브. 1000개 이상의 노드 동시 제어 가능.',
    specs: { '통신': 'Zigbee 3.0 / Matter', '최대노드': '1000+', '전원': 'AC 100-240V', '크기': '200x150x45mm' },
    images: ['/panel-interior.png'],
    certificates: ['https://example.com/cert-kc.pdf', 'https://example.com/cert-ce.pdf'],
    badge: 'NEW', stock: 100, rating: 5.0, reviews: 12, featured: true,
    createdAt: '2025-01-01'
  },
  {
    id: '2', name: 'SmartMesh 모션 센서', category: '스마트조명시스템',
    price: 45000, originalPrice: 60000,
    description: '주차장 및 복도용 고감도 마이크로웨이브 모션 센서. 게이트웨이와 무선 연동.',
    specs: { '감지범위': '반경 8m', '감지방식': '5.8GHz Microwave', '보호등급': 'IP44', '배터리': 'CR123A (최대 3년)' },
    images: ['/strip-glow.png'],
    certificates: ['https://example.com/kc.pdf'],
    badge: 'BEST', stock: 500, rating: 4.8, reviews: 89, featured: true,
    createdAt: '2025-01-15'
  },
  {
    id: '3', name: '울트라 씬 엣지 평판 1200x300', category: '실내조명',
    price: 85000,
    description: '사무실용 초박형 LED 평판 조명. 플리커프리 및 눈부심 방지 설계. 높은 에너지 효율.',
    specs: { '크기': '1200x300mm', '전력': '40W', '광효율': '130lm/W', 'CRI': '>90', 'UGR': '<19' },
    images: ['/panel-interior.png'],
    certificates: ['https://example.com/ks.pdf', 'https://example.com/energy.pdf'],
    stock: 300, rating: 4.7, reviews: 64, featured: false,
    createdAt: '2025-02-01'
  },
  {
    id: '4', name: '하이베이 공장등 150W', category: '산업용조명',
    price: 185000,
    description: '대형 공장 및 물류 창고용 고천장등. 다이캐스팅 알루미늄 방열 설계로 긴 수명 보장.',
    specs: { '전력': '150W', '광속': '21000lm', '광효율': '140lm/W', '방수방진': 'IP65', '수명': '50,000hr' },
    images: ['/hero-main.png'],
    certificates: ['https://example.com/iso9001.pdf', 'https://example.com/ce.pdf'],
    stock: 120, rating: 4.9, reviews: 45, featured: false,
    createdAt: '2025-02-10'
  },
  {
    id: '5', name: '스마트 LED 가로등 100W', category: '실외조명',
    price: 320000, originalPrice: 380000,
    description: '도로 및 산업단지용 고효율 LED 가로등. NEMA 소켓 적용으로 스마트 제어기 결합 가능.',
    specs: { '전력': '100W', '광속': '15000lm', 'IP등급': 'IP66', 'IK등급': 'IK08', '스마트': 'NEMA 7Pin' },
    images: ['/strip-glow.png'],
    certificates: ['https://example.com/ks.pdf'],
    badge: 'SALE', stock: 80, rating: 4.8, reviews: 37, featured: true,
    createdAt: '2025-03-01'
  },
  {
    id: '6', name: '의료/클린룸용 무진등', category: '특수조명',
    price: 155000,
    description: '반도체 공장, 병원, 제약회사용 클린룸 조명. 먼지 쌓임 방지 및 완벽 밀폐형 구조.',
    specs: { '전력': '50W', '크기': '1200x300mm', '방수방진': 'IP65', '재질': '항균강판/PC', '무게': '3.2kg' },
    images: ['/panel-interior.png'],
    certificates: ['https://example.com/haccp.pdf'],
    stock: 45, rating: 4.6, reviews: 28, featured: false,
    createdAt: '2025-03-10'
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      products: DEMO_PRODUCTS,
      login: (pw) => {
        if (pw === 'admin1234') { set({ isLoggedIn: true }); return true; }
        return false;
      },
      logout: () => set({ isLoggedIn: false }),
      addProduct: (p) => set((s) => ({
        products: [...s.products, { ...p, id: Date.now().toString(), createdAt: new Date().toISOString() }]
      })),
      updateProduct: (id, p) => set((s) => ({
        products: s.products.map((prod) => prod.id === id ? { ...prod, ...p } : prod)
      })),
      deleteProduct: (id) => set((s) => ({
        products: s.products.filter((p) => p.id !== id)
      })),
    }),
    { name: 'led-admin-store' }
  )
);

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      addToCart: (product, qty = 1) => set((s) => {
        const existing = s.cart.find((i) => i.product.id === product.id);
        if (existing) return { cart: s.cart.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i) };
        return { cart: [...s.cart, { product, quantity: qty }] };
      }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.product.id !== id) })),
      updateQty: (id, qty) => set((s) => ({
        cart: qty === 0 ? s.cart.filter((i) => i.product.id !== id) : s.cart.map((i) => i.product.id === id ? { ...i, quantity: qty } : i)
      })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (id) => set((s) => ({
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id]
      })),
      cartTotal: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'led-shop-store' }
  )
);
