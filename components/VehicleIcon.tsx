import { Car, Van, Truck, Bus, Bike } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export type VehicleIconKey = 'car' | 'van' | 'truck' | 'jeepney' | 'tricycle';

const iconMap: Record<VehicleIconKey, React.ComponentType<LucideProps>> = {
  car: Car,
  van: Van,
  truck: Truck,
  jeepney: Bus,
  tricycle: Bike,
};

interface VehicleIconProps extends LucideProps {
  name: string;
}

export default function VehicleIcon({ name, ...props }: VehicleIconProps) {
  const Icon = iconMap[name as VehicleIconKey] ?? Car;
  return <Icon {...props} />;
}
