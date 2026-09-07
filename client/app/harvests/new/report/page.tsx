'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Info,
  Leaf,
  Menu,
  ShieldCheck,
  Sprout,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface HarvestLot {
  crop?: string
  quantity?: number
  unit?: string
  harvestDate?: string
  location?: string
  lotName?: string
}

interface SampleMetadata {
  id: string
  name: string
  size: number
  type: string
}

export default function QualityReportPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lot, setLot] = useState<HarvestLot>({})
  const [sampleCount, setSampleCount] = useState(0)

  useEffect(() => {
    try {
      const storedLot = sessionStorage.getItem(
        'agrisathi-harvest-lot',
      )

      if (storedLot) {
        setLot(JSON.parse(storedLot))
      }

      const storedSamples = sessionStorage.getItem(
        'agrisathi-sample-images',
      )

      if (storedSamples) {
        const samples: SampleMetadata[] =
          JSON.parse(storedSamples)

        setSampleCount(samples.length)
      }
    } catch {
      // Safe fallback for unavailable session storage.
    }
  }, [])

  const formattedDate = useMemo(() => {
    if (!lot.harvestDate) return '—'

    return new Date(
      `${lot.harvestDate}T00:00:00`,
    ).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }, [lot.harvestDate])

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      <div className="md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-9 place-items-center rounded-lg border border-border md:hidden"
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>

            <p className="text-xs text-muted-foreground">
              Workspace / Harvests /{' '}
              <span className="font-semibold text-foreground">
                Quality Report
              </span>
            </p>
          </div>

          <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
            PS
          </span>
        </header>

        <main className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {/* Back */}
          <Link
            href="/harvests/new/sampling"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Sample & Analyze
          </Link>

          {/* Page Heading */}
          <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">
                Step 3 · Quality Assessment
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Quality Report
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                Review the visible quality characteristics
                identified from your representative sample.
                Actual model results will appear here once
                the AI pipeline is connected.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check size={14} />
              </span>

              <span className="hidden sm:inline text-muted-foreground">
                Harvest
              </span>

              <span className="h-px w-5 bg-border" />

              <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check size={14} />
              </span>

              <span className="hidden sm:inline text-muted-foreground">
                Analyze
              </span>

              <span className="h-px w-5 bg-border" />

              <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                3
              </span>

              <span className="hidden sm:inline text-primary">
                Report
              </span>
            </div>
          </div>

          {/* Report content */}
          <div className="mt-8 space-y-6">
            {/* Lot Overview */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Sprout size={21} />
                  </span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Harvest Lot
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      {lot.lotName ||
                        `${lot.crop || 'Tomato'} Harvest`}
                    </h2>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">
                  <span className="size-2 rounded-full bg-primary" />
                  Sample analyzed
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryItem
                  label="Crop"
                  value={lot.crop || '—'}
                />

                <SummaryItem
                  label="Quantity"
                  value={
                    lot.quantity
                      ? `${lot.quantity} ${lot.unit || 'kg'}`
                      : '—'
                  }
                />

                <SummaryItem
                  label="Harvest date"
                  value={formattedDate}
                />

                <SummaryItem
                  label="Sample images"
                  value={
                    sampleCount
                      ? `${sampleCount} images`
                      : '—'
                  }
                />
              </div>
            </section>

            {/* Assessment placeholder */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Batch Assessment
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Quality overview
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  These indicators will be populated by the
                  computer vision pipeline. We intentionally
                  do not display estimated values until the
                  model has analyzed the sample.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AssessmentCard
                  title="Ripeness"
                  value="—"
                  description="Model result pending"
                />

                <AssessmentCard
                  title="Surface condition"
                  value="—"
                  description="Model result pending"
                />

                <AssessmentCard
                  title="Color uniformity"
                  value="—"
                  description="Model result pending"
                />

                <AssessmentCard
                  title="Visible defects"
                  value="—"
                  description="Model result pending"
                />
              </div>
            </section>

            {/* Quality Distribution */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Batch Distribution
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Estimated quality distribution
                  </h2>
                </div>

                <span className="text-xs text-muted-foreground">
                  Based on representative sampling
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <DistributionRow
                  label="Fresh market"
                  description="Suitable for direct sale"
                />

                <DistributionRow
                  label="Processing"
                  description="Potentially suitable for processing"
                />

                <DistributionRow
                  label="Recovery"
                  description="Potential value recovery"
                />
              </div>

              <div className="mt-6 flex gap-3 rounded-xl border border-dashed border-border bg-background p-4">
                <Info
                  size={18}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />

                <p className="text-xs leading-5 text-muted-foreground">
                  Distribution values will be calculated
                  after the computer vision model and batch
                  aggregation logic are connected.
                </p>
              </div>
            </section>

            {/* Visible characteristics */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Visual Inspection
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Characteristics assessed
                </h2>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Characteristic
                  title="Ripeness"
                  description="Visible maturity and color stage"
                />

                <Characteristic
                  title="Color"
                  description="Color consistency across sampled tomatoes"
                />

                <Characteristic
                  title="Shape"
                  description="Visible shape and deformity indicators"
                />

                <Characteristic
                  title="Surface defects"
                  description="Visible cracks, spots and damage"
                />
              </div>
            </section>

            {/* Trust section */}
            <section className="rounded-2xl border border-primary/15 bg-primary/[0.045] p-5 sm:p-7">
              <div className="flex gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <div>
                  <h2 className="font-bold">
                    Assessment transparency
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    AgriSathi uses representative samples to
                    estimate the condition of the larger
                    harvest lot. The assessment focuses on
                    visible characteristics captured in the
                    images. Internal defects, hidden damage
                    and conditions outside the camera view
                    may require physical inspection.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom action */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/harvests/new/sampling"
                className="button-secondary inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Review Samples
              </Link>

              <Link
                href="/harvests/new/recommendation"
                className="button-primary inline-flex items-center justify-center gap-2"
              >
                Continue to Recommendation
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SummaryItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold">
        {value}
      </p>
    </div>
  )
}

function AssessmentCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="text-sm font-bold">{title}</p>

      <p className="mt-4 text-3xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function DistributionRow({
  label,
  description,
}: {
  label: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold">{label}</p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold">—</p>

          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            kg
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-0 rounded-full bg-primary" />
      </div>
    </div>
  )
}

