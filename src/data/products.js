// Product Categories
export const categories = [
  {
    id: 'akademisyen',
    name: 'Akademisyen Cübbeleri',
    description: 'Kalite, performans ve fiyat avantajlı akademisyen cübbe modelleri',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
    productCount: 8
  },
  {
    id: 'universite',
    name: 'Üniversite Mezuniyet Cübbe ve Kepleri',
    description: 'Modern üniversite mezuniyet cübbeleri ve kep modelleri',
    image: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&h=400&fit=crop',
    productCount: 12
  },
  {
    id: 'lise',
    name: 'Lise Mezuniyet Cübbe ve Kepleri',
    description: 'Göz alıcı lise mezuniyet cübbe ve kep modelleri',
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=400&fit=crop',
    productCount: 15
  },
  {
    id: 'ortaokul',
    name: 'Ortaokul Mezuniyet Cübbe ve Kepleri',
    description: 'Her bedene uygun ortaokul mezuniyet cübbe ve kepleri',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop',
    productCount: 10
  },
  {
    id: 'ilkokul',
    name: 'İlkokul Mezuniyet Cübbe ve Kepleri',
    description: 'İlkokul öğrencileri için özel tasarım cübbe ve kepler',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    productCount: 8
  },
  {
    id: 'anaokulu',
    name: 'Anaokulu Mezuniyet Cübbe ve Kepleri',
    description: 'Minikler için birbirinden güzel cübbe ve kep modelleri',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop',
    productCount: 10
  },
  {
    id: 'kepler',
    name: 'Mezuniyet Kepleri',
    description: 'Kristal satenden üretilmiş kaliteli mezuniyet kepleri',
    image: 'https://images.unsplash.com/photo-1564585222527-c2777e60752e?w=600&h=400&fit=crop',
    productCount: 6
  }
];

// Colors available
export const colors = [
  { id: 'siyah', name: 'Siyah', hex: '#1a1a1a' },
  { id: 'lacivert', name: 'Lacivert', hex: '#1a2744' },
  { id: 'bordo', name: 'Bordo', hex: '#722f37' },
  { id: 'yesil', name: 'Yeşil', hex: '#2d5a27' },
  { id: 'mor', name: 'Mor', hex: '#4a235a' },
  { id: 'mavi', name: 'Mavi', hex: '#1a5276' },
  { id: 'kirmizi', name: 'Kırmızı', hex: '#922b21' },
  { id: 'sari', name: 'Sarı', hex: '#d4ac0d' }
];

// Sizes available
export const sizes = [
  { id: 'xxs', name: 'XXS', description: '3-5 yaş' },
  { id: 'xs', name: 'XS', description: '5-7 yaş' },
  { id: 's', name: 'S', description: '8-10 yaş' },
  { id: 'm', name: 'M', description: '11-13 yaş' },
  { id: 'l', name: 'L', description: '14-16 yaş' },
  { id: 'xl', name: 'XL', description: 'Yetişkin S' },
  { id: 'xxl', name: 'XXL', description: 'Yetişkin M' },
  { id: 'xxxl', name: 'XXXL', description: 'Yetişkin L' }
];

