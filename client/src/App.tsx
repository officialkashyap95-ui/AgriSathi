import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import { useAuth } from "@clerk/clerk-react"

import AgriSathiLanding from "../components/landing/AgriSathiLanding"
import DashboardLayout from "../components/dashboard/DashboardLayout"

import Dashboard from "../pages/Dashboard"
import CreateHarvestLot from "../pages/CreateHarvestLot"
import Sampling from "../pages/Sampling"
import Analyzing from "../pages/Analyzing"
import AnalysisResults from "../pages/AnalysisResults"
import MyHarvests from "../pages/MyHarvests"
import HarvestDetails from "../pages/HarvestDetails"


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

          {/* -----------------------------------------
                        DASHBOARD
          ----------------------------------------- */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* -----------------------------------------
                        HARVESTS
          ----------------------------------------- */}

          <Route
            path="/harvests"
            element={
              <ProtectedRoute>
                <MyHarvests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/harvests/:id"
            element={
              <ProtectedRoute>
                <HarvestDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/harvests/new"
            element={
              <ProtectedRoute>
                <CreateHarvestLot />
              </ProtectedRoute>
            }
          />


          {/* -----------------------------------------
                        SAMPLING
          ----------------------------------------- */}

          <Route
            path="/harvests/new/sampling"
            element={
              <ProtectedRoute>
                <Sampling />
              </ProtectedRoute>
            }
          />

          <Route
            path="/harvests/:id/sampling"
            element={
              <ProtectedRoute>
                <Sampling />
              </ProtectedRoute>
            }
          />


          {/* -----------------------------------------
                    AI ANALYSIS
          ----------------------------------------- */}

          <Route
            path="/harvests/new/analyzing"
            element={
              <ProtectedRoute>
                <Analyzing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/harvests/:id/analyzing"
            element={
              <ProtectedRoute>
                <Analyzing />
              </ProtectedRoute>
            }
          />


          {/* -----------------------------------------
                    ANALYSIS RESULTS
          ----------------------------------------- */}

          <Route
            path="/harvests/:id/results"
            element={
              <ProtectedRoute>
                <AnalysisResults />
              </ProtectedRoute>
            }
          />


          {/* -----------------------------------------
                    FUTURE APPLICATION MODULES
          ----------------------------------------- */}

          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Market" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/processors"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Processors" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fpo"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="FPO" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/storage"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Storage" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Settings" />
              </ProtectedRoute>
            }
          />

        </Route>


        {/* =========================================
                    FALLBACK ROUTE
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
              PROTECTED ROUTE
========================================= */

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth()


  /*
   * Clerk is still initializing.
   *
   * Instead of showing a completely white
   * screen, display the application skeleton.
   */

  if (!isLoaded) {
    return <DashboardLoading />
  }


  /*
   * Clerk has finished loading but the
   * user is not authenticated.
   */

  if (!isSignedIn) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }


  /*
   * Authentication is ready.
   */

  return <>{children}</>
}


/* =========================================
            DASHBOARD LOADING UI
========================================= */

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">

      <div className="flex min-h-screen">

        {/* =====================================
                    SIDEBAR SKELETON
        ===================================== */}

        <aside className="hidden w-[236px] border-r border-[#e3e7e1] bg-[#fbfcf9] lg:block">

          <div className="flex h-[76px] items-center gap-3 px-6">

            <div className="h-10 w-10 animate-pulse rounded-xl bg-[#e3e7e1]" />

            <div className="h-5 w-24 animate-pulse rounded bg-[#e3e7e1]" />

          </div>


          <div className="space-y-3 px-4 pt-5">

            <div className="h-10 animate-pulse rounded-xl bg-[#eef2ed]" />

            <div className="h-10 animate-pulse rounded-xl bg-[#eef2ed]" />

            <div className="mt-6 h-10 animate-pulse rounded-xl bg-[#eef2ed]" />

            <div className="h-10 animate-pulse rounded-xl bg-[#eef2ed]" />

            <div className="h-10 animate-pulse rounded-xl bg-[#eef2ed]" />

          </div>

        </aside>


        {/* =====================================
                    MAIN AREA
        ===================================== */}

        <div className="flex-1">

          {/* Topbar skeleton */}

          <header className="h-[76px] border-b border-[#e3e7e1] bg-[#fbfcf9]">

            <div className="flex h-full items-center justify-between px-5 lg:px-8">

              <div className="h-5 w-28 animate-pulse rounded bg-[#e3e7e1]" />

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 animate-pulse rounded-full bg-[#e3e7e1]" />

                <div className="hidden space-y-2 md:block">

                  <div className="h-3 w-20 animate-pulse rounded bg-[#e3e7e1]" />

                  <div className="h-2.5 w-16 animate-pulse rounded bg-[#eef2ed]" />

                </div>

              </div>

            </div>

          </header>


          {/* Dashboard skeleton */}

          <main className="p-5 lg:p-8">

            <div className="mx-auto max-w-7xl">

              {/* Heading */}

              <div className="h-8 w-52 animate-pulse rounded bg-[#e3e7e1]" />

              <div className="mt-3 h-4 w-80 animate-pulse rounded bg-[#eef2ed]" />


              {/* Stats */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-2xl border border-[#e3e7e1] bg-white"
                  />
                ))}

              </div>


              {/* Main cards */}

              <div className="mt-6 grid gap-6 lg:grid-cols-3">

                <div className="h-72 animate-pulse rounded-2xl border border-[#e3e7e1] bg-white lg:col-span-2" />

                <div className="h-72 animate-pulse rounded-2xl border border-[#e3e7e1] bg-white" />

              </div>

            </div>

          </main>

        </div>

      </div>

    </div>
  )
}


/* =========================================
            TEMPORARY PLACEHOLDER
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