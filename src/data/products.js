export const printingMethods = [
  {
    name: "DTF Printing",
    description: "Direct-to-Film for vibrant, full-color designs on any fabric",
  },
  {
    name: "Screen Printing",
    description: "Classic bulk printing for crisp, durable results",
  },
  {
    name: "Vinyl Printing",
    description: "Perfect for names, numbers, and bold graphics",
  },
  {
    name: "Sublimation",
    description: "Photographic-quality all-over prints on polyester",
  },
  {
    name: "Heat Transfer",
    description: "Versatile method for complex, multi-color designs",
  },
];

export const tshirtDetails = {
  materials: ["Polyester", "Cotton"],
  sizes: ["S", "M", "L", "XL", "XXL"],
  startingPrice: 130,
  useCases: [
    "College Clubs & Societies",
    "Cultural Fests & Events",
    "Corporate Teams",
    "Promotional Campaigns",
    "Sports Tournaments",
    "Reunions & Gatherings",
  ],
};

export const serviceCategories = [
  {
    id: "tshirts",
    title: "T-Shirt Printing",
    tagline: "Custom Tees That Make a Statement",
    description:
      "From college club merch to corporate team wear — premium custom t-shirts starting at just ₹130. Choose your fabric, pick your method, and let us bring your design to life.",
    featured: true,
    startingPrice: "₹130",
    items: [
      "Polyester T-Shirts",
      "Cotton T-Shirts",
      "Oversized Tees",
      "Polo Shirts",
      "Round Neck",
      "V-Neck",
    ],
  },
  {
    id: "stationery",
    title: "Corporate Stationery",
    tagline: "Brand Every Touchpoint",
    description:
      "Elevate your brand identity with custom-printed pens, diaries, notebooks, ID cards, and lanyards — perfect for corporate gifting and events.",
    featured: false,
    items: [
      "Branded Pens",
      "Custom Diaries",
      "Notebooks",
      "ID Cards",
      "Lanyards",
    ],
  },
  {
    id: "bags",
    title: "Bag Collection",
    tagline: "Carry Your Brand Everywhere",
    description:
      "Custom-branded bags for every occasion — from school backpacks to executive laptop bags and travel duffles.",
    featured: false,
    items: [
      "School Bags",
      "Laptop Bags",
      "Sling Bags",
      "Duffle Bags",
      "Backpacks",
      "Travel Bags",
    ],
  },
];

export const contactInfo = {
  // General contact — call/chat
  phones: ["+91 8400519209"],
  // Order-specific routing
  orderWhatsapp: "919555081161",
  orderEmail: "lowkeyinsilence@gmail.com",
  // General contact WhatsApp (for chat button)
  whatsapp: "918400519209",
};

// Unsplash images for printing methods
export const methodImages = {
  "DTF Printing": "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
  "Screen Printing": "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
  "Vinyl Printing": "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80",
  "Sublimation": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  "Heat Transfer": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
};

// Unsplash images for stationery & bags
export const productImages = {
  "Branded Pens": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80",
  "Custom Diaries": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80",
  "Notebooks": "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80",
  "ID Cards": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
  "Lanyards": "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=400&q=80",
  "School Bags": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  "Laptop Bags": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80",
  "Sling Bags": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80",
  "Duffle Bags": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  "Backpacks": "https://images.unsplash.com/photo-1581605405669-fcdf81165b7c?w=400&q=80",
  "Travel Bags": "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&q=80",
};
