import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  Cpu,
  ImageIcon,
  LoaderCircle,
  Sprout,
} from "lucide-react"

export default function Analyzing() {
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (!id) return

    // Demo analysis simulation.
    // Replace this with the real AI API call later.
    const timer = setTimeout(() => {
      navigate(`/harvests/${id}/results`)
    }, 2500)

    return () => clearTimeout(timer)
  }, [id, navigate])

  return (
    <div className="min-h-screen bg-[#f8f8f3] text-[#17231c]">
      <header className="border-b border-[#e2e7e1] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">

          <div className="flex items-center gap-2 text-sm font-semibold text-[#075b2b]">
            <Sprout size={17} />
            <span>AgriSathi</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#17251c] sm:text-3xl">
                AI Quality Analysis
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#68766d] sm:text-base">
                Analyzing your representative samples...
              </p>
            </div>

            <span className="rounded-full bg-[#eef8f0] px-3 py-1.5 text-xs font-semibold text-[#075b2b]">
              Step 3 of 3
            </span>
          </div>

        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-145px)] max-w-4xl items-center justify-center px-5 py-12 sm:px-6">

        <section className="w-full rounded-2xl border border-[#dfe5df] bg-white p-7 text-center shadow-sm sm:p-10">

          {/* AI icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf7ef] text-[#075b2b]">
            <Cpu size={30} />
          </div>

          <h2 className="mt-6 text-xl font-bold text-[#17251c] sm:text-2xl">
            Analyzing your harvest
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#68766d] sm:text-base">
            AgriSathi is processing your representative samples to estimate
            the visible quality distribution of your tomato lot.
          </p>

          {/* Processing indicator */}
          <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-xl border border-[#e3e9e3] bg-[#fafcf9] p-4 text-left">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef8f0] text-[#23834b]">
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#344139]">
                Quality assessment in progress
              </p>

              <p className="mt-1 text-xs leading-5 text-[#718078]">
                Reviewing sample images and preparing the batch assessment.
              </p>
            </div>

          </div>

          {/* Steps */}
          <div className="mx-auto mt-7 max-w-md space-y-3 text-left">

            <AnalysisStep
              label="Representative samples received"
              completed
            />

            <AnalysisStep
              label="Visual quality assessment"
              active
            />

            <AnalysisStep
              label="Batch quality distribution"
            />

            <AnalysisStep
              label="Smart routing recommendation"
            />

          </div>

          {/* Demo notice */}
          <div className="mt-7 rounded-xl bg-[#f4f9f3] px-4 py-3">
            <p className="text-xs leading-5 text-[#68766d]">
              <span className="font-semibold text-[#344139]">
                Demo analysis:
              </span>{" "}
              This hackathon build uses an illustrative tomato assessment.
              The production AI model will be connected to this workflow later.
            </p>
          </div>

          {/* Back */}
          <Link
            to={`/harvests/${id}/sampling`}
            className="mx-auto mt-7 flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-[#d5ddd6] bg-white px-5 text-sm font-semibold text-[#46544c] transition hover:bg-[#f7f9f6]"
          >
            <ArrowLeft size={17} />
            Back to Samples
          </Link>

        </section>

      </main>
    </div>
  )
}

interface AnalysisStepProps {
  label: string
  completed?: boolean
  active?: boolean
}

function AnalysisStep({
  label,
  completed = false,
  active = false,
}: AnalysisStepProps) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          completed
            ? "bg-[#e8f5eb] text-[#23834b]"
            : active
              ? "bg-[#075b2b] text-white"
              : "bg-[#f0f3ef] text-[#91a097]",
        ].join(" ")}
      >
        {completed ? (
          <Check size={16} />
        ) : active ? (
          <LoaderCircle
            size={15}
            className="animate-spin"
          />
        ) : (
          <ImageIcon size={15} />
        )}
      </div>

      <span
        className={[
          "text-sm",
          completed || active
            ? "font-medium text-[#344139]"
            : "text-[#8a968e]",
        ].join(" ")}
      >
        {label}
      </span>

    </div>
  )
}