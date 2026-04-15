import { ProductComment } from "@/types/domain";

export const commentsByProductSlug: Record<string, ProductComment[]> = {
  "samsung-galaxy-s25-ultra-512gb": [
    {
      id: "c1",
      productSlug: "samsung-galaxy-s25-ultra-512gb",
      author: "buraktech",
      authorBadge: "Deal Veteran",
      content: "Bu fiyat son 90 günün en düşük seviyesi gibi duruyor.",
      upvotes: 34,
      createdAt: "2h ago",
      replies: [
        {
          id: "c1-r1",
          productSlug: "samsung-galaxy-s25-ultra-512gb",
          author: "locallegend",
          authorBadge: "City Hero",
          content: "Aynen, geçen hafta 52k altına inmemişti.",
          upvotes: 12,
          createdAt: "1h ago"
        }
      ]
    },
    {
      id: "c2",
      productSlug: "samsung-galaxy-s25-ultra-512gb",
      author: "fps_deals",
      authorBadge: "Power User",
      content: "Bankaya göre ekstra taksit kampanyası var, kontrol edin.",
      upvotes: 21,
      createdAt: "45m ago"
    }
  ],
  "sony-wh1000xm6": [
    {
      id: "c3",
      productSlug: "sony-wh1000xm6",
      author: "soundpilot",
      authorBadge: "Audio Pro",
      content: "XM5'ten XM6'ya geçtim, ANC farkı gerçekten hissediliyor.",
      upvotes: 28,
      createdAt: "3h ago",
      replies: [
        {
          id: "c3-r1",
          productSlug: "sony-wh1000xm6",
          author: "budslover",
          authorBadge: "Deal Sniper",
          content: "Bluetooth 5.4 desteği de büyük artı.",
          upvotes: 9,
          createdAt: "2h ago"
        }
      ]
    },
    {
      id: "c4",
      productSlug: "sony-wh1000xm6",
      author: "pulsefindr",
      authorBadge: "Audio Pro",
      content: "AudioHub'da bu fiyat sadece bu hafta geçerli, kaçırmayın.",
      upvotes: 15,
      createdAt: "1h ago"
    }
  ],
  "asus-rog-zephyrus-g16": [
    {
      id: "c5",
      productSlug: "asus-rog-zephyrus-g16",
      author: "fps_deals",
      authorBadge: "Power User",
      content: "RTX 4080 ile bu fiyat segmentinde rakipsiz performans.",
      upvotes: 42,
      createdAt: "5h ago",
      replies: [
        {
          id: "c5-r1",
          productSlug: "asus-rog-zephyrus-g16",
          author: "ultralight",
          authorBadge: "Notebook Pro",
          content: "Termal performansı da gayet iyi, stres testlerinde 85°C'yi geçmiyor.",
          upvotes: 18,
          createdAt: "4h ago"
        },
        {
          id: "c5-r2",
          productSlug: "asus-rog-zephyrus-g16",
          author: "dealmancer",
          authorBadge: "Mobile Expert",
          content: "GameCore'da ekstra mouse hediye kampanyası da varmış.",
          upvotes: 7,
          createdAt: "3h ago"
        }
      ]
    }
  ],
  "iphone-16-pro-256gb-midnight": [
    {
      id: "c6",
      productSlug: "iphone-16-pro-256gb-midnight",
      author: "applewatcher",
      authorBadge: "Verified",
      content: "Apple Trade-In ile eski cihazınızı verirseniz ekstra 5000 TL indirim alabilirsiniz.",
      upvotes: 37,
      createdAt: "4h ago",
      replies: [
        {
          id: "c6-r1",
          productSlug: "iphone-16-pro-256gb-midnight",
          author: "dealhunter_oz",
          authorBadge: "Top Curator",
          content: "iPhone 14 Pro için 18k verdiler geçen hafta.",
          upvotes: 14,
          createdAt: "3h ago"
        }
      ]
    },
    {
      id: "c7",
      productSlug: "iphone-16-pro-256gb-midnight",
      author: "buraktech",
      authorBadge: "Deal Veteran",
      content: "Midnight renk seçeneği stokta az kalmış, acele edin.",
      upvotes: 19,
      createdAt: "2h ago"
    }
  ],
  "playstation-5-slim-dualsense-bundle": [
    {
      id: "c8",
      productSlug: "playstation-5-slim-dualsense-bundle",
      author: "switchhunter",
      authorBadge: "Console Ninja",
      content: "Bundle fiyatı tek konsol fiyatının sadece 2k üstünde, DualSense bedava gibi.",
      upvotes: 51,
      createdAt: "6h ago",
      replies: [
        {
          id: "c8-r1",
          productSlug: "playstation-5-slim-dualsense-bundle",
          author: "fps_deals",
          authorBadge: "Power User",
          content: "ConsoleArena'da 3 oyun hediye kampanyası da var bu bundle ile.",
          upvotes: 23,
          createdAt: "5h ago"
        }
      ]
    },
    {
      id: "c9",
      productSlug: "playstation-5-slim-dualsense-bundle",
      author: "dealmancer",
      authorBadge: "Mobile Expert",
      content: "Geçen yıl aynı dönemde 28k civarıydı, güzel düşmüş.",
      upvotes: 16,
      createdAt: "3h ago"
    }
  ],
  "macbook-air-m4-15-inch": [
    {
      id: "c10",
      productSlug: "macbook-air-m4-15-inch",
      author: "ultralight",
      authorBadge: "Notebook Pro",
      content: "M4 çipinin performans/watt oranı inanılmaz. Fansız tasarım ve 18 saat pil ömrü.",
      upvotes: 33,
      createdAt: "7h ago",
      replies: [
        {
          id: "c10-r1",
          productSlug: "macbook-air-m4-15-inch",
          author: "applewatcher",
          authorBadge: "Verified",
          content: "Eğitim indirimi ile 56k'ya düşüyor, öğrenciler kaçırmasın.",
          upvotes: 20,
          createdAt: "6h ago"
        }
      ]
    }
  ],
  "jbl-charge-6-portable-speaker": [
    {
      id: "c11",
      productSlug: "jbl-charge-6-portable-speaker",
      author: "soundpilot",
      authorBadge: "Audio Pro",
      content: "IP67 dayanıklılık ve 24 saat pil ömrü ile yaz için mükemmel seçim.",
      upvotes: 22,
      createdAt: "4h ago"
    },
    {
      id: "c12",
      productSlug: "jbl-charge-6-portable-speaker",
      author: "budslover",
      authorBadge: "Deal Sniper",
      content: "Charge 5'e göre bas performansı gözle görülür şekilde artmış.",
      upvotes: 11,
      createdAt: "2h ago",
      replies: [
        {
          id: "c12-r1",
          productSlug: "jbl-charge-6-portable-speaker",
          author: "pulsefindr",
          authorBadge: "Audio Pro",
          content: "Powerbank özelliği de hala var, festivallerde çok işe yarıyor.",
          upvotes: 8,
          createdAt: "1h ago"
        }
      ]
    }
  ]
};