// Products
export const products = [
  // Akademisyen Cübbeleri
  {
    id: 1,
    name: 'Premium Akademisyen Cübbesi',
    category: 'akademisyen',
    price: 1250,
    oldPrice: 1500,
    description: 'Yüksek kaliteli kumaştan üretilmiş, profesyonel görünümlü akademisyen cübbesi. Özel günlerinizde kalite ve şıklığı bir arada yaşayın.',
    features: ['%100 Polyester', 'Su geçirmez', 'Kolay ütülenir', 'Fermuarlı'],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564585222527-c2777e60752e?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert', 'bordo'],
    sizes: ['xl', 'xxl', 'xxxl'],
    inStock: true,
    featured: true,
    bestseller: true
  },
  {
    id: 2,
    name: 'Klasik Akademisyen Cübbesi',
    category: 'akademisyen',
    price: 950,
    description: 'Klasik tasarımlı, her tören için uygun akademisyen cübbesi.',
    features: ['%100 Polyester', 'Hafif kumaş', 'Kolay yıkanır'],
    images: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert'],
    sizes: ['xl', 'xxl', 'xxxl'],
    inStock: true,
    featured: false
  },
  
  // Üniversite Mezuniyet
  {
    id: 3,
    name: 'Üniversite Mezuniyet Seti',
    category: 'universite',
    price: 650,
    oldPrice: 800,
    description: 'Cübbe ve kep dahil komple üniversite mezuniyet seti. Şık tasarım ve kaliteli kumaş.',
    features: ['Cübbe + Kep dahil', 'Premium kumaş', 'Püskül dahil'],
    images: [
      'https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert', 'bordo', 'yesil'],
    sizes: ['xl', 'xxl', 'xxxl'],
    inStock: true,
    featured: true,
    bestseller: true
  },
  {
    id: 4,
    name: 'Özel Tasarım Üniversite Cübbesi',
    category: 'universite',
    price: 750,
    description: 'Özel tasarım detaylarıyla dikkat çeken üniversite mezuniyet cübbesi.',
    features: ['Özel tasarım', 'Nakışlı detaylar', 'Premium kumaş'],
    images: [
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'mor', 'lacivert'],
    sizes: ['xl', 'xxl', 'xxxl'],
    inStock: true
  },
  
  // Lise Mezuniyet
  {
    id: 5,
    name: 'Lise Mezuniyet Seti Premium',
    category: 'lise',
    price: 450,
    oldPrice: 550,
    description: 'Lise mezuniyeti için özel tasarlanmış premium cübbe ve kep seti.',
    features: ['Cübbe + Kep dahil', 'Yıl yazısı işleme', 'Püskül dahil'],
    images: [
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert', 'bordo', 'mavi'],
    sizes: ['m', 'l', 'xl', 'xxl'],
    inStock: true,
    featured: true
  },
  {
    id: 6,
    name: 'Lise Mezuniyet Cübbesi Klasik',
    category: 'lise',
    price: 350,
    description: 'Klasik tasarımlı lise mezuniyet cübbesi.',
    features: ['Sadece cübbe', 'Fermuarlı', 'Kolay yıkanır'],
    images: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert'],
    sizes: ['m', 'l', 'xl'],
    inStock: true
  },
  
  // Ortaokul Mezuniyet
  {
    id: 7,
    name: 'Ortaokul Mezuniyet Seti',
    category: 'ortaokul',
    price: 350,
    description: 'Ortaokul öğrencileri için özel tasarlanmış mezuniyet seti.',
    features: ['Cübbe + Kep dahil', 'Rahat kalıp', 'Püskül dahil'],
    images: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert', 'kirmizi', 'mavi'],
    sizes: ['s', 'm', 'l'],
    inStock: true,
    featured: true
  },
  {
    id: 8,
    name: 'Ortaokul Cübbesi Ekonomik',
    category: 'ortaokul',
    price: 250,
    description: 'Ekonomik fiyatlı ortaokul mezuniyet cübbesi.',
    features: ['Sadece cübbe', 'Fermuarlı', 'Hafif kumaş'],
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert'],
    sizes: ['s', 'm', 'l'],
    inStock: true
  },
  
  // İlkokul Mezuniyet
  {
    id: 9,
    name: 'İlkokul Mezuniyet Seti',
    category: 'ilkokul',
    price: 300,
    description: 'İlkokul mezunları için özel tasarlanmış cübbe ve kep seti.',
    features: ['Cübbe + Kep dahil', 'Çocuk bedenleri', 'Püskül dahil'],
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert', 'kirmizi', 'sari'],
    sizes: ['xs', 's', 'm'],
    inStock: true,
    featured: true
  },
  {
    id: 10,
    name: 'İlkokul Cübbesi Renkli',
    category: 'ilkokul',
    price: 200,
    description: 'Renkli tasarımlı eğlenceli ilkokul mezuniyet cübbesi.',
    features: ['Sadece cübbe', 'Renkli seçenekler', 'Hafif kumaş'],
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop'
    ],
    colors: ['kirmizi', 'mavi', 'yesil', 'sari'],
    sizes: ['xs', 's', 'm'],
    inStock: true
  },
  
  // Anaokulu Mezuniyet
  {
    id: 11,
    name: 'Anaokulu Mezuniyet Seti',
    category: 'anaokulu',
    price: 250,
    description: 'Minikler için özel tasarlanmış şirin mezuniyet seti.',
    features: ['Cübbe + Kep dahil', 'Mini bedenler', 'Püskül dahil'],
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert', 'kirmizi', 'mavi', 'sari'],
    sizes: ['xxs', 'xs', 's'],
    inStock: true,
    featured: true,
    bestseller: true
  },
  {
    id: 12,
    name: 'Anaokulu Cübbesi Sevimli',
    category: 'anaokulu',
    price: 180,
    description: 'Sevimli tasarımlı anaokulu mezuniyet cübbesi.',
    features: ['Sadece cübbe', 'Yumuşak kumaş', 'Kolay giyim'],
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=600&fit=crop'
    ],
    colors: ['mavi', 'kirmizi', 'sari', 'yesil'],
    sizes: ['xxs', 'xs', 's'],
    inStock: true
  },
  
  // Mezuniyet Kepleri
  {
    id: 13,
    name: 'Premium Mezuniyet Kepi',
    category: 'kepler',
    price: 120,
    oldPrice: 150,
    description: 'Kristal satenden üretilmiş premium mezuniyet kepi. Püskül dahil.',
    features: ['Kristal saten', 'Püskül dahil', 'Ayarlanabilir'],
    images: [
      'https://images.unsplash.com/photo-1564585222527-c2777e60752e?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert', 'bordo', 'mor'],
    sizes: ['s', 'm', 'l', 'xl'],
    inStock: true,
    featured: true
  },
  {
    id: 14,
    name: 'Klasik Mezuniyet Kepi',
    category: 'kepler',
    price: 80,
    description: 'Klasik tasarımlı mezuniyet kepi.',
    features: ['Standart kumaş', 'Püskül dahil'],
    images: [
      'https://images.unsplash.com/photo-1564585222527-c2777e60752e?w=600&h=600&fit=crop'
    ],
    colors: ['siyah', 'lacivert'],
    sizes: ['s', 'm', 'l', 'xl'],
    inStock: true
  },
  {
    id: 15,
    name: 'Renkli Mezuniyet Kepi',
    category: 'kepler',
    price: 90,
    description: 'Renkli seçeneklerle mezuniyet kepi.',
    features: ['Çeşitli renkler', 'Püskül dahil', 'Ayarlanabilir'],
    images: [
      'https://images.unsplash.com/photo-1564585222527-c2777e60752e?w=600&h=600&fit=crop'
    ],
    colors: ['kirmizi', 'mavi', 'yesil', 'sari', 'mor'],
    sizes: ['s', 'm', 'l', 'xl'],
    inStock: true
  }
];

// Helper functions
export const getProductById = (id) => {
  return products.find(p => p.id === parseInt(id));
};

export const getProductsByCategory = (categoryId) => {
  return products.filter(p => p.category === categoryId);
};

export const getFeaturedProducts = () => {
  return products.filter(p => p.featured);
};

export const getBestsellers = () => {
  return products.filter(p => p.bestseller);
};

export const getCategoryById = (id) => {
  return categories.find(c => c.id === id);
};

export const getColorById = (id) => {
  return colors.find(c => c.id === id);
};

export const getSizeById = (id) => {
  return sizes.find(s => s.id === id);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0
  }).format(price);
};
