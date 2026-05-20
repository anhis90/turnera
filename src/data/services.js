import { 
  Scissors, Sparkles, Heart, Star, 
  Trash2, ShieldCheck, Camera, 
  Palette, Droplets, Zap, Eye, UserCheck
} from 'lucide-react';

export const CATEGORIES = {
  UNAS: "Uñas",
  PELUQUERIA: "Peluquería",
  PESTANAS_ESTETICA: "Pestañas y Estética"
};

export const SERVICES = [
  // 💅 Uñas
  { 
    id: "gel", 
    category: CATEGORIES.UNAS, 
    name: "Uñas Gel", 
    price: 2500,
    duration: "90 min",
    icon: "Palette",
    image: "/images/placas/unas.png",
    description: "Uñas esculpidas con gel de alta calidad para un acabado natural y duradero.",
    benefits: "Fortalece las uñas, acabado brillante y duración de hasta 3 semanas."
  },
  { 
    id: "acrilicas", 
    category: CATEGORIES.UNAS, 
    name: "Uñas Acrílicas", 
    price: 3000,
    duration: "120 min",
    icon: "Sparkles",
    image: "/images/placas/unas.png",
    description: "Extensión de uñas mediante polímero y monómero para máxima resistencia.",
    benefits: "Extrema durabilidad y posibilidad de diseños complejos."
  },
  { 
    id: "soft-gel", 
    category: CATEGORIES.UNAS, 
    name: "Uñas Soft Gel", 
    price: 2800,
    duration: "60 min",
    icon: "Zap",
    image: "/images/placas/unas.png",
    description: "Técnica ultra rápida y ligera con tips de gel flexible.",
    benefits: "Acabado súper natural y proceso sin daños."
  },
  { 
    id: "poly-gel", 
    category: CATEGORIES.UNAS, 
    name: "Uñas Poly Gel", 
    price: 3200,
    duration: "100 min",
    icon: "Heart",
    image: "/images/placas/unas.png",
    description: "Híbrido entre gel y acrílico, más fuerte que el gel y más flexible que el acrílico.",
    benefits: "Sin olor fuerte y muy resistente."
  },
  { 
    id: "semipermanentes", 
    category: CATEGORIES.UNAS, 
    name: "Semipermanentes", 
    price: 1500,
    duration: "45 min",
    icon: "Palette",
    image: "/images/placas/unas.png",
    description: "Color de larga duración que no se salta ni pierde brillo.",
    benefits: "Secado instantáneo y brillo impecable por 15 días."
  },

  // 💇‍♀️ Peluquería
  { 
    id: "botox-capilar", 
    category: CATEGORIES.PELUQUERIA, 
    name: "Botox Capilar", 
    price: 4000,
    duration: "60 min",
    icon: "Droplets",
    image: "/images/placas/peluqueria.png",
    description: "Tratamiento intensivo que rellena la fibra capilar dañada.",
    benefits: "Elimina el frizz, aporta brillo extremo y suavidad."
  },
  { 
    id: "alisados", 
    category: CATEGORIES.PELUQUERIA, 
    name: "Alisados", 
    price: 5500,
    duration: "180 min",
    icon: "Zap",
    image: "/images/placas/peluqueria.png",
    description: "Reducción de volumen y alisado progresivo de la fibra capilar.",
    benefits: "Cabello lacio, disciplinado y fácil de peinar."
  },
  { 
    id: "hidratacion", 
    category: CATEGORIES.PELUQUERIA, 
    name: "Hidratación", 
    price: 2000,
    duration: "40 min",
    icon: "Droplets",
    image: "/images/placas/peluqueria.png",
    description: "Recuperación de la humedad natural del cabello.",
    benefits: "Suavidad inmediata y mejor manejo."
  },
  { 
    id: "nutricion", 
    category: CATEGORIES.PELUQUERIA, 
    name: "Nutrición", 
    price: 2500,
    duration: "50 min",
    icon: "Star",
    image: "/images/placas/peluqueria.png",
    description: "Aporte de lípidos y aceites esenciales para cabellos secos.",
    benefits: "Brillo radiante y sellado de cutículas."
  },
  { 
    id: "teñidos", 
    category: CATEGORIES.PELUQUERIA, 
    name: "Teñidos", 
    price: 6000,
    duration: "150 min",
    icon: "Palette",
    image: "/images/placas/peluqueria.png",
    description: "Coloración profesional con productos de alta gama.",
    benefits: "Color vibrante y cobertura total de canas."
  },

  // 👁️ Pestañas y Estética
  { 
    id: "lashes", 
    category: CATEGORIES.PESTANAS_ESTETICA, 
    name: "Lashes", 
    price: 3500,
    duration: "90 min",
    icon: "Eye",
    image: "/images/placas/pestanas.png",
    description: "Extensiones de pestañas para una mirada profunda.",
    benefits: "Efecto rímel permanente y mirada impactante."
  },
  { 
    id: "perfilado", 
    category: CATEGORIES.PESTANAS_ESTETICA, 
    name: "Perfilado", 
    price: 1200,
    duration: "30 min",
    icon: "UserCheck",
    image: "/images/placas/pestanas.png",
    description: "Diseño y depilación de cejas según tu rostro.",
    benefits: "Realza tus facciones naturales."
  },
  { 
    id: "depilacion", 
    category: CATEGORIES.PESTANAS_ESTETICA, 
    name: "Depilación", 
    price: 2200,
    duration: "45 min",
    icon: "Sparkles",
    image: "/images/placas/pestanas.png",
    description: "Depilación facial y corporal con ceras premium.",
    benefits: "Piel suave y libre de vello por más tiempo."
  },
  { 
    id: "micropigmentacion", 
    category: CATEGORIES.PESTANAS_ESTETICA, 
    name: "Micropigmentación", 
    price: 15000,
    duration: "150 min",
    icon: "Zap",
    image: "/images/placas/pestanas.png",
    description: "Maquillaje semipermanente de cejas o labios.",
    benefits: "Cejas perfectas 24/7."
  }
];
