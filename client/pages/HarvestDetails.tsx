import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Sprout,
    Wheat,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../src/lib/api";

import HarvestStatus from "../components/harvest/HarvestStatus";

import "./styles/HarvestDetails.css";


type HarvestLot = {
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


export default function HarvestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [harvest, setHarvest] =
        useState<HarvestLot | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {
        const fetchHarvest = async () => {
            if (!id) {
                setError("Harvest lot ID is missing.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const response =
                    await api.get(`/lots/${id}`);

                setHarvest(response.data.data);
            } catch (error) {
                console.error(
                    "Failed to fetch harvest:",
                    error
                );

                setError(
                    "Unable to load this harvest lot."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchHarvest();
    }, [id]);


    if (isLoading) {
        return (
            <div className="harvest-details-page">
                <section className="harvest-details-state">
                    <div className="details-state-icon">
                        <Wheat size={28} />
                    </div>

                    <h2>
                        Loading harvest details...
                    </h2>

                    <p>
                        Fetching your harvest lot information.
                    </p>
                </section>
            </div>
        );
    }


    if (error || !harvest) {
        return (
            <div className="harvest-details-page">
                <section className="harvest-details-state">
                    <div className="details-state-icon">
                        <Wheat size={28} />
                    </div>

                    <h2>
                        Harvest lot not found
                    </h2>

                    <p>
                        {error ||
                            "This harvest lot could not be found."}
                    </p>

                    <Link
                        to="/harvests"
                        className="primary-action"
                    >
                        <ArrowLeft size={17} />
                        Back to My Harvests
                    </Link>
                </section>
            </div>
        );
    }


    return (
        <div className="harvest-details-page">

            {/* Back */}

            <Link
                to="/harvests"
                className="back-link"
            >
                <ArrowLeft size={17} />
                Back to My Harvests
            </Link>


            {/* Header */}

            <section className="harvest-details-header">

                <div>

                    <div className="page-eyebrow">
                        <Sprout size={14} />
                        HARVEST LOT
                    </div>

                    <h1>
                        {harvest.crop} Harvest
                    </h1>

                    <p>
                        Review your harvest information
                        before starting representative
                        sampling.
                    </p>

                </div>

                <HarvestStatus
                    status={harvest.status}
                />

            </section>


            {/* Main Information */}

            <section className="harvest-details-grid">

                <div className="details-main-card">

                    <div className="details-card-header">
                        <div>
                            <span>
                                CROP DETAILS
                            </span>

                            <h2>
                                Harvest Lot
                            </h2>
                        </div>

                        <div className="details-crop-icon">
                            <Wheat size={24} />
                        </div>
                    </div>


                    <div className="details-info-grid">

                        <InfoItem
                            icon={
                                <Wheat size={18} />
                            }
                            label="Crop"
                            value={
                                harvest.crop
                            }
                        />

                        <InfoItem
                            icon={
                                <Wheat size={18} />
                            }
                            label="Quantity"
                            value={`${harvest.quantityKg} kg`}
                        />

                        <InfoItem
                            icon={
                                <CalendarDays size={18} />
                            }
                            label="Harvest Date"
                            value={formatDate(
                                harvest.harvestDate
                            )}
                        />

                        <InfoItem
                            icon={
                                <MapPin size={18} />
                            }
                            label="Location"
                            value={
                                harvest.location
                            }
                        />

                    </div>

                </div>


                {/* Workflow */}

                <div className="workflow-card">

                    <div className="workflow-card-header">

                        <span>
                            CURRENT WORKFLOW
                        </span>

                        <strong>
                            Step 1 of 4
                        </strong>

                    </div>


                    <div className="workflow-progress">

                        <WorkflowStep
                            number="01"
                            title="Harvest Lot"
                            active
                            completed
                        />

                        <WorkflowLine />

                        <WorkflowStep
                            number="02"
                            title="Sampling"
                            active={false}
                            completed={false}
                        />

                        <WorkflowLine />

                        <WorkflowStep
                            number="03"
                            title="AI Analysis"
                            active={false}
                            completed={false}
                        />

                        <WorkflowLine />

                        <WorkflowStep
                            number="04"
                            title="Recommendation"
                            active={false}
                            completed={false}
                        />

                    </div>

                </div>

            </section>


            {/* Sampling Section */}

            <section className="next-step-card">

                <div className="next-step-content">

                    <div className="next-step-icon">
                        <Sprout size={22} />
                    </div>

                    <div>

                        <span>
                            NEXT STEP
                        </span>

                        <h2>
                            Capture Representative Samples
                        </h2>

                        <p>
                            Take a small number of
                            representative images from
                            this harvest batch. You do
                            not need to photograph every
                            tomato individually.
                        </p>

                    </div>

                </div>


                <button
                    className="primary-action"
                    onClick={() =>
                        navigate(
                            `/harvests/${harvest._id}/sampling`
                        )
                    }
                >
                    Continue to Sampling
                    <ArrowLeft
                        size={17}
                        className="rotate-arrow"
                    />
                </button>

            </section>


            {/* Visual Assessment Notice */}

            <section className="assessment-notice">

                <div>
                    <strong>
                        About AI visual assessment
                    </strong>

                    <p>
                        AgriSathi uses representative
                        images to estimate visible
                        quality characteristics such
                        as ripeness, surface condition,
                        color uniformity, visible
                        defects, and appearance.
                    </p>
                </div>

                <span>
                    Visual assessment only
                </span>

            </section>

        </div>
    );
}


/* Information Item */

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="details-info-item">

            <div className="details-info-icon">
                {icon}
            </div>

            <div>
                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>
            </div>

        </div>
    );
}


/* Workflow Step */

function WorkflowStep({
    number,
    title,
    active,
    completed,
}: {
    number: string;
    title: string;
    active: boolean;
    completed: boolean;
}) {
    return (
        <div
            className={`workflow-step ${
                active
                    ? "workflow-step-active"
                    : ""
            }`}
        >
            <div
                className={`workflow-number ${
                    completed
                        ? "workflow-number-completed"
                        : ""
                }`}
            >
                {number}
            </div>

            <span>
                {title}
            </span>
        </div>
    );
}


/* Workflow Line */

function WorkflowLine() {
    return (
        <div className="workflow-line" />
    );
}


/* Date */

function formatDate(date: string) {
    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(new Date(date));
}