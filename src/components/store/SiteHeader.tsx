import { getCategories } from "@/lib/data";
import { HeaderClient } from "./HeaderClient";

export async function SiteHeader() {
  const categories = await getCategories();
  return <HeaderClient categories={categories} />;
}
