type HarvestStatusType =
  | "created"
  | "sampling"
  | "analyzing"
  | "analyzed"
  | "recommended";

interface HarvestStatusProps {
  status: HarvestStatusType;
}

const statusConfig: Record<
  HarvestStatusType,
  {
    label: string;
    className: string;
  }
> = {
  created: {
    label: "Created",
    className: "status-created",
  },
  sampling: {
    label: "Sampling",
    className: "status-sampling",
  },
  analyzing: {
    label: "Analyzing",
    className: "status-analyzing",
  },
  analyzed: {
    label: "Analyzed",
    className: "status-analyzed",
  },
  recommended: {
    label: "Recommendation Ready",
    className: "status-recommended",
  },
};

export default function HarvestStatus({
  status,
}: HarvestStatusProps) {
  const config = statusConfig[status];

  return (
    <span className={`harvest-status ${config.className}`}>
      <span className="status-dot" />
      {config.label}
    </span>
  );
}