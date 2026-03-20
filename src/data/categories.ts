import { CategoryNode } from "@/types/domain";

export const categories: CategoryNode[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    icon: "Smartphone",
    trending: true,
    children: [
      {
        id: "phones",
        name: "Phones",
        slug: "phones",
        icon: "Phone",
        children: [
          {
            id: "android",
            name: "Android",
            slug: "android",
            icon: "Cpu",
            children: [
              { id: "samsung", name: "Samsung", slug: "samsung", icon: "Sparkles" },
              { id: "xiaomi", name: "Xiaomi", slug: "xiaomi", icon: "Flame" }
            ]
          },
          { id: "ios", name: "iOS", slug: "ios", icon: "Apple" }
        ]
      },
      {
        id: "laptops",
        name: "Laptops",
        slug: "laptops",
        icon: "Laptop",
        children: [
          { id: "ultrabooks", name: "Ultrabooks", slug: "ultrabooks", icon: "MonitorSmartphone" },
          { id: "gaming", name: "Gaming", slug: "gaming", icon: "Gamepad2" }
        ]
      }
    ]
  },
  {
    id: "home",
    name: "Home",
    slug: "home",
    icon: "House",
    trending: true,
    children: [
      { id: "kitchen", name: "Kitchen", slug: "kitchen", icon: "ChefHat" },
      { id: "cleaning", name: "Cleaning", slug: "cleaning", icon: "SprayCan" }
    ]
  },
  {
    id: "gaming",
    name: "Gaming",
    slug: "gaming",
    icon: "Gamepad2",
    trending: true,
    children: [
      { id: "consoles", name: "Consoles", slug: "consoles", icon: "Gamepad2" },
      { id: "accessories-gaming", name: "Accessories", slug: "accessories-gaming", icon: "Gem" }
    ]
  },
  {
    id: "audio",
    name: "Audio",
    slug: "audio",
    icon: "Sparkles",
    children: [
      { id: "headphones", name: "Headphones", slug: "headphones", icon: "Sparkles" },
      { id: "speakers", name: "Speakers", slug: "speakers", icon: "Flame" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    icon: "Shirt",
    children: [
      { id: "sneakers", name: "Sneakers", slug: "sneakers", icon: "Footprints", trending: true },
      { id: "accessories", name: "Accessories", slug: "accessories", icon: "Gem" }
    ]
  }
];

export const recentlyVisitedCategories = ["Samsung", "Gaming", "Kitchen", "Sneakers", "Audio", "Consoles"];
