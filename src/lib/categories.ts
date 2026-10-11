import {
  Building2,
  Home,
  Landmark,
  Tent,
  TreePine,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  apartment: Building2,
  flat: Building2,
  house: Home,
  villa: TreePine,
  studio: Tent,
  office: Landmark,
};

export function categoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category.trim().toLowerCase()] ?? Home;
}