function Characteristic({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-background p-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Check size={15} />
      </span>

      <div>
        <p className="text-sm font-bold">{title}</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                     */
/* -------------------------------------------------------------------------- */

function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card px-4 py-5 md:flex">
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Leaf size={19} />
        </span>

        <span className="text-lg font-bold tracking-tight">
          Agri
          <span className="text-primary">Sathi</span>
        </span>
      </Link>

      <nav
        className="mt-9 flex flex-1 flex-col gap-1"
        aria-label="Main navigation"
      >
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </p>

        <SidebarLink
          label="Dashboard"
          href="/dashboard"
        />

        <SidebarLink
          label="My Harvests"
          href="#"
        />

        <SidebarLink
          label="Create Harvest Lot"
          href="/harvests/new"
          active
        />

        <SidebarLink
          label="Market"
          href="#"
        />

        <SidebarLink
          label="Processors"
          href="#"
        />

        <SidebarLink
          label="FPO"
          href="#"
        />

        <SidebarLink
          label="Storage"
          href="#"
        />

        <SidebarLink
          label="Settings"
          href="#"
        />
      </nav>

      <div className="border-t border-border pt-4">
        <Link
          href="#support"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-muted-foreground"
        >
          <CircleHelp size={17} />
          Help & Support
        </Link>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-background p-3">
          <span className="grid size-8 place-items-center rounded-full bg-secondary text-sm font-bold text-primary">
            PS
          </span>

          <div>
            <p className="text-xs font-bold">
              Piyush Sharma
            </p>

            <p className="text-[10px] text-muted-foreground">
              Farmer account
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function SidebarLink({
  label,
  href,
  active = false,
}: {
  label: string
  href: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Sprout size={17} />
      {label}
    </Link>
  )
}