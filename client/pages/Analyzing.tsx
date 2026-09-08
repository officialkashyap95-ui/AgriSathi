import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  Cpu,
  ImageIcon,
  LoaderCircle,
  Sprout,
  AlertCircle,
} from "lucide-react"

import api from "../src/lib/api"

type AnalysisState =
  | "starting"
  | "success"
  | "error"

export default function Analyzing() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [analysisState, setAnalysisState] =
    useState<AnalysisState>("starting")

  const [errorMessage, setErrorMessage] =
    useState("")

  useEffect(() => {
    if (!id) {
      setAnalysisState("error")
      setErrorMessage("Harvest lot ID is missing.")
      return
    }

    let cancelled = false

    const analyzeLot = async () => {
      try {
        setAnalysisState("starting")
        setErrorMessage("")

        const response = await api.post(
          `/lots/${id}/analyze`
        )

        if (cancelled) return

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Harvest analysis failed."
          )
        }

        setAnalysisState("success")

        // Give the success state a moment so the
        // user can see that analysis completed.
        setTimeout(() => {
          if (!cancelled) {
            navigate(
              `/harvests/${id}/results`,
              { replace: true }
            )
          }
        }, 700)
      } catch (error: any) {
        if (cancelled) return

        console.error(
          "Harvest analysis failed:",
          error
        )

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Unable to analyze this harvest lot."

        setAnalysisState("error")
        setErrorMessage(message)
      }
    }

    analyzeLot()

    return () => {
      cancelled = true
    }
  }, [id, navigate])

  const isProcessing =
    analysisState === "starting"

  const isSuccess =
    analysisState === "success"

  const isError =
    analysisState === "error"

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
                {isError
                  ? "We couldn't complete the analysis."
                  : isSuccess
                    ? "Your harvest analysis is complete."
                    : "Analyzing your representative samples..."}
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

          {/* Status icon */}
          <div
            className={[
              "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl",
              isError
                ? "bg-red-50 text-red-600"
                : isSuccess
                  ? "bg-[#e8f5eb] text-[#23834b]"
                  : "bg-[#edf7ef] text-[#075b2b]",
            ].join(" ")}
          >
            {isError ? (
              <AlertCircle size={30} />
            ) : isSuccess ? (
              <Check size={30} />
            ) : (
              <Cpu size={30} />
            )}
          </div>

          <h2 className="mt-6 text-xl font-bold text-[#17251c] sm:text-2xl">
            {isError
              ? "Analysis couldn't be completed"
              : isSuccess
                ? "Analysis complete"
                : "Analyzing your harvest"}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#68766d] sm:text-base">
            {isError
              ? "Please check the issue below and try the analysis again."
              : isSuccess
                ? "AgriSathi has completed the visual batch assessment."
                : "AgriSathi is processing your representative samples to estimate the visible quality distribution of your tomato lot."}
          </p>

          {/* Processing / success indicator */}
          {!isError && (
            <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-xl border border-[#e3e9e3] bg-[#fafcf9] p-4 text-left">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef8f0] text-[#23834b]">
                {isSuccess ? (
                  <Check size={20} />
                ) : (
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#344139]">
                  {isSuccess
                    ? "Batch assessment completed"
                    : "Quality assessment in progress"}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#718078]">
                  {isSuccess
                    ? "Preparing your harvest results."
                    : "Reviewing sample images and running AI detection."}
                </p>
              </div>

            </div>
          )}

          {/* Steps */}
          <div className="mx-auto mt-7 max-w-md space-y-3 text-left">

            <AnalysisStep
              label="Representative samples received"
              completed
            />

            <AnalysisStep
              label="Visual quality assessment"
              completed={isSuccess}
              active={isProcessing}
            />

            <AnalysisStep
              label="Batch quality distribution"
              completed={isSuccess}
              active={false}
            />

            <AnalysisStep
              label="Smart routing recommendation"
              active={false}
            />

          </div>

          {/* Error */}
          {isError && (
            <div className="mx-auto mt-7 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-left">
              <div className="flex gap-3">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Analysis failed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demo notice */}
          {!isError && (
            <div className="mt-7 rounded-xl bg-[#f4f9f3] px-4 py-3">
              <p className="text-xs leading-5 text-[#68766d]">
                <span className="font-semibold text-[#344139]">
                  Assessment mode:
                </span>{" "}
                The current build uses real tomato detection with an
                illustrative batch quality distribution. The production
                ripeness and defect models will replace the demo distribution
                without changing this workflow.
              </p>
            </div>
          )}

          {/* Back / retry */}
          <Link
            to={`/harvests/${id}/sampling`}
            className="mx-auto mt-7 flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-[#d5ddd6] bg-white px-5 text-sm font-semibold text-[#46544c] transition hover:bg-[#f7f9f6]"
          >
            <ArrowLeft size={17} />
            {isError ? "Back to Samples" : "Back to Samples"}
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