import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Wheat,
} from "lucide-react";

import HarvestStatus from "./HarvestStatus";

export interface HarvestLot {
  id: string;
  crop: string;
  quantityKg: number;
  harvestDate: string;
  location: string;
  status:
    | "created"
    | "sampling"
    | "analyzing"
    | "analyzed"
    | "recommended";
  updatedAt: string;
}

interface HarvestCardProps {
  harvest: HarvestLot;
  onView: (id: string) => void;
}

export default function HarvestCard({
  harvest,
  onView,
}: HarvestCardProps) {
  return (
    <article className="harvest-card">
      <div className="harvest-card-top">
        <div className="harvest-crop-info">
          <div className="harvest-crop-icon">
            <Wheat size={19} />
          </div>

          <div>
            <h3>{harvest.crop}</h3>
            <p>{harvest.quantityKg} kg</p>
          </div>
        </div>

        <HarvestStatus status={harvest.status} />
      </div>

      <div className="harvest-card-details">
        <div>
          <span>Harvest date</span>

          <p>
            <CalendarDays size={14} />
            {formatDate(harvest.harvestDate)}
          </p>
        </div>

        <div>
          <span>Location</span>

          <p>
            <MapPin size={14} />
            {harvest.location}
          </p>
        </div>
      </div>

      <div className="harvest-card-footer">
        <span>Updated {harvest.updatedAt}</span>

        <button onClick={() => onView(harvest.id)}>
          View Details
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}