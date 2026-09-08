import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Leaf,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Warehouse,
  LoaderCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../src/lib/api";
import "./styles/AnalysisResults.css";

interface AnalysisResponse {
  lot: {
    id: string;
    crop: string;
    quantityKg: number;
    harvestDate: string;
    location: string;
    status: string;
  };

  analysis: {
    qualityDistribution: {
      gradeA: number;
      gradeB: number;
      recovery: number;
    };

    estimatedQuantityKg: {
      gradeA: number;
      gradeB: number;
      recovery: number;
    };

    samplesAnalyzed: number;
    totalDetections: number;
    averageConfidence: number;
    assessmentMode: "demo" | "ai";
  };
}

export default function AnalysisResults() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] =
    useState<AnalysisResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!id) {
      setError("Harvest lot ID is missing.");
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/lots/${id}/analysis`
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to load analysis."
          );
        }

        setData(response.data.data);
      } catch (err: any) {
        console.error(
          "Failed to load harvest analysis:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load harvest analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const qualityData = useMemo(() => {
    if (!data) return [];

    const {
      qualityDistribution,
      estimatedQuantityKg,
    } = data.analysis;

    return [
      {
        label: "Grade A",
        value: qualityDistribution.gradeA,
        quantity: `${estimatedQuantityKg.gradeA} kg`,
        description:
          "Suitable for fresh-market sale",
        className: "grade-a",
      },
      {
        label: "Grade B",
        value: qualityDistribution.gradeB,
        quantity: `${estimatedQuantityKg.gradeB} kg`,
        description:
          "Better suited for processing",
        className: "grade-b",
      },
      {
        label: "Recovery",
        value: qualityDistribution.recovery,
        quantity: `${estimatedQuantityKg.recovery} kg`,
        description:
          "Consider recovery / value addition",
        className: "recovery",
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <main className="analysis-page">
        <div className="analysis-container">
          <div
            style={{
              minHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <LoaderCircle
              size={30}
              className="animate-spin"
            />

            <strong>
              Loading harvest analysis...
            </strong>

            <span>
              Preparing your quality assessment.
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="analysis-page">
        <div className="analysis-container">
          <div
            style={{
              minHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "14px",
              textAlign: "center",
            }}
          >
            <CircleAlert
              size={32}
            />

            <h2>
              Unable to load analysis
            </h2>

            <p>
              {error ||
                "No analysis data was found."}
            </p>

            <button
              onClick={() =>
                navigate(
                  `/harvests/${id}/sampling`
                )
              }
              className="analysis-back-button"
            >
              Back to Samples
            </button>
          </div>
        </div>
      </main>
    );
  }

  const {
    lot,
    analysis,
  } = data;

  const confidencePercent =
    Math.round(
      analysis.averageConfidence * 100
    );

  const confidenceLabel =
    confidencePercent >= 80
      ? "High"
      : confidencePercent >= 60
        ? "Moderate"
        : "Low";

  const totalEstimatedKg =
    analysis.estimatedQuantityKg.gradeA +
    analysis.estimatedQuantityKg.gradeB +
    analysis.estimatedQuantityKg.recovery;

  const formattedHarvestDate =
    new Date(
      lot.harvestDate
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  const shortLocation =
    lot.location.split(",")[0];

  const routes = [
    {
      icon: Package,
      title: "Fresh Market",
      quantity: `${analysis.estimatedQuantityKg.gradeA} kg`,
      value: "Illustrative",
      risk: "Medium",
      status: "Good fit",
      description:
        "Higher visual quality portion suitable for fresh-market channels.",
      recommended: false,
    },
    {
      icon: TrendingUp,
      title: "Processing",
      quantity: `${analysis.estimatedQuantityKg.gradeB} kg`,
      value: "Illustrative",
      risk: "Low",
      status: "Recommended",
      description:
        "Good fit for the estimated lower-grade portion with lower spoilage exposure.",
      recommended: true,
    },
    {
      icon: Warehouse,
      title: "Storage",
      quantity: `${lot.quantityKg} kg`,
      value: "Illustrative",
      risk: "High",
      status: "Consider",
      description:
        "Requires suitable storage conditions and market timing.",
      recommended: false,
    },
    {
      icon: CircleAlert,
      title: "Recovery",
      quantity: `${analysis.estimatedQuantityKg.recovery} kg`,
      value: "Illustrative",
      risk: "Low",
      status: "Backup",
      description:
        "Potential route for produce unsuitable for the primary channels.",
      recommended: false,
    },
  ];

  return (
    <main className="analysis-page">
      <div className="analysis-container">

        {/* Header */}
        <section className="analysis-header">
          <div>
            <div className="analysis-eyebrow">
              <Sparkles size={15} />
              AI-ASSISTED POST-HARVEST ANALYSIS
            </div>

            <h1>
              Your harvest has been analyzed.
            </h1>

            <p>
              Here's an estimated quality distribution
              and suggested routing for your{" "}
              {lot.crop.toLowerCase()} lot.
            </p>
          </div>

          <div className="demo-badge">
            <ShieldCheck size={15} />

            {analysis.assessmentMode === "demo"
              ? "Demo analysis"
              : "AI analysis"}
          </div>
        </section>

        {/* Lot summary */}
        <section className="lot-summary-card">
          <div className="lot-summary-main">
            <div className="tomato-icon">
              <Leaf size={22} />
            </div>

            <div>
              <span>HARVEST LOT</span>

              <h2>
                {lot.crop} Lot
              </h2>

              <div className="lot-meta">

                <span>
                  <Package size={14} />
                  {lot.quantityKg} kg
                </span>

                <span>
                  <MapPin size={14} />
                  {shortLocation}
                </span>

                <span>
                  Harvested{" "}
                  {formattedHarvestDate}
                </span>

              </div>
            </div>
          </div>

          <div className="confidence-box">
            <span>
              Assessment confidence
            </span>

            <strong>
              <CheckCircle2 size={17} />
              {confidenceLabel}
            </strong>

            <small>
              {confidencePercent}% detection
              confidence ·{" "}
              {analysis.samplesAnalyzed} samples
            </small>
          </div>
        </section>

        {/* Quality overview */}
        <section className="section-block">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                01 / QUALITY
              </span>

              <h2>
                See the quality inside your batch.
              </h2>

              <p>
                AgriSathi estimates the visible
                quality distribution from
                representative sample images.
              </p>
            </div>
          </div>

          <div className="quality-grid">

            {qualityData.map((item) => (
              <article
                key={item.label}
                className={`quality-card ${item.className}`}
              >

                <div className="quality-card-top">
                  <span>
                    {item.label}
                  </span>

                  <strong>
                    {item.value}%
                  </strong>
                </div>

                <div className="quality-bar">
                  <div
                    style={{
                      width: `${item.value}%`,
                    }}
                  />
                </div>

                <h3>
                  {item.quantity}
                </h3>

                <p>
                  {item.description}
                </p>

              </article>
            ))}

          </div>

          <div className="quality-total">

            <div>
              <span>
                Total analyzed batch
              </span>

              <strong>
                {lot.quantityKg} kg
              </strong>
            </div>

            <div className="quality-total-message">
              <CheckCircle2 size={17} />

              <span>
                {totalEstimatedKg.toFixed(2)} kg
                accounted for in the estimated
                distribution
              </span>
            </div>

          </div>
        </section>

        {/* Visual analysis */}
        <section className="visual-analysis-card">

          <div className="visual-analysis-left">

            <span className="section-kicker">
              VISUAL ASSESSMENT
            </span>

            <h2>
              What the system looked at
            </h2>

            <p>
              The current AI service detected
              visible tomatoes in representative
              samples. Ripeness and defect
              classification will be added as
              dedicated quality models.
            </p>

            <div className="metric-list">

              <div>
                <span>
                  Samples analyzed
                </span>

                <strong>
                  {analysis.samplesAnalyzed}
                </strong>
              </div>

              <div>
                <span>
                  Tomatoes detected
                </span>

                <strong>
                  {analysis.totalDetections}
                </strong>
              </div>

              <div>
                <span>
                  Detection confidence
                </span>

                <strong>
                  {confidencePercent}%
                </strong>
              </div>

              <div>
                <span>
                  Assessment mode
                </span>

                <strong>
                  {analysis.assessmentMode}
                </strong>
              </div>

              <div>
                <span>
                  Batch quality
                </span>

                <strong>
                  Estimated
                </strong>
              </div>

            </div>
          </div>

          <div className="visual-analysis-right">

            <div className="analysis-ring">
              <div>
                <strong>
                  {analysis.qualityDistribution.gradeA}%
                </strong>

                <span>
                  Grade A
                </span>
              </div>
            </div>

            <div className="analysis-note">
              <CircleAlert size={16} />

              <span>
                Visual assessment only.
                Internal defects may not be
                visible from external images.
              </span>
            </div>

          </div>
        </section>

        {/* Routing */}
        <section className="section-block">

          <div className="section-heading routing-heading">

            <div>
              <span className="section-kicker">
                02 / SMART ROUTING
              </span>

              <h2>
                One harvest. Multiple possibilities.
              </h2>

              <p>
                Different portions of the same
                batch can be directed toward
                different destinations.
              </p>
            </div>

          </div>

          <div className="routing-flow">

            <div className="routing-source">
              <Package size={22} />

              <strong>
                {lot.quantityKg} kg
              </strong>

              <span>
                {lot.crop} harvest
              </span>
            </div>

            <ArrowRight
              className="routing-arrow"
              size={22}
            />

            <div className="routing-destinations">

              <div>
                <span>
                  {analysis.estimatedQuantityKg.gradeA} kg
                </span>

                <strong>
                  Fresh Market
                </strong>
              </div>

              <div>
                <span>
                  {analysis.estimatedQuantityKg.gradeB} kg
                </span>

                <strong>
                  Processing
                </strong>
              </div>

              <div>
                <span>
                  {analysis.estimatedQuantityKg.recovery} kg
                </span>

                <strong>
                  Recovery
                </strong>
              </div>

            </div>

          </div>
        </section>

        {/* Decision intelligence */}
        <section className="section-block">

          <div className="section-heading">

            <div>
              <span className="section-kicker">
                03 / DECISION INTELLIGENCE
              </span>

              <h2>
                Don't stop at quality. Decide what
                to do next.
              </h2>

              <p>
                Destination economics are
                currently illustrative and will
                later be calculated from live
                market and processor data.
              </p>
            </div>

          </div>

          <div className="route-list">

            {routes.map((route) => {

              const Icon = route.icon;

              return (
                <article
                  key={route.title}
                  className={`route-card ${
                    route.recommended
                      ? "recommended"
                      : ""
                  }`}
                >

                  <div className="route-icon">
                    <Icon size={20} />
                  </div>

                  <div className="route-information">

                    <div className="route-title-row">

                      <h3>
                        {route.title}
                      </h3>

                      {route.recommended && (
                        <span className="recommended-pill">
                          Illustrative
                        </span>
                      )}

                    </div>

                    <p>
                      {route.description}
                    </p>

                  </div>

                  <div className="route-data">

                    <div>
                      <span>
                        Volume
                      </span>

                      <strong>
                        {route.quantity}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Example value
                      </span>

                      <strong>
                        {route.value}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Risk
                      </span>

                      <strong>
                        {route.risk}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Status
                      </span>

                      <strong>
                        {route.status}
                      </strong>
                    </div>

                  </div>

                  <ChevronRight
                    size={19}
                    className="route-chevron"
                  />

                </article>
              );
            })}

          </div>

          <div className="economics-disclaimer">

            <CircleAlert size={16} />

            <span>
              Example economics are for
              demonstration only. Actual
              recommendations should use current
              market conditions, processor
              opportunities, transport costs and
              other relevant economics.
            </span>

          </div>

        </section>

        {/* Recommendation */}
        <section className="recommendation-card">

          <div className="recommendation-icon">
            <Sparkles size={23} />
          </div>

          <div className="recommendation-content">

            <span>
              AGRISATHI ASSESSMENT
            </span>

            <h2>
              Split the batch across
              best-fit channels.
            </h2>

            <p>
              Based on the current illustrative
              quality distribution, the estimated
              portions can be considered for
              fresh-market, processing and
              recovery channels. This is not a
              guaranteed economic recommendation.
            </p>

            <div className="recommendation-points">

              <div>
                <CheckCircle2 size={16} />

                <span>
                  {analysis.estimatedQuantityKg.gradeA} kg
                  → Fresh Market
                </span>
              </div>

              <div>
                <CheckCircle2 size={16} />

                <span>
                  {analysis.estimatedQuantityKg.gradeB} kg
                  → Processing
                </span>
              </div>

              <div>
                <CheckCircle2 size={16} />

                <span>
                  {analysis.estimatedQuantityKg.recovery} kg
                  → Recovery
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* Bottom */}
        <section className="analysis-footer">

          <div>
            <strong>
              Ready for your next harvest?
            </strong>

            <span>
              Create another lot and run a
              new assessment.
            </span>
          </div>

          <button
            onClick={() => {
              navigate("/harvests/new");
            }}
          >
            Create New Harvest

            <ArrowRight size={17} />
          </button>

        </section>

      </div>
    </main>
  );
}