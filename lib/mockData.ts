export type VehicleType = 'car' | 'van' | 'truck' | 'jeepney' | 'tricycle';

export interface Vehicle {
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  image: string;
  icon: string;
}

export interface VehicleProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  reviews: number;
  vehicles: Vehicle[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  avatar: string;
}

export const VEHICLE_TYPES: Record<VehicleType, { label: string; icon: string }> = {
  car: { label: 'Cars', icon: 'car' },
  van: { label: 'Vans', icon: 'van' },
  truck: { label: 'Trucks', icon: 'truck' },
  jeepney: { label: 'Jeepneys', icon: 'jeepney' },
  tricycle: { label: 'Tricycles', icon: 'tricycle' },
};

export const VEHICLES: Vehicle[] = [
  {
    id: 'car-001',
    type: 'car',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    pricePerDay: 1500,
    image: 'car',
    icon: 'car',
  },
  {
    id: 'car-002',
    type: 'car',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    pricePerDay: 1600,
    image: 'car',
    icon: 'car',
  },
  {
    id: 'car-003',
    type: 'car',
    brand: 'Hyundai',
    model: 'Accent',
    year: 2022,
    pricePerDay: 1200,
    image: 'car',
    icon: 'car',
  },
  {
    id: 'van-001',
    type: 'van',
    brand: 'Ford',
    model: 'Transit',
    year: 2023,
    pricePerDay: 2500,
    image: 'van',
    icon: 'van',
  },
  {
    id: 'van-002',
    type: 'van',
    brand: 'Hyundai',
    model: 'H350',
    year: 2022,
    pricePerDay: 2300,
    image: 'van',
    icon: 'van',
  },
  {
    id: 'truck-001',
    type: 'truck',
    brand: 'Isuzu',
    model: 'NPR',
    year: 2023,
    pricePerDay: 3500,
    image: 'truck',
    icon: 'truck',
  },
  {
    id: 'truck-002',
    type: 'truck',
    brand: 'Hino',
    model: '500',
    year: 2022,
    pricePerDay: 3200,
    image: 'truck',
    icon: 'truck',
  },
  {
    id: 'jeepney-001',
    type: 'jeepney',
    brand: 'Sarao',
    model: 'Classic',
    year: 2022,
    pricePerDay: 800,
    image: 'jeepney',
    icon: 'jeepney',
  },
  {
    id: 'jeepney-002',
    type: 'jeepney',
    brand: 'Sarao',
    model: 'Modern',
    year: 2023,
    pricePerDay: 1000,
    image: 'jeepney',
    icon: 'jeepney',
  },
  {
    id: 'tricycle-001',
    type: 'tricycle',
    brand: 'TVS',
    model: 'Auto',
    year: 2023,
    pricePerDay: 300,
    image: 'tricycle',
    icon: 'tricycle',
  },
  {
    id: 'tricycle-002',
    type: 'tricycle',
    brand: 'Bajaj',
    model: 'RE',
    year: 2022,
    pricePerDay: 280,
    image: 'tricycle',
    icon: 'tricycle',
  },
];

// Mock vehicle providers scattered around Manila area
export const VEHICLE_PROVIDERS: VehicleProvider[] = [
  {
    id: 'provider-1',
    name: 'Maria\'s Vehicle Rentals',
    email: 'maria@rentara.com',
    phone: '+63 917 123 4567',
    rating: 4.8,
    reviews: 247,
    avatar: 'MR',
    location: {
      lat: 14.5994,
      lng: 120.9842,
      address: 'Makati, Manila',
    },
    vehicles: [VEHICLES[0], VEHICLES[1], VEHICLES[4]],
  },
  {
    id: 'provider-2',
    name: 'Juan\'s Transport Services',
    email: 'juan@rentara.com',
    phone: '+63 918 234 5678',
    rating: 4.6,
    reviews: 189,
    avatar: 'JT',
    location: {
      lat: 14.6349,
      lng: 121.0286,
      address: 'Quezon City, Manila',
    },
    vehicles: [VEHICLES[5], VEHICLES[6], VEHICLES[7]],
  },
  {
    id: 'provider-3',
    name: 'Rosa\'s Affordable Rentals',
    email: 'rosa@rentara.com',
    phone: '+63 919 345 6789',
    rating: 4.7,
    reviews: 312,
    avatar: 'RA',
    location: {
      lat: 14.5579,
      lng: 120.9885,
      address: 'Pasay, Manila',
    },
    vehicles: [VEHICLES[2], VEHICLES[3], VEHICLES[8], VEHICLES[9]],
  },
  {
    id: 'provider-4',
    name: 'Lito\'s Jeepney Rentals',
    email: 'lito@rentara.com',
    phone: '+63 920 456 7890',
    rating: 4.9,
    reviews: 421,
    avatar: 'LJ',
    location: {
      lat: 14.6091,
      lng: 121.0245,
      address: 'San Juan, Manila',
    },
    vehicles: [VEHICLES[7], VEHICLES[8]],
  },
  {
    id: 'provider-5',
    name: 'Ana\'s Tricycle Services',
    email: 'ana@rentara.com',
    phone: '+63 921 567 8901',
    rating: 4.5,
    reviews: 156,
    avatar: 'AT',
    location: {
      lat: 14.5953,
      lng: 120.9659,
      address: 'BGC, Manila',
    },
    vehicles: [VEHICLES[9], VEHICLES[10]],
  },
  {
    id: 'provider-6',
    name: 'Premium Car Rentals',
    email: 'premium@rentara.com',
    phone: '+63 922 678 9012',
    rating: 4.7,
    reviews: 289,
    avatar: 'PC',
    location: {
      lat: 14.5730,
      lng: 121.0322,
      address: 'Mandaluyong, Manila',
    },
    vehicles: [VEHICLES[0], VEHICLES[1], VEHICLES[2], VEHICLES[4]],
  },
];

export const getProvidersByVehicleType = (type: VehicleType): VehicleProvider[] => {
  return VEHICLE_PROVIDERS.filter((provider) =>
    provider.vehicles.some((vehicle) => vehicle.type === type)
  );
};

export const getVehiclesByType = (type: VehicleType): Vehicle[] => {
  return VEHICLES.filter((vehicle) => vehicle.type === type);
};
