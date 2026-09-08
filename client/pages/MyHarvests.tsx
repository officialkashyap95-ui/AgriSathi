import {
    ArrowRight,
    ChevronDown,
    Filter,
    Plus,
    Search,
    Sprout,
    Wheat,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";

import api from "../src/lib/api";

import HarvestCard from "../components/harvest/HarvestCard";
import HarvestTable from "../components/harvest/HarvestTable";
import type { HarvestLot } from "../components/harvest/HarvestCard";

import "./styles/MyHarvests.css";


type ApiHarvestLot = {
    _id: string;
    crop: string;
    quantityKg: number;
    harvestDate: string;
    location: string;
    status:
    | "created"
    | "sampling"
    | "analyzing"
    | "analyzed"
    | "recommended";
    createdAt: string;
    updatedAt: string;
};


export default function MyHarvests() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("newest");

    const [harvests, setHarvests] = useState<HarvestLot[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");


    /*
     * Fetch harvest lots from backend
     *
     * GET /api/lots
     */
    useEffect(() => {
        const fetchHarvestLots = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await api.get("/lots");

                const lots: ApiHarvestLot[] =
                    response.data.data || [];

                const mappedLots: HarvestLot[] = lots.map(
                    (lot) => ({
                        id: lot._id,
                        crop: lot.crop,
                        quantityKg: lot.quantityKg,
                        harvestDate: lot.harvestDate,
                        location: lot.location,
                        status: lot.status,
                        updatedAt: lot.updatedAt,
                    })
                );

                setHarvests(mappedLots);
            } catch (error) {
                console.error(
                    "Failed to fetch harvest lots:",
                    error
                );

                setError(
                    "Unable to load your harvest lots. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchHarvestLots();
    }, []);


    /*
     * Filter + search + sort
     */
    const filteredHarvests = useMemo(() => {
        const filtered = harvests.filter((harvest) => {
            const searchTerm = search.toLowerCase();

            const searchMatch =
                harvest.crop
                    .toLowerCase()
                    .includes(searchTerm) ||
                harvest.location
                    .toLowerCase()
                    .includes(searchTerm);

            const statusMatch =
                status === "all" ||
                harvest.status === status;

            return searchMatch && statusMatch;
        });

        return [...filtered].sort((a, b) => {
            const first = new Date(a.updatedAt).getTime();
            const second = new Date(b.updatedAt).getTime();

            return sort === "newest"
                ? second - first
                : first - second;
        });
    }, [harvests, search, status, sort]);


    /*
     * Summary statistics
     */
    const totalHarvestLots = harvests.length;

    const awaitingAnalysis = harvests.filter(
        (harvest) =>
            harvest.status === "created" ||
            harvest.status === "sampling" ||
            harvest.status === "analyzing"
    ).length;

    const analyzedLots = harvests.filter(
        (harvest) =>
            harvest.status === "analyzed"
    ).length;

    const recommendationLots = harvests.filter(
        (harvest) =>
            harvest.status === "recommended"
    ).length;


    /*
     * View harvest
     */
    const handleViewHarvest = (id: string) => {
        window.location.href = `/harvests/${id}`;
    };


    /*
     * Loading state
     */
    if (isLoading) {
        return (
            <div className="my-harvests-page">
                <section className="harvest-loading-state">
                    <div className="empty-icon">
                        <Wheat size={28} />
                    </div>

                    <h3>Loading your harvests...</h3>

                    <p>
                        Fetching your harvest lots from
                        AgriSathi.
                    </p>
                </section>
            </div>
        );
    }


    /*
     * Error state
     */
    if (error) {
        return (
            <div className="my-harvests-page">
                <section className="harvest-error-state">
                    <div className="empty-icon">
                        <Wheat size={28} />
                    </div>

                    <h3>
                        Unable to load harvests
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        className="primary-action"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>
                </section>
            </div>
        );
    }


    return (
        <div className="my-harvests-page">

            {/* Page Header */}

            <section className="my-harvests-header">
                <div>
                    <div className="page-eyebrow">
                        <Sprout size={14} />
                        HARVEST MANAGEMENT
                    </div>

                    <h1>
                        My Harvests
                    </h1>

                    <p>
                        Track your harvest lots, quality
                        assessments, and recommendations
                        from one place.
                    </p>
                </div>

                <Link
                    to="/harvests/new"
                    className="primary-action"
                >
                    <Plus size={18} />
                    Create Harvest Lot
                </Link>
            </section>


            {/* Summary */}

            <section className="harvest-summary-grid">

                <SummaryCard
                    icon={<Wheat size={18} />}
                    label="Total Harvest Lots"
                    value={String(totalHarvestLots)}
                    description="All created lots"
                />

                <SummaryCard
                    icon={<Search size={18} />}
                    label="Awaiting Analysis"
                    value={String(awaitingAnalysis)}
                    description="Sampling or analysis pending"
                />

                <SummaryCard
                    icon={<Sprout size={18} />}
                    label="Analyzed"
                    value={String(analyzedLots)}
                    description="Quality assessment completed"
                />

                <SummaryCard
                    icon={<ArrowRight size={18} />}
                    label="Recommendations"
                    value={String(recommendationLots)}
                    description="Ready for routing decision"
                />

            </section>


            {/* Filters */}

            <section className="harvest-toolbar">

                <div className="harvest-search">
                    <Search size={18} />

                    <input
                        type="search"
                        placeholder="Search by crop or location..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />
                </div>


                <div className="harvest-filters">

                    <div className="select-wrapper">

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                        >
                            <option value="all">
                                All statuses
                            </option>

                            <option value="created">
                                Created
                            </option>

                            <option value="sampling">
                                Sampling
                            </option>

                            <option value="analyzing">
                                Analyzing
                            </option>

                            <option value="analyzed">
                                Analyzed
                            </option>

                            <option value="recommended">
                                Recommendation Ready
                            </option>
                        </select>

                        <ChevronDown size={16} />

                    </div>


                    <div className="select-wrapper">

                        <select
                            value={sort}
                            onChange={(event) =>
                                setSort(
                                    event.target.value
                                )
                            }
                        >
                            <option value="newest">
                                Newest first
                            </option>

                            <option value="oldest">
                                Oldest first
                            </option>
                        </select>

                        <ChevronDown size={16} />

                    </div>

                </div>

            </section>


            {/* Section Heading */}

            <div className="harvest-list-heading">

                <div>

                    <h2>
                        Harvest Lots
                    </h2>

                    <p>
                        Your harvest history and current
                        workflow status.
                    </p>

                </div>

                <span>
                    <Filter size={14} />
                    {filteredHarvests.length} lots
                </span>

            </div>


            {/* Data */}

            {filteredHarvests.length === 0 ? (

                <EmptyState
                    onCreate={() =>
                    (window.location.href =
                        "/harvests/new")
                    }
                    hasHarvests={
                        harvests.length > 0
                    }
                />

            ) : (

                <>

                    {/* Desktop */}

                    <div className="desktop-harvest-list">

                        <HarvestTable
                            harvests={filteredHarvests}
                            onView={handleViewHarvest}
                        />

                    </div>


                    {/* Mobile */}

                    <div className="mobile-harvest-list">

                        {filteredHarvests.map(
                            (harvest) => (

                                <HarvestCard
                                    key={harvest.id}
                                    harvest={harvest}
                                    onView={
                                        handleViewHarvest
                                    }
                                />

                            )
                        )}

                    </div>

                </>

            )}

        </div>
    );
}


/*
 * Summary Card
 */

function SummaryCard({
    icon,
    label,
    value,
    description,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    description: string;
}) {
    return (
        <div className="summary-card">

            <div className="summary-icon">
                {icon}
            </div>

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

            <small>
                {description}
            </small>

        </div>
    );
}


/*
 * Empty State
 */

function EmptyState({
    onCreate,
    hasHarvests,
}: {
    onCreate: () => void;
    hasHarvests: boolean;
}) {
    return (
        <section className="harvest-empty-state">

            <div className="empty-icon">
                <Wheat size={28} />
            </div>

            <h3>
                {hasHarvests
                    ? "No matching harvest lots"
                    : "No harvest lots yet"}
            </h3>

            <p>
                {hasHarvests
                    ? "Try changing your search or filters to find another harvest lot."
                    : "Create your first harvest lot to begin quality assessment and smart routing."}
            </p>

            {!hasHarvests && (
                <button
                    className="primary-action"
                    onClick={onCreate}
                >
                    <Plus size={17} />
                    Create Harvest Lot
                </button>
            )}

        </section>
    );
}