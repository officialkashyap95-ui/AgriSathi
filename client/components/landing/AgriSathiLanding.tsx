import { useState } from "react"
import {
    SignInButton,
    SignUpButton,
    UserButton,
    useAuth,
} from "@clerk/clerk-react"
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    ChevronDown,
    Factory,
    Leaf,
    Menu,
    ScanLine,
    ShoppingBasket,
    Sparkles,
    Store,
    Warehouse,
    Whistle,
    X,
} from "lucide-react"


const navItems = [
    { label: "Product", href: "#product" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Solutions", href: "#solutions" },
    { label: "About", href: "#about" },
]


const features = [
    {
        icon: ScanLine,
        title: "AI Quality Assessment",
        description:
            "Understand the visual quality distribution of your crop batch from representative samples.",
    },
    {
        icon: ArrowRight,
        title: "Smart Routing",
        description:
            "Identify where different quality segments can potentially create the most value.",
    },
    {
        icon: BarChart3,
        title: "Decision Intelligence",
        description:
            "Compare fresh-market, processing, storage, and recovery options in one place.",
    },
    {
        icon: ShoppingBasket,
        title: "Batch-Level Analysis",
        description:
            "Analyze representative samples instead of photographing every individual tomato.",
    },
]


const destinations = [
    {
        icon: Store,
        title: "Fresh Market",
        description:
            "Route visually suitable produce toward fresh-market opportunities.",
    },
    {
        icon: Factory,
        title: "Processing",
        description:
            "Identify suitable produce for food processing and value addition.",
    },
    {
        icon: Warehouse,
        title: "Storage",
        description:
            "Consider storage when market conditions and product suitability make it worthwhile.",
    },
    {
        icon: ArrowRight,
        title: "Recovery",
        description:
            "Direct lower-quality produce toward recovery and value-added applications.",
    },
]


export default function AgriSathiLanding() {

    const [mobileOpen, setMobileOpen] = useState(false)
    const [scanning, setScanning] = useState(false)

    const { isSignedIn } = useAuth()


    const startScan = () => {

        if (scanning) return

        setScanning(true)

        setTimeout(() => {
            setScanning(false)
        }, 3500)
    }


    const closeMobileMenu = () => {
        setMobileOpen(false)
    }


    return (
        <main className="min-h-screen overflow-hidden bg-[#f8f8f3] text-[#17231c]">

            {/* ===================================================== */}
            {/* NAVBAR */}
            {/* ===================================================== */}

            <header className="sticky top-0 z-50 border-b border-[#dfe5df]/80 bg-[#f8f8f3]/90 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

                    {/* LOGO */}

                    <a
                        href="/"
                        className="flex items-center gap-2.5"
                    >

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174a32] text-white shadow-sm">

                            <Leaf
                                size={21}
                                strokeWidth={2.2}
                            />

                        </span>

                        <span className="text-xl font-bold tracking-tight text-[#173a29]">
                            AgriSathi
                        </span>

                    </a>


                    {/* DESKTOP NAVIGATION */}

                    <nav className="hidden items-center gap-8 lg:flex">

                        {navItems.map((item) => (

                            <a
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium text-[#526158] transition-colors hover:text-[#174a32]"
                            >
                                {item.label}
                            </a>

                        ))}

                    </nav>


                    {/* ================================================= */}
                    {/* DESKTOP AUTH */}
                    {/* ================================================= */}

                    <div className="hidden items-center gap-3 lg:flex">

                        {isSignedIn ? (

                            <>
                                <a
                                    href="/dashboard"
                                    className="rounded-xl bg-[#174a32] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103b27]" 
                                    style={{color: "white"}}
                                >
                                    Dashboard
                                </a>

                                <UserButton
                                    afterSignOutUrl="/"
                                />
                            </>

                        ) : (

                            <>

                                <SignInButton
                                    mode="modal"
                                    forceRedirectUrl="/dashboard"
                                >
                                    <button
                                        type="button"
                                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#304137] transition hover:bg-[#eef3ed] hover:text-[#174a32]"
                                    >
                                        Log in
                                    </button>
                                </SignInButton>


                                <SignUpButton
                                    mode="modal"
                                    forceRedirectUrl="/dashboard"
                                >
                                    <button
                                        type="button"
                                        className="rounded-xl bg-[#174a32] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103b27]"
                                    >
                                        Get Started
                                    </button>
                                </SignUpButton>

                            </>

                        )}

                    </div>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        type="button"
                        onClick={() => setMobileOpen((previous) => !previous)}
                        className="rounded-lg p-2 text-[#173a29] lg:hidden"
                        aria-label="Toggle navigation"
                        aria-expanded={mobileOpen}
                    >

                        {mobileOpen
                            ? <X size={24} />
                            : <Menu size={24} />
                        }

                    </button>

                </div>


                {/* ================================================= */}
                {/* MOBILE MENU */}
                {/* ================================================= */}

                {mobileOpen && (

                    <div className="border-t border-[#dfe5df] bg-[#f8f8f3] px-5 py-5 lg:hidden">

                        <nav className="flex flex-col gap-4">

                            {navItems.map((item) => (

                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className="py-1 text-sm font-semibold text-[#304137]"
                                >
                                    {item.label}
                                </a>

                            ))}


                            <div className="mt-2 border-t border-[#dfe5df] pt-4">

                                {isSignedIn ? (

                                    <div className="flex items-center gap-3">

                                        <a
                                            href="/dashboard"
                                            onClick={closeMobileMenu}
                                            className="flex flex-1 items-center justify-center rounded-xl bg-[#174a32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#103b27]"
                                        >
                                            Dashboard
                                        </a>

                                        <UserButton
                                            afterSignOutUrl="/"
                                        />

                                    </div>

                                ) : (

                                    <div className="flex gap-3">

                                        <SignInButton
                                            mode="modal"
                                            forceRedirectUrl="/dashboard"
                                        >
                                            <button
                                                type="button"
                                                className="flex-1 rounded-xl border border-[#d3dbd4] px-4 py-3 text-sm font-semibold text-[#304137] transition hover:bg-[#eef3ed]"
                                            >
                                                Log in
                                            </button>
                                        </SignInButton>


                                        <SignUpButton
                                            mode="modal"
                                            forceRedirectUrl="/dashboard"
                                        >
                                            <button
                                                type="button"
                                                className="flex-1 rounded-xl bg-[#174a32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#103b27]"
                                            >
                                                Get Started
                                            </button>
                                        </SignUpButton>

                                    </div>

                                )}

                            </div>

                        </nav>

                    </div>

                )}

            </header>


            {/* ===================================================== */}
            {/* HERO */}
            {/* ===================================================== */}

            <section className="relative">

                <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">

                    <div>

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cbd8cf] bg-white px-3.5 py-2 text-xs font-bold tracking-[0.12em] text-[#326247]">

                            <Sparkles size={14} />

                            AI-POWERED POST-HARVEST INTELLIGENCE

                        </div>


                        <h1 className="max-w-3xl text-5xl font-bold leading-[1.03] tracking-[-0.045em] text-[#173a29] sm:text-6xl lg:text-[70px]">

                            Don&apos;t just sell your harvest.

                            <span className="mt-2 block text-[#6d7f4d]">
                                Know where it creates the most value.
                            </span>

                        </h1>


                        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5d6b62]">

                            AgriSathi uses AI-powered visual quality assessment and decision
                            intelligence to help determine the best destination for your
                            harvested produce.

                        </p>


                        {/* ================================================= */}
                        {/* HERO CTA */}
                        {/* ================================================= */}

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                            {isSignedIn ? (

                                <a
                                    href="/dashboard"
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#174a32] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#174a32]/10 transition hover:-translate-y-0.5 hover:bg-[#103b27]"
                                    style={{ color: "white" }}
                                >
                                    Analyze Your Harvest

                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </a>

                            ) : (

                                <SignUpButton
                                    mode="modal"
                                    forceRedirectUrl="/dashboard"
                                >
                                    <button
                                        type="button"
                                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#174a32] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#174a32]/10 transition hover:-translate-y-0.5 hover:bg-[#103b27]"
                                    >
                                        Analyze Your Harvest

                                        <ArrowRight
                                            size={17}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </button>
                                </SignUpButton>

                            )}


                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center rounded-xl border border-[#ccd6ce] bg-white px-6 py-3.5 text-sm font-bold text-[#304137] transition hover:border-[#9eb1a3] hover:bg-[#f3f5f0]"
                            >
                                See How It Works
                            </a>

                        </div>


                        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#66746b]">

                            <span className="flex items-center gap-2">

                                <CheckCircle2
                                    size={16}
                                    className="text-[#39805a]"
                                />

                                Representative sampling

                            </span>


                            <span className="flex items-center gap-2">

                                <CheckCircle2
                                    size={16}
                                    className="text-[#39805a]"
                                />

                                Explainable recommendations

                            </span>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* DASHBOARD PREVIEW */}
                    {/* ================================================= */}

                    <div className="relative">

                        <div className="absolute -inset-8 rounded-[40px] bg-[#dfe9dc]/50 blur-3xl" />


                        <div className="relative overflow-hidden rounded-[28px] border border-[#d5ddd5] bg-white p-4 shadow-2xl shadow-[#254b35]/10 sm:p-5">

                            <div className="flex items-center justify-between border-b border-[#edf0ed] pb-4">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#829087]">
                                        Harvest Lot
                                    </p>

                                    <h3 className="mt-1 text-lg font-bold text-[#1c3024]">
                                        100 KG TOMATO LOT
                                    </h3>

                                </div>


                                <span className="rounded-full bg-[#edf7ef] px-3 py-1.5 text-xs font-bold text-[#39724e]">
                                    ANALYSIS READY
                                </span>

                            </div>


                            <div className="mt-5 rounded-2xl bg-[#f5f7f3] p-4">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-[#7a887f]">
                                            AI Quality Analysis
                                        </p>

                                        <p className="mt-1 text-sm text-[#59675e]">
                                            Visual batch assessment
                                        </p>

                                    </div>


                                    <ScanLine
                                        size={20}
                                        className="text-[#39805a]"
                                    />

                                </div>


                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#e3e8e2]">

                                    <div className="flex h-full">

                                        <div className="w-[68%] bg-[#4f8b61]" />
                                        <div className="w-[23%] bg-[#d2a33d]" />
                                        <div className="w-[9%] bg-[#bf7358]" />

                                    </div>

                                </div>


                                <div className="mt-4 grid grid-cols-3 gap-3">

                                    <div>

                                        <p className="text-xl font-bold text-[#2d6d46]">
                                            68%
                                        </p>

                                        <p className="text-xs text-[#718077]">
                                            Grade A
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xl font-bold text-[#9a7728]">
                                            23%
                                        </p>

                                        <p className="text-xs text-[#718077]">
                                            Grade B
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xl font-bold text-[#a55d48]">
                                            9%
                                        </p>

                                        <p className="text-xs text-[#718077]">
                                            Recovery
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="mt-4">

                                <div className="mb-3 flex items-center justify-between">

                                    <p className="text-sm font-bold text-[#26372d]">
                                        Smart Routing
                                    </p>

                                    <p className="text-xs text-[#7c8981]">
                                        100 kg total
                                    </p>

                                </div>


                                <div className="grid gap-3 sm:grid-cols-3">

                                    <RouteCard
                                        icon={Store}
                                        title="Fresh Market"
                                        quantity="68 kg"
                                        active
                                    />

                                    <RouteCard
                                        icon={Factory}
                                        title="Processing"
                                        quantity="23 kg"
                                    />

                                    <RouteCard
                                        icon={ArrowRight}
                                        title="Recovery"
                                        quantity="9 kg"
                                    />

                                </div>

                            </div>


                            <div className="mt-4 rounded-2xl border border-[#cfe0d2] bg-[#f1f8f1] p-4">

                                <div className="flex items-start justify-between gap-4">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-[#4e765a]">
                                            Recommended Route
                                        </p>

                                        <p className="mt-1 text-base font-bold text-[#214e32]">
                                            Optimized batch distribution
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[#637469]">
                                            Based on estimated quality, market conditions and
                                            expected economics.
                                        </p>

                                    </div>


                                    <div className="rounded-xl bg-white p-2 text-[#39805a] shadow-sm">

                                        <BarChart3 size={18} />

                                    </div>

                                </div>

                            </div>


                            {scanning && (

                                <div className="absolute inset-0 flex items-center justify-center bg-[#173a29]/10 backdrop-blur-[2px]">

                                    <div className="rounded-2xl border border-white/70 bg-white px-6 py-5 text-center shadow-xl">

                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf7ef] text-[#39805a]">

                                            <ScanLine
                                                size={23}
                                                className="animate-pulse"
                                            />

                                        </div>


                                        <p className="mt-3 text-sm font-bold text-[#173a29]">
                                            Analyzing sample...
                                        </p>


                                        <p className="mt-1 text-xs text-[#728077]">
                                            Detecting visible quality indicators
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>


                        <button
                            type="button"
                            onClick={startScan}
                            disabled={scanning}
                            className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#d5ddd5] bg-white px-5 py-3 text-xs font-bold text-[#31563f] shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                        >

                            <ScanLine size={15} />

                            {scanning
                                ? "Scanning..."
                                : "Preview AI Scan"}

                        </button>

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* FEATURES */}
            {/* ===================================================== */}

            <section
                id="product"
                className="border-y border-[#e0e5df] bg-white"
            >

                <div className="mx-auto grid max-w-7xl divide-y divide-[#e5e9e4] px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">

                    {features.map((feature) => {

                        const Icon = feature.icon

                        return (

                            <div
                                key={feature.title}
                                className="p-7 lg:p-8"
                            >

                                <Icon
                                    size={21}
                                    className="text-[#397653]"
                                />

                                <h3 className="mt-4 text-sm font-bold text-[#24372b]">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-[#6a776f]">
                                    {feature.description}
                                </p>

                            </div>

                        )

                    })}

                </div>

            </section>


            {/* ===================================================== */}
            {/* HOW IT WORKS */}
            {/* ===================================================== */}

            <section
                id="how-it-works"
                className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
            >

                <div className="max-w-2xl">

                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d815f]">
                        How it works
                    </p>

                    <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#173a29] sm:text-5xl">
                        From harvest to better decisions.
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#66746b]">
                        A simple workflow that turns crop quality into actionable
                        post-harvest decisions.
                    </p>

                </div>


                <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                    <Step
                        number="01"
                        title="Create Your Harvest Lot"
                        description="Enter your crop, quantity, harvest date and location."
                    />

                    <Step
                        number="02"
                        title="Capture Representative Samples"
                        description="Capture a small number of representative images from the batch."
                    />

                    <Step
                        number="03"
                        title="AI Quality Assessment"
                        description="Analyze visible ripeness, defects, color, shape and surface condition."
                    />

                    <Step
                        number="04"
                        title="Choose the Best Route"
                        description="Compare fresh market, processing, storage and recovery opportunities."
                    />

                </div>

            </section>


            {/* ===================================================== */}
            {/* WORKFLOW */}
            {/* ===================================================== */}

            <section className="border-y border-[#dfe5df] bg-[#edf2eb]">

                <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

                    <div className="text-center">

                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d815f]">
                            The AgriSathi workflow
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#173a29] sm:text-4xl">
                            Harvest → Quality → Options → Economics → Decision
                        </h2>

                    </div>


                    <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center justify-between gap-5 md:flex-row md:gap-3">

                        {[
                            ["01", "HARVEST"],
                            ["02", "QUALITY"],
                            ["03", "OPTIONS"],
                            ["04", "ECONOMICS"],
                            ["05", "DECISION"],
                        ].map(([number, label], index) => (

                            <div
                                key={label}
                                className="flex w-full items-center md:w-auto"
                            >

                                <div className="flex w-full flex-col items-center md:w-36">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#cbd8ce] bg-white text-sm font-bold text-[#397653] shadow-sm">
                                        {number}
                                    </div>

                                    <p className="mt-3 text-xs font-bold tracking-[0.12em] text-[#52675a]">
                                        {label}
                                    </p>

                                </div>


                                {index < 4 && (

                                    <ArrowRight
                                        size={18}
                                        className="hidden text-[#92a397] md:block"
                                    />

                                )}

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* DESTINATIONS */}
            {/* ===================================================== */}

            <section
                id="solutions"
                className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
            >

                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                    <div className="max-w-2xl">

                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d815f]">
                            Smart destinations
                        </p>

                        <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#173a29] sm:text-5xl">
                            One harvest. Multiple possibilities.
                        </h2>

                    </div>


                    <p className="max-w-md text-sm leading-6 text-[#69776e]">
                        A harvested batch does not necessarily have one single
                        destination. AgriSathi helps compare potential routes.
                    </p>

                </div>


                <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                    {destinations.map((destination) => {

                        const Icon = destination.icon

                        return (

                            <div
                                key={destination.title}
                                className="group rounded-2xl border border-[#dce3dc] bg-white p-6 transition hover:-translate-y-1 hover:border-[#b9cbbb] hover:shadow-xl hover:shadow-[#274d34]/5"
                            >

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5ee] text-[#397653] transition group-hover:bg-[#174a32] group-hover:text-white">

                                    <Icon size={20} />

                                </div>


                                <h3 className="mt-6 text-lg font-bold text-[#24372b]">
                                    {destination.title}
                                </h3>


                                <p className="mt-2 text-sm leading-6 text-[#6b786f]">
                                    {destination.description}
                                </p>

                            </div>

                        )

                    })}

                </div>

            </section>


            {/* ===================================================== */}
            {/* AI QUALITY */}
            {/* ===================================================== */}

            <section className="bg-[#173a29] text-white">

                <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">

                    <div>

                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#a9c69f]">
                            AI quality assessment
                        </p>


                        <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                            See the quality inside your batch.
                        </h2>


                        <p className="mt-6 max-w-xl text-base leading-7 text-[#c6d3c9]">
                            AgriSathi analyzes representative samples to estimate the visual
                            quality distribution of a harvested lot.
                        </p>


                        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3">

                            {[
                                "Ripeness",
                                "Surface condition",
                                "Color uniformity",
                                "Visible defects",
                                "Shape",
                            ].map((item) => (

                                <div
                                    key={item}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#d5e0d7]"
                                >
                                    {item}
                                </div>

                            ))}

                        </div>

                    </div>


                    <div className="rounded-3xl border border-white/10 bg-white p-5 text-[#173a29] shadow-2xl">

                        <div className="flex items-center justify-between border-b border-[#e5ebe5] pb-4">

                            <div>

                                <p className="text-xs font-bold uppercase tracking-wider text-[#7c8b81]">
                                    Tomato Batch Analysis
                                </p>

                                <p className="mt-1 text-lg font-bold">
                                    100 kg batch
                                </p>

                            </div>


                            <div className="rounded-xl bg-[#edf7ef] p-2.5 text-[#397653]">

                                <ScanLine size={20} />

                            </div>

                        </div>


                        <div className="mt-6">

                            <div className="flex items-end justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-[#637168]">
                                        Quality distribution
                                    </p>

                                    <p className="mt-1 text-xs text-[#8a958e]">
                                        Illustrative assessment
                                    </p>

                                </div>


                                <p className="text-sm font-bold text-[#397653]">
                                    High confidence
                                </p>

                            </div>


                            <div className="mt-4 h-4 overflow-hidden rounded-full bg-[#e8ece7]">

                                <div className="flex h-full">

                                    <div className="w-[68%] bg-[#4f8b61]" />
                                    <div className="w-[23%] bg-[#d2a33d]" />
                                    <div className="w-[9%] bg-[#bf7358]" />

                                </div>

                            </div>


                            <div className="mt-5 grid grid-cols-3 gap-4">

                                <Metric
                                    value="68%"
                                    label="Grade A"
                                />

                                <Metric
                                    value="23%"
                                    label="Grade B"
                                />

                                <Metric
                                    value="9%"
                                    label="Recovery"
                                />

                            </div>

                        </div>


                        <div className="mt-6 rounded-2xl bg-[#f5f7f3] p-4">

                            <p className="text-xs font-bold uppercase tracking-wider text-[#758178]">
                                Visual assessment only
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#68756d]">
                                Internal or hidden defects may not be visible from external
                                images.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* DECISION INTELLIGENCE */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

                <div className="max-w-2xl">

                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d815f]">
                        Decision intelligence
                    </p>

                    <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#173a29] sm:text-5xl">
                        Don&apos;t stop at quality. Decide what to do next.
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#66746b]">
                        Quality assessment becomes valuable when it leads to a better
                        post-harvest decision.
                    </p>

                </div>


                <div className="mt-12 overflow-hidden rounded-2xl border border-[#dce3dc] bg-white shadow-sm">

                    <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1fr] border-b border-[#e6ebe5] bg-[#f7f9f6] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#7a877e] sm:grid">

                        <span>Destination</span>
                        <span>Expected Value</span>
                        <span>Risk</span>
                        <span>Status</span>

                    </div>


                    {[
                        ["Fresh Market", "₹X", "Medium", "Good"],
                        ["Processing", "₹X", "Low", "Recommended"],
                        ["Storage", "₹X", "High", "Consider"],
                        ["Recovery", "₹X", "Low", "Backup"],
                    ].map(([name, value, risk, status]) => (

                        <div
                            key={name}
                            className="grid gap-2 border-b border-[#edf0ed] px-6 py-5 last:border-0 sm:grid-cols-[1.4fr_1fr_0.8fr_1fr] sm:items-center"
                        >

                            <div>

                                <p className="text-sm font-bold text-[#293b30]">
                                    {name}
                                </p>

                                <p className="mt-1 text-xs text-[#89948d] sm:hidden">
                                    Expected value: {value} · Risk: {risk}
                                </p>

                            </div>


                            <span className="hidden text-sm font-semibold text-[#405249] sm:block">
                                {value}
                            </span>


                            <span className="hidden text-sm text-[#68766d] sm:block">
                                {risk}
                            </span>


                            <span
                                className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                                    status === "Recommended"
                                        ? "bg-[#edf7ef] text-[#397653]"
                                        : "bg-[#f2f4f1] text-[#647269]"
                                }`}
                            >
                                {status}
                            </span>

                        </div>

                    ))}

                </div>


                <div className="mt-5 rounded-2xl border border-[#cfe0d2] bg-[#f1f8f1] p-5">

                    <p className="text-xs font-bold uppercase tracking-wider text-[#4e765a]">
                        Recommended: Processing
                    </p>


                    <div className="mt-3 grid gap-3 sm:grid-cols-3">

                        <Reason text="Better fit for estimated quality distribution" />

                        <Reason text="Lower spoilage exposure" />

                        <Reason text="Competitive processor value" />

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* SMART ROUTING */}
            {/* ===================================================== */}

            <section className="border-y border-[#dfe5df] bg-[#f0f4ed]">

                <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

                    <div className="text-center">

                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d815f]">
                            Smart routing
                        </p>

                        <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#173a29] sm:text-5xl">
                            Optimize the destination of every batch.
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#69776e]">
                            Routing considers quality assessment, market conditions,
                            processing opportunities and expected economics.
                        </p>

                    </div>


                    <div className="mx-auto mt-14 max-w-4xl rounded-3xl border border-[#d4ded4] bg-white p-6 shadow-sm sm:p-8">

                        <div className="text-center">

                            <p className="text-xs font-bold uppercase tracking-wider text-[#7b887f]">
                                Total Harvest
                            </p>

                            <p className="mt-1 text-4xl font-bold text-[#173a29]">
                                100 KG
                            </p>

                        </div>


                        <div className="my-8 h-px bg-[#e4e9e3]" />


                        <div className="grid gap-4 md:grid-cols-3">

                            <RoutingCard
                                quantity="68 KG"
                                destination="Fresh Market"
                                percentage="68%"
                                icon={Store}
                            />

                            <RoutingCard
                                quantity="23 KG"
                                destination="Processing"
                                percentage="23%"
                                icon={Factory}
                            />

                            <RoutingCard
                                quantity="9 KG"
                                destination="Recovery"
                                percentage="9%"
                                icon={ArrowRight}
                            />

                        </div>


                        <div className="mt-6 rounded-2xl bg-[#173a29] p-5 text-white">

                            <p className="text-xs font-bold uppercase tracking-wider text-[#b4cdb6]">
                                Optimized Batch Routing
                            </p>

                            <p className="mt-2 text-lg font-bold">
                                Match quality with the right opportunity.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* FPO */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

                <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

                    <div>

                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d815f]">
                            FPO aggregation
                        </p>


                        <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#173a29] sm:text-5xl">
                            Turn individual harvests into collective opportunity.
                        </h2>


                        <p className="mt-6 text-base leading-7 text-[#68766d]">
                            Compatible harvest lots can potentially be aggregated through
                            FPOs or collection networks to improve volume, processor
                            compatibility and logistics efficiency.
                        </p>


                        {isSignedIn ? (

                            <a
                                href="/dashboard"
                                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#397653]"
                            >
                                Explore AgriSathi
                                <ArrowRight size={16} />
                            </a>

                        ) : (

                            <SignUpButton
                                mode="modal"
                                forceRedirectUrl="/dashboard"
                            >
                                <button
                                    type="button"
                                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#397653]"
                                >
                                    Explore AgriSathi
                                    <ArrowRight size={16} />
                                </button>
                            </SignUpButton>

                        )}

                    </div>


                    <div className="rounded-3xl border border-[#dce3dc] bg-[#f7f9f5] p-6 sm:p-8">

                        <div className="grid gap-3">

                            <FarmerRow
                                name="Farmer A"
                                quantity="100 kg"
                            />

                            <FarmerRow
                                name="Farmer B"
                                quantity="80 kg"
                            />

                            <FarmerRow
                                name="Farmer C"
                                quantity="120 kg"
                            />

                        </div>


                        <div className="my-5 flex justify-center">

                            <ChevronDown
                                size={22}
                                className="text-[#829087]"
                            />

                        </div>


                        <div className="rounded-2xl border border-[#cbdacb] bg-white p-5 text-center shadow-sm">

                            <p className="text-xs font-bold uppercase tracking-wider text-[#77857b]">
                                Compatible Lot
                            </p>

                            <p className="mt-1 text-3xl font-bold text-[#173a29]">
                                300 kg
                            </p>

                            <p className="mt-1 text-sm text-[#6e7b72]">
                                Aggregated opportunity
                            </p>

                        </div>


                        <div className="my-5 flex justify-center">

                            <ChevronDown
                                size={22}
                                className="text-[#829087]"
                            />

                        </div>


                        <div className="rounded-2xl bg-[#173a29] p-5 text-center text-white">

                            <p className="text-xs font-bold uppercase tracking-wider text-[#b5cdb8]">
                                Destination
                            </p>

                            <p className="mt-1 text-lg font-bold">
                                Processor / Buyer
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* DIFFERENTIATOR */}
            {/* ===================================================== */}

            <section
                id="about"
                className="bg-[#173a29] text-white"
            >

                <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

                    <div className="mx-auto max-w-3xl text-center">

                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#a9c69f]">
                            What makes AgriSathi different
                        </p>

                        <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                            Beyond crop detection.
                        </h2>

                        <p className="mt-5 text-base leading-7 text-[#c7d4ca]">
                            AgriSathi is not simply a computer vision classifier. It connects
                            visual quality with market conditions, processing opportunities
                            and economics to support a post-harvest decision.
                        </p>

                    </div>


                    <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">

                            <p className="text-xs font-bold uppercase tracking-wider text-[#9eb1a3]">
                                Traditional approach
                            </p>

                            <p className="mt-4 text-2xl font-bold text-[#d9e3da]">
                                Detect → Classify
                            </p>

                            <p className="mt-3 text-sm leading-6 text-[#aebeb1]">
                                Identify what is visible without necessarily connecting the
                                result to a post-harvest action.
                            </p>

                        </div>


                        <div className="rounded-3xl border border-[#6d936e]/40 bg-[#315c3f]/40 p-7">

                            <p className="text-xs font-bold uppercase tracking-wider text-[#b5d2b2]">
                                AgriSathi
                            </p>

                            <p className="mt-4 text-2xl font-bold">
                                Assess → Compare → Route → Optimize
                            </p>

                            <p className="mt-3 text-sm leading-6 text-[#c5d7c8]">
                                Connect quality assessment with potential destinations and
                                expected economics.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* FINAL CTA */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

                <div className="overflow-hidden rounded-[32px] bg-[#e7efe3] px-6 py-16 text-center sm:px-12">

                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d815f]">
                        Start with your harvest
                    </p>


                    <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[#173a29] sm:text-5xl">
                        Know your harvest. Choose the better route.
                    </h2>


                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#637268]">
                        Turn crop quality into actionable post-harvest decisions with
                        AgriSathi.
                    </p>


                    {isSignedIn ? (

                        <a
                            href="/dashboard"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#174a32] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#174a32]/10 transition hover:-translate-y-0.5 hover:bg-[#103b27]"
                        >
                            Get Started
                            <ArrowRight size={17} />
                        </a>

                    ) : (

                        <SignUpButton
                            mode="modal"
                            forceRedirectUrl="/dashboard"
                        >
                            <button
                                type="button"
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#174a32] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#174a32]/10 transition hover:-translate-y-0.5 hover:bg-[#103b27]"
                            >
                                Get Started
                                <ArrowRight size={17} />
                            </button>
                        </SignUpButton>

                    )}

                </div>

            </section>


            {/* ===================================================== */}
            {/* FOOTER */}
            {/* ===================================================== */}

            <footer className="border-t border-[#dfe5df] bg-white">

                <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

                        <div className="lg:col-span-2">

                            <a
                                href="/"
                                className="flex items-center gap-2.5"
                            >

                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#174a32] text-white">

                                    <Leaf size={18} />

                                </span>


                                <span className="text-lg font-bold text-[#173a29]">
                                    AgriSathi
                                </span>

                            </a>


                            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6b786f]">
                                AI-powered post-harvest intelligence for smarter crop
                                decisions.
                            </p>

                        </div>


                        <FooterColumn
                            title="Product"
                            items={[
                                "Quality Analysis",
                                "Smart Routing",
                                "Decision Intelligence",
                                "Market Insights",
                            ]}
                        />


                        <FooterColumn
                            title="Solutions"
                            items={[
                                "Farmers",
                                "FPOs",
                                "Aggregators",
                                "Processors",
                            ]}
                        />


                        <FooterColumn
                            title="Company"
                            items={[
                                "About",
                                "How It Works",
                                "Contact",
                                "Privacy",
                            ]}
                        />

                    </div>


                    <div className="mt-12 flex flex-col justify-between gap-3 border-t border-[#e6ebe5] pt-6 text-xs text-[#7b887f] sm:flex-row">

                        <p>
                            © 2026 AgriSathi. All rights reserved.
                        </p>

                        <p>
                            AI-assisted visual assessment · Decision intelligence
                        </p>

                    </div>

                </div>

            </footer>

        </main>
    )
}


/* ========================================================= */
/* ROUTE CARD */
/* ========================================================= */

function RouteCard({
    icon: Icon,
    title,
    quantity,
    active = false,
}: {
    icon: typeof Store
    title: string
    quantity: string
    active?: boolean
}) {

    return (

        <div
            className={`rounded-xl border p-3 ${
                active
                    ? "border-[#c9ddcc] bg-[#f2f8f2]"
                    : "border-[#e4e9e3] bg-white"
            }`}
        >

            <div className="flex items-center gap-2">

                <Icon
                    size={15}
                    className="text-[#397653]"
                />

                <p className="text-xs font-semibold text-[#65736a]">
                    {title}
                </p>

            </div>


            <p className="mt-2 text-lg font-bold text-[#26372d]">
                {quantity}
            </p>

        </div>

    )
}


/* ========================================================= */
/* STEP */
/* ========================================================= */

function Step({
    number,
    title,
    description,
}: {
    number: string
    title: string
    description: string
}) {

    return (

        <div className="rounded-2xl border border-[#dce3dc] bg-white p-6">

            <span className="text-sm font-bold text-[#5d815f]">
                {number}
            </span>


            <h3 className="mt-8 text-lg font-bold text-[#24372b]">
                {title}
            </h3>


            <p className="mt-2 text-sm leading-6 text-[#6a776f]">
                {description}
            </p>

        </div>

    )
}


/* ========================================================= */
/* METRIC */
/* ========================================================= */

function Metric({
    value,
    label,
}: {
    value: string
    label: string
}) {

    return (

        <div>

            <p className="text-2xl font-bold text-[#315c3f]">
                {value}
            </p>

            <p className="mt-1 text-xs text-[#7a877f]">
                {label}
            </p>

        </div>

    )
}


/* ========================================================= */
/* REASON */
/* ========================================================= */

function Reason({
    text,
}: {
    text: string
}) {

    return (

        <div className="flex items-start gap-2 text-sm text-[#52665a]">

            <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-[#39805a]"
            />

            <span>
                {text}
            </span>

        </div>

    )
}


/* ========================================================= */
/* ROUTING CARD */
/* ========================================================= */

function RoutingCard({
    quantity,
    destination,
    percentage,
    icon: Icon,
}: {
    quantity: string
    destination: string
    percentage: string
    icon: typeof Store
}) {

    return (

        <div className="rounded-2xl border border-[#e1e7df] bg-[#fafbf9] p-5">

            <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4ed] text-[#397653]">

                    <Icon size={18} />

                </div>


                <span className="text-sm font-bold text-[#6d7c72]">
                    {percentage}
                </span>

            </div>


            <p className="mt-6 text-2xl font-bold text-[#173a29]">
                {quantity}
            </p>


            <p className="mt-1 text-sm font-semibold text-[#647269]">
                {destination}
            </p>

        </div>

    )
}


/* ========================================================= */
/* FARMER ROW */
/* ========================================================= */

function FarmerRow({
    name,
    quantity,
}: {
    name: string
    quantity: string
}) {

    return (

        <div className="flex items-center justify-between rounded-2xl border border-[#e1e7df] bg-white px-5 py-4">

            <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf2e9] text-[#397653]">

                    <Leaf size={16} />

                </div>


                <p className="text-sm font-bold text-[#304137]">
                    {name}
                </p>

            </div>


            <p className="text-sm font-bold text-[#52635a]">
                {quantity}
            </p>

        </div>

    )
}


/* ========================================================= */
/* FOOTER COLUMN */
/* ========================================================= */

function FooterColumn({
    title,
    items,
}: {
    title: string
    items: string[]
}) {

    return (

        <div>

            <p className="text-sm font-bold text-[#304137]">
                {title}
            </p>


            <ul className="mt-4 space-y-3">

                {items.map((item) => (

                    <li key={item}>

                        <a
                            href="#"
                            className="text-sm text-[#748078] transition hover:text-[#397653]"
                        >
                            {item}
                        </a>

                    </li>

                ))}

            </ul>

        </div>

    )
}