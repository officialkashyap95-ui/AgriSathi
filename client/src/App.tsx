import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom"

import {
    SignedIn,
    SignedOut,
} from "@clerk/clerk-react"

import AgriSathiLanding from "../components/landing/AgriSathiLanding"
import DashboardLayout from "../components/dashboard/DashboardLayout"
import Dashboard from "../pages/Dashboard"


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================================
                    PUBLIC ROUTES
                ========================================= */}

                <Route
                    path="/"
                    element={<AgriSathiLanding />}
                />


                {/* =========================================
                    PROTECTED APPLICATION
                ========================================= */}

                <Route
                    element={<DashboardLayout />}
                >
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                <SignedIn>
                                    <Dashboard />
                                </SignedIn>

                                <SignedOut>
                                    <Navigate
                                        to="/"
                                        replace
                                    />
                                </SignedOut>
                            </>
                        }
                    />

                    {/* Temporary protected routes */}

                    <Route
                        path="/harvests"
                        element={
                            <PlaceholderPage
                                title="My Harvests"
                            />
                        }
                    />

                    <Route
                        path="/harvests/new"
                        element={
                            <PlaceholderPage
                                title="Create Harvest Lot"
                            />
                        }
                    />

                    <Route
                        path="/market"
                        element={
                            <PlaceholderPage
                                title="Market"
                            />
                        }
                    />

                    <Route
                        path="/processors"
                        element={
                            <PlaceholderPage
                                title="Processors"
                            />
                        }
                    />

                    <Route
                        path="/fpo"
                        element={
                            <PlaceholderPage
                                title="FPO"
                            />
                        }
                    />

                    <Route
                        path="/storage"
                        element={
                            <PlaceholderPage
                                title="Storage"
                            />
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <PlaceholderPage
                                title="Settings"
                            />
                        }
                    />
                </Route>


                {/* =========================================
                    FALLBACK
                ========================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    )
}


/* =========================================
   TEMPORARY PLACEHOLDER PAGE
========================================= */

function PlaceholderPage({
    title,
}: {
    title: string
}) {
    return (
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

            <div className="rounded-2xl border border-[#dfe5df] bg-white p-8 shadow-sm">

                <p className="text-sm font-semibold text-[#075b2b]">
                    AgriSathi
                </p>

                <h1 className="mt-2 text-3xl font-bold text-[#17251c]">
                    {title}
                </h1>

                <p className="mt-3 text-[#68766d]">
                    This module will be built in the next development stage.
                </p>

            </div>

        </div>
    )
}


export default App