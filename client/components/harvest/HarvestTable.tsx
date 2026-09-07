import { ArrowRight } from "lucide-react";

import HarvestStatus from "./HarvestStatus";
import type { HarvestLot } from "./HarvestCard";

interface HarvestTableProps {
  harvests: HarvestLot[];
  onView: (id: string) => void;
}

export default function HarvestTable({
  harvests,
  onView,
}: HarvestTableProps) {
  return (
    <div className="harvest-table-wrapper">
      <table className="harvest-table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Quantity</th>
            <th>Harvest Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Updated</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {harvests.map((harvest) => (
            <tr key={harvest.id}>
              <td>
                <span className="table-crop">
                  {harvest.crop}
                </span>
              </td>

              <td>{harvest.quantityKg} kg</td>

              <td>{formatDate(harvest.harvestDate)}</td>

              <td>{harvest.location}</td>

              <td>
                <HarvestStatus status={harvest.status} />
              </td>

              <td>{harvest.updatedAt}</td>

              <td>
                <button
                  className="table-view-button"
                  onClick={() => onView(harvest.id)}
                >
                  View
                  <ArrowRight size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}