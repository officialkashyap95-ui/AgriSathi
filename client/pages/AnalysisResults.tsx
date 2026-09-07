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
} from "lucide-react";

import "./styles/AnalysisResults.css";

const qualityData = [
  {
    label: "Grade A",
    value: 68,
    quantity: "68 kg",
    description: "Suitable for fresh-market sale",
    className: "grade-a",
  },
  {
    label: "Grade B",
    value: 23,
    quantity: "23 kg",
    description: "Better suited for processing",
    className: "grade-b",
  },
  {
    label: "Recovery",
    value: 9,
    quantity: "9 kg",
    description: "Consider recovery / value addition",
    className: "recovery",
  },
];

const routes = [
  {
    icon: Package,
    title: "Fresh Market",
    quantity: "68 kg",
    value: "₹3,900",
    risk: "Medium",
    status: "Good fit",
    description:
      "Higher visual quality portion suitable for fresh-market channels.",
    recommended: false,
  },
  {
    icon: TrendingUp,
    title: "Processing",
    quantity: "23 kg",
    value: "₹3,450",
    risk: "Low",
    status: "Recommended",
    description:
      "Good fit for the estimated lower-grade portion with lower spoilage exposure.",
    recommended: true,
  },
  {
    icon: Warehouse,
    title: "Storage",
    quantity: "100 kg",
    value: "₹3,180",
    risk: "High",
    status: "Consider",
    description:
      "Requires suitable storage conditions and market timing.",
    recommended: false,
  },
  {
    icon: CircleAlert,
    title: "Recovery",
    quantity: "9 kg",
    value: "₹1,900",
    risk: "Low",
    status: "Backup",
    description:
      "Potential route for produce unsuitable for the primary channels.",
    recommended: false,
  },
];

export default function AnalysisResults() {
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
              Here's an estimated quality distribution and suggested routing
              for your tomato lot.
            </p>
          </div>

          <div className="demo-badge">
            <ShieldCheck size={15} />
            Demo analysis
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
              <h2>Tomato Lot #AS-2026-001</h2>

              <div className="lot-meta">
                <span>
                  <Package size={14} />
                  100 kg
                </span>

                <span>
                  <MapPin size={14} />
                  Greater Noida
                </span>

                <span>
                  Harvested 07 Sep 2026
                </span>
              </div>
            </div>
          </div>

          <div className="confidence-box">
            <span>Assessment confidence</span>

            <strong>
              <CheckCircle2 size={17} />
              High
            </strong>

            <small>Based on representative samples</small>
          </div>
        </section>

        {/* Quality overview */}
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="section-kicker">01 / QUALITY</span>

              <h2>See the quality inside your batch.</h2>

              <p>
                AgriSathi estimates the visible quality distribution from
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
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>

                <div className="quality-bar">
                  <div
                    style={{
                      width: `${item.value}%`,
                    }}
                  />
                </div>

                <h3>{item.quantity}</h3>

                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="quality-total">
            <div>
              <span>Total analyzed batch</span>
              <strong>100 kg</strong>
            </div>

            <div className="quality-total-message">
              <CheckCircle2 size={17} />
              <span>
                100% of the estimated batch distribution accounted for
              </span>
            </div>
          </div>
        </section>

        {/* Visual analysis */}
        <section className="visual-analysis-card">
          <div className="visual-analysis-left">
            <span className="section-kicker">VISUAL ASSESSMENT</span>

            <h2>
              What the system looked at
            </h2>

            <p>
              The assessment focuses on visible characteristics in the
              representative samples.
            </p>

            <div className="metric-list">
              <div>
                <span>Ripeness</span>
                <strong>Good</strong>
              </div>

              <div>
                <span>Surface condition</span>
                <strong>Good</strong>
              </div>

              <div>
                <span>Color uniformity</span>
                <strong>Good</strong>
              </div>

              <div>
                <span>Visible defects</span>
                <strong>Low–Moderate</strong>
              </div>

              <div>
                <span>Shape / appearance</span>
                <strong>Acceptable</strong>
              </div>
            </div>
          </div>

          <div className="visual-analysis-right">
            <div className="analysis-ring">
              <div>
                <strong>68%</strong>
                <span>Grade A</span>
              </div>
            </div>

            <div className="analysis-note">
              <CircleAlert size={16} />

              <span>
                Visual assessment only. Internal defects may not be visible
                from external images.
              </span>
            </div>
          </div>
        </section>

        {/* Routing */}
        <section className="section-block">
          <div className="section-heading routing-heading">
            <div>
              <span className="section-kicker">02 / SMART ROUTING</span>

              <h2>One harvest. Multiple possibilities.</h2>

              <p>
                Different portions of the same batch can be directed toward
                different destinations.
              </p>
            </div>
          </div>

          <div className="routing-flow">
            <div className="routing-source">
              <Package size={22} />
              <strong>100 kg</strong>
              <span>Tomato harvest</span>
            </div>

            <ArrowRight className="routing-arrow" size={22} />

            <div className="routing-destinations">
              <div>
                <span>68 kg</span>
                <strong>Fresh Market</strong>
              </div>

              <div>
                <span>23 kg</span>
                <strong>Processing</strong>
              </div>

              <div>
                <span>9 kg</span>
                <strong>Recovery</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Decision intelligence */}
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="section-kicker">03 / DECISION INTELLIGENCE</span>

              <h2>Don't stop at quality. Decide what to do next.</h2>

              <p>
                Example routing comparison using illustrative economics.
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
                    route.recommended ? "recommended" : ""
                  }`}
                >
                  <div className="route-icon">
                    <Icon size={20} />
                  </div>

                  <div className="route-information">
                    <div className="route-title-row">
                      <h3>{route.title}</h3>

                      {route.recommended && (
                        <span className="recommended-pill">
                          Recommended
                        </span>
                      )}
                    </div>

                    <p>{route.description}</p>
                  </div>

                  <div className="route-data">
                    <div>
                      <span>Volume</span>
                      <strong>{route.quantity}</strong>
                    </div>

                    <div>
                      <span>Example value</span>
                      <strong>{route.value}</strong>
                    </div>

                    <div>
                      <span>Risk</span>
                      <strong>{route.risk}</strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong>{route.status}</strong>
                    </div>
                  </div>

                  <ChevronRight size={19} className="route-chevron" />
                </article>
              );
            })}
          </div>

          <div className="economics-disclaimer">
            <CircleAlert size={16} />

            <span>
              Example values shown for demonstration only. Actual
              recommendations should use current market conditions,
              processor opportunities, transport costs and other economics.
            </span>
          </div>
        </section>

        {/* Recommendation */}
        <section className="recommendation-card">
          <div className="recommendation-icon">
            <Sparkles size={23} />
          </div>

          <div className="recommendation-content">
            <span>AGRI SATHI RECOMMENDATION</span>

            <h2>
              Split the batch across the best-fit channels.
            </h2>

            <p>
              Based on this illustrative quality distribution, the majority
              of the lot can target the fresh market while the lower-grade
              portion can be considered for processing or recovery.
            </p>

            <div className="recommendation-points">
              <div>
                <CheckCircle2 size={16} />
                <span>68 kg → Fresh Market</span>
              </div>

              <div>
                <CheckCircle2 size={16} />
                <span>23 kg → Processing</span>
              </div>

              <div>
                <CheckCircle2 size={16} />
                <span>9 kg → Recovery</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom */}
        <section className="analysis-footer">
          <div>
            <strong>Ready for your next harvest?</strong>
            <span>
              Create another lot and run a new assessment.
            </span>
          </div>

          <button
            onClick={() => {
              window.location.href = "/harvests/new";
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