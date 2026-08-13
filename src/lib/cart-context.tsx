"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { CartItem, InstallationType } from "@/lib/types";
import { siteConfig } from "@/config/site";
import type { PricingConfig } from "@/lib/pricing";

const STORAGE_KEY = "cart:v2";

type CartState = {
  items: CartItem[];
  installationType: InstallationType;
  replacementSerial: string;
};

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; productId: string }
  | { type: "SET_QTY"; productId: string; quantity: number }
  | { type: "SET_WARRANTY"; productId: string; underWarranty: boolean }
  | { type: "SET_INSTALLATION"; installationType: InstallationType }
  | { type: "SET_SERIAL"; replacementSerial: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

const initialState: CartState = {
  items: [],
  installationType: "NONE",
  replacementSerial: "",
};

function defaultPricing(): PricingConfig {
  return {
    shippingFlatRate: siteConfig.shipping.flatRate,
    freeShippingThreshold: siteConfig.shipping.freeShippingThreshold,
    installationFee: siteConfig.installation.fee,
  };
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
            i.productId === action.item.productId ? { ...i, quantity } : i
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
    case "SET_INSTALLATION":
      return {
        ...state,
        installationType: action.installationType,
        replacementSerial: action.installationType === "WARRANTY" ? state.replacementSerial : "",
      };
    case "SET_SERIAL":
      return { ...state, replacementSerial: action.replacementSerial };
    case "CLEAR":
      return { ...initialState };
    case "HYDRATE":
      return {
        items: action.state.items ?? [],
        installationType: action.state.installationType ?? "NONE",
        replacementSerial: action.state.replacementSerial ?? "",
      };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  installationType: InstallationType;
  replacementSerial: string;
  pricing: PricingConfig;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setUnderWarranty: (productId: string, underWarranty: boolean) => void;
  setInstallationType: (installationType: InstallationType) => void;
  setReplacementSerial: (serial: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  listSubtotal: number;
  productsSubtotal: number;
  installationFee: number;
  shipping: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pricing, setPricing] = useState<PricingConfig>(defaultPricing);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("cart:v1");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        dispatch({ type: "HYDRATE", state: { ...initialState, items: parsed } });
      } else if (parsed.items) {
        dispatch({
          type: "HYDRATE",
          state: {
            items: parsed.items,
            installationType: parsed.installationType ?? "NONE",
            replacementSerial: parsed.replacementSerial ?? "",
          },
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

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
    const installationFee = state.installationType === "PAID" ? pricing.installationFee : 0;
    const shipping =
      productsSubtotal + installationFee === 0
        ? 0
        : productsSubtotal + installationFee >= pricing.freeShippingThreshold
          ? 0
          : pricing.shippingFlatRate;
    const total = productsSubtotal + installationFee + shipping;

    return {
      items: state.items,
      installationType: state.installationType,
      replacementSerial: state.replacementSerial,
      pricing,
      addItem: (item) => dispatch({ type: "ADD", item }),
      removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
      setQuantity: (productId, quantity) => dispatch({ type: "SET_QTY", productId, quantity }),
      setUnderWarranty: (productId, underWarranty) =>
        dispatch({ type: "SET_WARRANTY", productId, underWarranty }),
      setInstallationType: (installationType) =>
        dispatch({ type: "SET_INSTALLATION", installationType }),
      setReplacementSerial: (replacementSerial) =>
        dispatch({ type: "SET_SERIAL", replacementSerial }),
      clear: () => dispatch({ type: "CLEAR" }),
      count,
      subtotal: productsSubtotal,
      listSubtotal,
      productsSubtotal,
      installationFee,
      shipping,
      total,
    };
  }, [state, pricing]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
