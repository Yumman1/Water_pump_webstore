"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { CartItem } from "@/lib/types";
import { siteConfig } from "@/config/site";
import type { PricingConfig } from "@/lib/pricing";
import type { DeliveryCityOption } from "@/lib/delivery";

const STORAGE_KEY = "cart:v5";
const LEGACY_STORAGE_KEYS = ["cart:v4", "cart:v3"];

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; productId: string }
  | { type: "SET_QTY"; productId: string; quantity: number }
  | { type: "SET_WARRANTY"; productId: string; underWarranty: boolean }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

const initialState: CartState = { items: [] };

function defaultPricing(): PricingConfig {
  return {
    shippingFlatRate: siteConfig.shipping.flatRate,
    freeShippingThreshold: siteConfig.shipping.freeShippingThreshold,
    installationFee: siteConfig.installation.fee,
  };
}

function defaultDeliveryCities(): DeliveryCityOption[] {
  return siteConfig.delivery.outsideCities.map((c) => ({ name: c.name, fee: c.fee }));
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.productId === action.item.productId);
      if (existing) {
        const quantity = Math.min(existing.quantity + action.item.quantity, action.item.stock || 999);
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? {
                  ...i,
                  quantity,
                  image: action.item.image || i.image,
                  video: action.item.video ?? i.video,
                  stock: action.item.stock,
                  price: action.item.price,
                }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, underWarranty: false }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
    case "SET_QTY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.productId === action.productId
              ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.stock || 999)) }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "SET_WARRANTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, underWarranty: action.underWarranty } : i
        ),
      };
    case "CLEAR":
      return { ...initialState };
    case "HYDRATE":
      return { items: action.state.items ?? [] };
    default:
      return state;
  }
}

export type CheckoutPricing = PricingConfig & {
  serviceCity: string;
  deliveryCities: DeliveryCityOption[];
};

type CartContextValue = {
  items: CartItem[];
  pricing: CheckoutPricing;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setUnderWarranty: (productId: string, underWarranty: boolean) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  listSubtotal: number;
  productsSubtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pricing, setPricing] = useState<CheckoutPricing>({
    ...defaultPricing(),
    serviceCity: siteConfig.delivery.serviceCity,
    deliveryCities: defaultDeliveryCities(),
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const items = Array.isArray(parsed) ? parsed : parsed?.items;
        if (Array.isArray(items)) {
          dispatch({ type: "HYDRATE", state: { items } });
        }
      }
      for (const key of LEGACY_STORAGE_KEYS) localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [hydrated, state]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/pricing")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setPricing({
          shippingFlatRate: Number(data.shippingFlatRate) || defaultPricing().shippingFlatRate,
          freeShippingThreshold: Number(data.freeShippingThreshold) || defaultPricing().freeShippingThreshold,
          installationFee: Number(data.installationFee) || defaultPricing().installationFee,
          serviceCity: data.serviceCity || siteConfig.delivery.serviceCity,
          deliveryCities: Array.isArray(data.deliveryCities)
            ? data.deliveryCities.map((c: DeliveryCityOption) => ({
                id: c.id,
                name: String(c.name),
                fee: Number(c.fee) || 0,
              }))
            : defaultDeliveryCities(),
        });
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    const listSubtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const productsSubtotal = state.items.reduce(
      (sum, i) => sum + (i.underWarranty ? 0 : i.price * i.quantity),
      0
    );

    return {
      items: state.items,
      pricing,
      addItem: (item) => dispatch({ type: "ADD", item }),
      removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
      setQuantity: (productId, quantity) => dispatch({ type: "SET_QTY", productId, quantity }),
      setUnderWarranty: (productId, underWarranty) =>
        dispatch({ type: "SET_WARRANTY", productId, underWarranty }),
      clear: () => dispatch({ type: "CLEAR" }),
      count,
      subtotal: productsSubtotal,
      listSubtotal,
      productsSubtotal,
    };
  }, [state, pricing]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
