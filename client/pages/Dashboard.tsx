import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Clock3,
    ScanLine,
    Scale,
    Wheat,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"

interface Harvest {
    id: string
    crop: string
    quantity: string
    date: string
    status: string
    statusType: "success" | "warning"
}

const recentHarvests: Harvest[] = [
    {
        id: "TOM-2408",
        crop: "Tomato",
        quantity: "100 kg",
        date: "06 Sep 2026",
        status: "Analysis ready",
        statusType: "success",
    },
    {
        id: "TOM-2407",
        crop: "Tomato",
        quantity: "150 kg",
        date: "04 Sep 2026",
        status: "Processing suggested",
        statusType: "warning",
    },
    {
        id: "TOM-2406",
        crop: "Tomato",
        quantity: "170 kg",
        date: "02 Sep 2026",
        status: "Completed",
        statusType: "success",
    },
]

export default function Dashboard() {
    const { user } = useUser()

    const firstName =
        user?.firstName ||
        user?.username ||
        "Farmer"

    return (
        <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8 lg:py-10">

            {/* ───────────────── Welcome Section ───────────────── */}

            <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-[#075b2b]">
                        Sunday, 06 September 2026
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-[-0.035em] text-[#17251c] sm:text-5xl">
                        Good morning, {firstName}
                    </h1>

                    <p className="mt-3 text-base text-[#65736a] sm:text-lg">
                        Turn your harvest data into better post-harvest decisions.
                    </p>
                </div>

                <Link
                    to="/harvests/new"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075b2b] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064b24]"style={{color:"white"}}
                >
                    <span className="text-lg leading-none">
                        +
                    </span>

                    Create Harvest Lot
                </Link>
            </section>


            {/* ───────────────── Statistics ───────────────── */}

            <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    icon={Wheat}
                    label="Harvest lots"
                    value="12"
                    detail="+3 this month"
                />

                <StatCard
                    icon={Scale}
                    label="Total quantity"
                    value="1,240 kg"
                    detail="+180 kg this month"
                />

                <StatCard
                    icon={ScanLine}
                    label="AI analyses"
                    value="9"
                    detail="Completed"
                    tone="warm"
                />

                <StatCard
                    icon={Clock3}
                    label="Pending decisions"
                    value="3"
                    detail="Need attention"
                    tone="alert"
                />

            </section>


            {/* ───────────────── Main Content ───────────────── */}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">

                {/* Recent Harvests */}

                <div className="overflow-hidden rounded-2xl border border-[#dfe5df] bg-white">

                    <div className="flex items-center justify-between border-b border-[#e6ebe5] px-5 py-5 sm:px-7">

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#075b2b]">
                                Harvest activity
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-[#17251c]">
                                Recent harvests
                            </h2>
                        </div>

                        <Link
                            to="/harvests"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#075b2b] hover:text-[#064b24]"
                        >
                            View all
                            <ArrowRight size={16} />
                        </Link>

                    </div>


                    <div>
                        {recentHarvests.map((harvest) => (
                            <HarvestRow
                                key={harvest.id}
                                {...harvest}
                            />
                        ))}
                    </div>

                </div>


                {/* Latest Recommendation */}

                <div className="rounded-2xl border border-[#dfe5df] bg-white p-5 sm:p-7">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#075b2b]">
                                Latest recommendation
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-[#17251c]">
                                Tomato · 100 kg
                            </h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5ed] text-[#075b2b]">
                            <BarChart3 size={19} />
                        </div>

                    </div>


                    {/* Recommendation */}

                    <div className="mt-7 rounded-xl bg-[#f1f6f0] p-5">

                        <p className="text-xs font-semibold uppercase tracking-wider text-[#708077]">
                            Recommended route
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[#075b2b]">
                            Processing
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#647269]">
                            Based on the current quality assessment, processing
                            appears to be a suitable destination for this batch.
                        </p>

                    </div>


                    {/* Confidence */}

                    <div className="mt-5 flex items-center justify-between border-b border-[#edf0ed] pb-5">

                        <div>
                            <p className="text-xs text-[#7b887f]">
                                Quality confidence
                            </p>

                            <p className="mt-1 text-xl font-bold text-[#26372d]">
                                87%
                            </p>
                        </div>

                        <div className="h-2 w-24 overflow-hidden rounded-full bg-[#e5ebe4]">
                            <div className="h-full w-[87%] rounded-full bg-[#39805a]" />
                        </div>

                    </div>


                    {/* Report */}

                    <Link
                        to="/harvests/TOM-2408"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#075b2b]"
                    >
                        View quality report
                        <ArrowRight size={16} />
                    </Link>

                </div>

            </section>


            {/* ───────────────── Quick Actions ───────────────── */}

            <section className="mt-6">

                <div className="mb-4">

                    <h2 className="text-xl font-bold text-[#17251c]">
                        Quick actions
                    </h2>

                    <p className="mt-1 text-sm text-[#718078]">
                        Common actions for managing your harvest.
                    </p>

                </div>


                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    <QuickAction
                        to="/harvests/new"
                        icon={Wheat}
                        title="Create Harvest Lot"
                        description="Start a new batch"
                        primary
                    />

                    <QuickAction
                        to="/harvests"
                        icon={ScanLine}
                        title="Analyze Existing Lot"
                        description="Continue an analysis"
                    />

                    <QuickAction
                        to="/market"
                        icon={BarChart3}
                        title="View Market"
                        description="Check market opportunities"
                    />

                    <QuickAction
                        to="/processors"
                        icon={CheckCircle2}
                        title="Find Processors"
                        description="Explore processing options"
                    />

                </div>

            </section>

        </div>
    )
}


/* ═══════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════ */

function StatCard({
    icon: Icon,
    label,
    value,
    detail,
    tone = "green",
}: {
    icon: LucideIcon
    label: string
    value: string
    detail: string
    tone?: "green" | "warm" | "alert"
}) {

    const iconBackground = {
        green: "bg-[#eaf2ec] text-[#075b2b]",
        warm: "bg-[#faf2e4] text-[#8a651d]",
        alert: "bg-[#fff0e9] text-[#d96d2d]",
    }

    return (
        <div className="rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_1px_2px_rgba(20,40,25,0.04)]">

            <div className="flex items-start justify-between">

                <p className="text-sm font-semibold text-[#627067]">
                    {label}
                </p>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBackground[tone]}`}
                >
                    <Icon size={18} />
                </div>

            </div>


            <p className="mt-7 text-3xl font-bold tracking-tight text-[#17251c]">
                {value}
            </p>

            <p className="mt-1 text-sm text-[#6c7971]">
                {detail}
            </p>

        </div>
    )
}


/* ═══════════════════════════════════════════════════════════════
   HARVEST ROW
═══════════════════════════════════════════════════════════════ */

function HarvestRow({
    id,
    crop,
    quantity,
    date,
    status,
    statusType,
}: Harvest) {

    return (
        <Link
            to={`/harvests/${id}`}
            className="grid gap-3 border-b border-[#edf0ed] px-5 py-5 transition last:border-b-0 hover:bg-[#fafbf9] sm:grid-cols-[1.5fr_0.7fr_0.9fr_1.1fr_auto] sm:items-center sm:px-7"
        >

            {/* Crop */}

            <div>

                <p className="font-semibold text-[#1d3024]">
                    {crop}
                </p>

                <p className="mt-1 text-xs text-[#78857d]">
                    Lot #{id}
                </p>

            </div>


            {/* Quantity */}

            <p className="text-sm font-semibold text-[#34453b]">
                {quantity}
            </p>


            {/* Date */}

            <p className="text-sm text-[#68766e]">
                {date}
            </p>


            {/* Status */}

            <span
                className={`
                    flex w-fit items-center gap-2 rounded-full px-3 py-1.5
                    text-xs font-semibold
                    ${
                        statusType === "success"
                            ? "bg-[#eaf2ec] text-[#176137]"
                            : "bg-[#faf0df] text-[#80561d]"
                    }
                `}
            >

                <span className="h-1.5 w-1.5 rounded-full bg-current" />

                {status}

            </span>


            {/* Arrow */}

            <ArrowRight
                size={17}
                className="hidden text-[#397653] sm:block"
            />

        </Link>
    )
}


/* ═══════════════════════════════════════════════════════════════
   QUICK ACTION
═══════════════════════════════════════════════════════════════ */

function QuickAction({
    to,
    icon: Icon,
    title,
    description,
    primary = false,
}: {
    to: string
    icon: LucideIcon
    title: string
    description: string
    primary?: boolean
}) {

    return (
        <Link
            to={to}
            className={`
                group flex items-center gap-4 rounded-2xl border p-4
                transition hover:-translate-y-0.5
                ${
                    primary
                        ? "border-[#075b2b] bg-[#075b2b] text-white"
                        : "border-[#dfe5df] bg-white hover:border-[#bfcdbf]"
                }
            `}
        >

            {/* Icon */}

            <div
                className={`
                    flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                    ${
                        primary
                            ? "bg-white/10 text-white"
                            : "bg-[#edf4ed] text-[#397653]"
                    }
                `}
            >
                <Icon size={19} />
            </div>


            {/* Text */}

            <div className="min-w-0 flex-1">

                <p
                    className={`text-sm font-semibold ${
                        primary
                            ? "text-white"
                            : "text-[#26372d]"
                    }`}
                >
                    {title}
                </p>

                <p
                    className={`mt-1 truncate text-xs ${
                        primary
                            ? "text-white/70"
                            : "text-[#78857d]"
                    }`}
                >
                    {description}
                </p>

            </div>


            {/* Arrow */}

            <ArrowRight
                size={16}
                className={
                    primary
                        ? "text-white/70"
                        : "text-[#829087]"
                }
            />

        </Link>
    )
}