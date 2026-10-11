/**
 * The API stores a single optional `imageUrl` per property.
 * Listings without one fall back to a curated, deterministic gallery so the
 * UI always looks complete (documented in API_INTEGRATION.md).
 */

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const DEFAULT = [
  U("1522708323590-d24dbb6b0267"),
  U("1560448204-e02f11c3d0e2"),
  U("1502672260266-1c1ef2d93688"),
  U("1554995207-c18c203602cb"),
  U("1493809842364-78817add7ffb"),
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  apartment: [
    U("1560448204-e02f11c3d0e2"),
    U("1502672260266-1c1ef2d93688"),
    U("1554995207-c18c203602cb"),
    U("1522771739844-6a9f6d5f14af"),
    U("1567767292278-a4f21aa2d36e"),
  ],
  flat: [
    U("1560448204-e02f11c3d0e2"),
    U("1502672260266-1c1ef2d93688"),
    U("1554995207-c18c203602cb"),
    U("1567767292278-a4f21aa2d36e"),
  ],
  house: [
    U("1568605114967-8130f3a36994"),
    U("1512917774080-9991f1c4c750"),
    U("1600596542815-ffad4c1539a9"),
    U("1580587771525-78b9dba3b914"),
    U("1449844908441-8829872d2607"),
  ],
  villa: [
    U("1583608205776-bfd35f0d9f83"),
    U("1613490493576-7fde63acd811"),
    U("1600596542815-ffad4c1539a9"),
    U("1600607687939-ce8a6c25118c"),
  ],
  studio: [
    U("1540518614846-7eded433c457"),
    U("1567767292278-a4f21aa2d36e"),
    U("1524758631624-e2822e304c36"),
  ],
  office: [
    U("1497366754035-f200968a6e72"),
    U("1497366811353-6870744d04b2"),
    U("1524758631624-e2822e304c36"),
  ],
  "serviced apartment": [
    U("1502672260266-1c1ef2d93688"),
    U("1522708323590-d24dbb6b0267"),
    U("1631049307264-da0ec9d70304"),
  ],
};

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function fallbackList(category: string): string[] {
  return (
    CATEGORY_IMAGES[category.trim().toLowerCase()] ||
    CATEGORY_IMAGES[category.trim().toLowerCase().replace(/s$/, "")] ||
    DEFAULT
  );
}

export function propertyGallery(property: {
  id: string;
  category: string;
  imageUrl?: string | null;
}): string[] {
  const list = fallbackList(property.category);
  const offset = hash(property.id) % list.length;
  const rotated = [...list.slice(offset), ...list.slice(0, offset)];
  return property.imageUrl ? [property.imageUrl, ...rotated.slice(0, 4)] : rotated;
}

export function propertyImage(property: {
  id: string;
  category: string;
  imageUrl?: string | null;
}): string {
  return propertyGallery(property)[0];
}

/** Cover image used by category tiles on the home page. */
export function categoryImage(category: string): string {
  return fallbackList(category)[0];
}
