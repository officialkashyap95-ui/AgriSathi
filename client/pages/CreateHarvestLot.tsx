import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  MapPin,
  Package,
  Sprout,
} from "lucide-react"

import api from "../src/lib/api"

type HarvestCondition =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor"

interface FormErrors {
  quantity?: string
  harvestDate?: string
  location?: string
}

export default function CreateHarvestLot() {
  const navigate = useNavigate()

  const [crop, setCrop] = useState("Tomato")
  const [quantity, setQuantity] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [location, setLocation] = useState("")
  const [lotName, setLotName] = useState("")
  const [condition, setCondition] =
    useState<HarvestCondition | undefined>()
  const [notes, setNotes] = useState("")

  const [errors, setErrors] =
    useState<FormErrors>({})

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [submitError, setSubmitError] =
    useState("")

  const today =
    new Date().toISOString().split("T")[0]

  /* =========================================
                FORM VALIDATION
  ========================================= */

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!quantity) {
      newErrors.quantity =
        "Please enter the harvest quantity."
    } else if (Number(quantity) <= 0) {
      newErrors.quantity =
        "Quantity must be greater than 0."
    }

    if (!harvestDate) {
      newErrors.harvestDate =
        "Please select the harvest date."
    }

    if (!location.trim()) {
      newErrors.location =
        "Please enter the harvest location."
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  /* =========================================
              CREATE HARVEST LOT
  ========================================= */

  const handleContinue = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await api.post("/lots", {
        crop,
        quantityKg: Number(quantity),
        harvestDate,
        location: location.trim(),
      })

      const createdLot = response.data.data

      if (!createdLot?._id) {
        throw new Error(
          "Harvest lot was created but no lot ID was returned."
        )
      }

      console.log(
        "Harvest lot created successfully:",
        createdLot
      )

      /* =========================================
          SAVE FRONTEND-ONLY INFORMATION
      ========================================= */

      sessionStorage.setItem(
        "agrisathi-harvest-lot",
        JSON.stringify({
          lotId: createdLot._id,
          crop,
          quantity: Number(quantity),
          unit: "kg",
          harvestDate,
          location: location.trim(),
          lotName: lotName.trim(),
          condition,
          notes: notes.trim(),
        })
      )

      /* =========================================
          IMPORTANT

          Navigate using the REAL MongoDB ID.

          OLD:
          /harvests/new/sampling

          NEW:
          /harvests/:id/sampling
      ========================================= */

      navigate(
        `/harvests/${createdLot._id}/sampling`
      )
    } catch (error: any) {
      console.error(
        "Create harvest lot failed:",
        error
      )

      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Unable to create harvest lot. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f3] text-[#17231c]">

      {/* =========================================
                    HEADER
      ========================================= */}

      <header className="border-b border-[#e2e7e1] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">

          <div className="flex items-center gap-2 text-sm font-semibold text-[#075b2b]">
            <Sprout size={17} />
            <span>AgriSathi</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#17251c] sm:text-3xl">
            Create Harvest Lot
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68766d] sm:text-base">
            Register your fresh harvest to begin
            AI-powered quality assessment and smart
            routing.
          </p>

          {/* Progress */}

          <div className="mt-7 flex max-w-3xl items-center">

            <Step
              number="1"
              label="Harvest Details"
              active
            />

            <ProgressLine />

            <Step
              number="2"
              label="Sample & Analyze"
            />

            <ProgressLine />

            <Step
              number="3"
              label="Recommendation"
            />

          </div>
        </div>
      </header>

      {/* =========================================
                    MAIN
      ========================================= */}

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-9 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* =====================================
                        LEFT
          ===================================== */}

          <div className="space-y-6">

            {/* Harvest Information */}

            <section className="rounded-2xl border border-[#dfe5df] bg-white shadow-sm">

              <div className="border-b border-[#edf0ec] px-5 py-5 sm:px-6">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf7ef] text-[#075b2b]">
                    <Package size={19} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#17251c]">
                      Harvest Information
                    </h2>

                    <p className="mt-1 text-sm text-[#718078]">
                      Tell us about the produce you want
                      to analyze.
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                {/* Crop */}

                <div>
                  <label
                    htmlFor="crop"
                    className="mb-2 block text-sm font-semibold text-[#344139]"
                  >
                    Crop
                  </label>

                  <div className="relative">

                    <Sprout
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#688071]"
                    />

                    <select
                      id="crop"
                      value={crop}
                      onChange={(e) =>
                        setCrop(e.target.value)
                      }
                      className="h-11 w-full appearance-none rounded-xl border border-[#d8e0d9] bg-white pl-10 pr-10 text-sm text-[#26352c] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/10"
                    >
                      <option value="Tomato">
                        Tomato
                      </option>

                      <option value="Potato">
                        Potato
                      </option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718078]"
                    />

                  </div>

                  <p className="mt-2 text-xs text-[#7a877f]">
                    Tomato is currently the primary
                    supported crop.
                  </p>
                </div>

                {/* Quantity */}

                <div>

                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-semibold text-[#344139]"
                  >
                    Harvest Quantity
                  </label>

                  <div className="flex">

                    <input
                      id="quantity"
                      type="number"
                      min="0"
                      step="0.1"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(
                          e.target.value
                        )

                        setErrors((prev) => ({
                          ...prev,
                          quantity:
                            undefined,
                        }))
                      }}
                      placeholder="e.g. 100"
                      className={`h-11 min-w-0 flex-1 rounded-l-xl border bg-white px-3 text-sm text-[#26352c] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/10 ${
                        errors.quantity
                          ? "border-red-400"
                          : "border-[#d8e0d9]"
                      }`}
                    />

                    <div className="flex h-11 w-16 items-center justify-center rounded-r-xl border border-l-0 border-[#d8e0d9] bg-[#f7f9f6] text-sm font-semibold text-[#526158]">
                      kg
                    </div>

                  </div>

                  {errors.quantity && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.quantity}
                    </p>
                  )}

                </div>

                {/* Harvest Date */}

                <div>

                  <label
                    htmlFor="harvestDate"
                    className="mb-2 block text-sm font-semibold text-[#344139]"
                  >
                    Harvest Date
                  </label>

                  <div className="relative">

                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#688071]"
                    />

                    <input
                      id="harvestDate"
                      type="date"
                      max={today}
                      value={harvestDate}
                      onChange={(e) => {
                        setHarvestDate(
                          e.target.value
                        )

                        setErrors((prev) => ({
                          ...prev,
                          harvestDate:
                            undefined,
                        }))
                      }}
                      className={`h-11 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-[#26352c] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/10 ${
                        errors.harvestDate
                          ? "border-red-400"
                          : "border-[#d8e0d9]"
                      }`}
                    />

                  </div>

                  {errors.harvestDate && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.harvestDate}
                    </p>
                  )}

                </div>

                {/* Location */}

                <div>

                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-[#344139]"
                  >
                    Harvest Location
                  </label>

                  <div className="relative">

                    <MapPin
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#688071]"
                    />

                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(
                          e.target.value
                        )

                        setErrors((prev) => ({
                          ...prev,
                          location:
                            undefined,
                        }))
                      }}
                      placeholder="Enter village, district or farm location"
                      className={`h-11 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-[#26352c] outline-none transition placeholder:text-[#9aa59e] focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/10 ${
                        errors.location
                          ? "border-red-400"
                          : "border-[#d8e0d9]"
                      }`}
                    />

                  </div>

                  {errors.location && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.location}
                    </p>
                  )}

                </div>

                {/* Lot Name */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="lotName"
                    className="mb-2 block text-sm font-semibold text-[#344139]"
                  >
                    Lot Name{" "}
                    <span className="font-normal text-[#89948d]">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="lotName"
                    type="text"
                    value={lotName}
                    onChange={(e) =>
                      setLotName(e.target.value)
                    }
                    placeholder="e.g. Tomato Batch A"
                    className="h-11 w-full rounded-xl border border-[#d8e0d9] bg-white px-3 text-sm text-[#26352c] outline-none transition placeholder:text-[#9aa59e] focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/10"
                  />

                </div>

              </div>
            </section>

            {/* Harvest Condition */}

            <section className="rounded-2xl border border-[#dfe5df] bg-white shadow-sm">

              <div className="border-b border-[#edf0ec] px-5 py-5 sm:px-6">

                <h2 className="text-base font-bold text-[#17251c]">
                  Harvest Condition
                </h2>

                <p className="mt-1 text-sm text-[#718078]">
                  Give us your initial assessment of the
                  harvested produce.
                </p>

              </div>

              <div className="p-5 sm:p-6">

                <p className="mb-3 text-sm font-semibold text-[#344139]">
                  Overall Harvest Condition
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  {(
                    [
                      "Excellent",
                      "Good",
                      "Fair",
                      "Poor",
                    ] as HarvestCondition[]
                  ).map((item) => {

                    const selected =
                      condition === item

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setCondition(item)
                        }
                        className={`relative rounded-xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-[#23834b] bg-[#f0f8f1] ring-2 ring-[#23834b]/10"
                            : "border-[#dce3dd] bg-white hover:border-[#aebdb2] hover:bg-[#fafcf9]"
                        }`}
                      >

                        <div className="flex items-center justify-between">

                          <span
                            className={`text-sm font-semibold ${
                              selected
                                ? "text-[#075b2b]"
                                : "text-[#344139]"
                            }`}
                          >
                            {item}
                          </span>

                          {selected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#23834b] text-white">
                              <Check
                                size={12}
                                strokeWidth={3}
                              />
                            </span>
                          )}

                        </div>

                      </button>
                    )
                  })}

                </div>

                <div className="mt-4 flex gap-2 rounded-xl bg-[#f7faf6] p-3.5">

                  <CircleHelp
                    size={17}
                    className="mt-0.5 shrink-0 text-[#5f7667]"
                  />

                  <p className="text-xs leading-5 text-[#68766d]">
                    This is your initial assessment.
                    AgriSathi will perform a separate
                    AI-based quality assessment using
                    representative samples.
                  </p>

                </div>

              </div>
            </section>

            {/* Notes */}

            <section className="rounded-2xl border border-[#dfe5df] bg-white shadow-sm">

              <div className="px-5 py-5 sm:px-6">

                <label
                  htmlFor="notes"
                  className="block text-base font-bold text-[#17251c]"
                >
                  Additional Notes{" "}
                  <span className="text-sm font-normal text-[#89948d]">
                    (Optional)
                  </span>
                </label>

                <p className="mt-1 text-sm text-[#718078]">
                  Add anything that may help with the
                  later assessment.
                </p>

                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="e.g. recently harvested, visible damage noticed, mixed-size tomatoes..."
                  className="mt-4 w-full resize-none rounded-xl border border-[#d8e0d9] bg-white px-3 py-3 text-sm text-[#26352c] outline-none transition placeholder:text-[#9aa59e] focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/10"
                />

              </div>
            </section>

            {/* Mobile Actions */}

            <div className="flex flex-col-reverse gap-3 lg:hidden sm:flex-row sm:justify-end">

              <Link
                to="/dashboard"
                className="flex h-11 items-center justify-center rounded-xl border border-[#d5ddd6] bg-white px-5 text-sm font-semibold text-[#46544c] transition hover:bg-[#f7f9f6]"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={handleContinue}
                disabled={isSubmitting}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075b2b] px-5 text-sm font-semibold text-white transition hover:bg-[#064d25] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isSubmitting ? (
                  "Creating Lot..."
                ) : (
                  <>
                    Continue to Sampling
                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </div>

          </div>

          {/* =====================================
                        RIGHT
          ===================================== */}

          <aside className="space-y-5 self-start">

            {/* Summary */}

            <section className="rounded-2xl border border-[#dfe5df] bg-white shadow-sm">

              <div className="border-b border-[#edf0ec] px-5 py-5">

                <h2 className="text-base font-bold text-[#17251c]">
                  Lot Summary
                </h2>

                <p className="mt-1 text-sm text-[#718078]">
                  Your harvest details at a glance.
                </p>

              </div>

              <div className="divide-y divide-[#edf0ec]">

                <SummaryRow
                  label="Crop"
                  value={crop}
                />

                <SummaryRow
                  label="Quantity"
                  value={
                    quantity
                      ? `${quantity} kg`
                      : "Not entered"
                  }
                />

                <SummaryRow
                  label="Harvest Date"
                  value={
                    harvestDate ||
                    "Not selected"
                  }
                />

                <SummaryRow
                  label="Location"
                  value={
                    location ||
                    "Not entered"
                  }
                />

                {lotName && (
                  <SummaryRow
                    label="Lot Name"
                    value={lotName}
                  />
                )}

              </div>

              <div className="p-5">

                <div className="flex items-center gap-2 rounded-xl bg-[#eef8f0] px-3.5 py-3 text-[#075b2b]">

                  <span className="h-2 w-2 rounded-full bg-[#23834b]" />

                  <span className="text-xs font-semibold">
                    Ready for sampling
                  </span>

                </div>

              </div>

              {/* Desktop Actions */}

              <div className="hidden border-t border-[#edf0ec] p-5 lg:block">

                {submitError && (
                  <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
                    {submitError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#075b2b] px-4 text-sm font-semibold text-white transition hover:bg-[#064d25] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isSubmitting ? (
                    "Creating Lot..."
                  ) : (
                    <>
                      Continue to Sampling
                      <ArrowRight size={17} />
                    </>
                  )}

                </button>

                <Link
                  to="/dashboard"
                  className="mt-2 flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold text-[#68766d] transition hover:bg-[#f5f7f4] hover:text-[#344139]"
                >
                  Cancel
                </Link>

              </div>

            </section>

            {/* What's Next */}

            <section className="rounded-2xl border border-[#dfe5df] bg-[#f4f9f3] p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#075b2b] shadow-sm">
                  <ArrowRight size={17} />
                </div>

                <div>

                  <h3 className="text-sm font-bold text-[#17251c]">
                    What&apos;s next?
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-[#68766d]">
                    After creating this harvest lot,
                    AgriSathi will guide you through
                    representative image sampling and
                    AI quality analysis.
                  </p>

                </div>

              </div>

            </section>

            {/* Representative Sampling */}

            <section className="rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf7ef] text-[#075b2b]">
                  <Package size={17} />
                </div>

                <div>

                  <h3 className="text-sm font-bold text-[#17251c]">
                    Representative Sampling
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#68766d]">
                    For a large batch, you don&apos;t need
                    to photograph every tomato. AgriSathi
                    uses representative samples from the
                    lot to estimate the overall quality
                    distribution.
                  </p>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </main>

    </div>
  )
}

/* =============================================
              STEP COMPONENT
============================================= */

function Step({
  number,
  label,
  active = false,
}: {
  number: string
  label: string
  active?: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          active
            ? "bg-[#075b2b] text-white"
            : "border border-[#d8e0d9] bg-white text-[#8a968f]"
        }`}
      >
        {number}
      </div>

      <span
        className={`hidden whitespace-nowrap text-xs font-semibold sm:block ${
          active
            ? "text-[#075b2b]"
            : "text-[#8a968f]"
        }`}
      >
        {label}
      </span>

    </div>
  )
}

/* =============================================
              PROGRESS LINE
============================================= */

function ProgressLine() {
  return (
    <div className="mx-2 h-px flex-1 bg-[#dfe5df] sm:mx-4" />
  )
}

/* =============================================
              SUMMARY ROW
============================================= */

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="px-5 py-4">

      <p className="text-xs font-medium text-[#849088]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#344139]">
        {value}
      </p>

    </div>
  )
}