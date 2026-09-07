import { Navigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({
    children,
}: ProtectedRouteProps) {
    const { isLoaded, isSignedIn } = useAuth()

    if (!isLoaded) {
        return <DashboardLoading />
    }

    if (!isSignedIn) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#f8f8f3]">
            <div className="flex min-h-screen">

                <aside className="hidden w-[236px] border-r border-[#e3e7e1] bg-[#fbfcf9] lg:block">
                    <div className="flex h-[76px] items-center gap-3 px-6">
                        <div className="h-10 w-10 animate-pulse rounded-xl bg-[#e3e7e1]" />
                        <div className="h-5 w-24 animate-pulse rounded bg-[#e3e7e1]" />
                    </div>

                    <div className="space-y-3 px-4 pt-5">
                        <div className="h-10 animate-pulse rounded-xl bg-[#eef2ed]" />
                        <div className="h-10 animate-pulse rounded-xl bg-[#eef2ed]" />
                        <div className="h-10 animate-pulse rounded-xl bg-[#eef2ed]" />
                        <div className="h-10 animate-pulse rounded-xl bg-[#eef2ed]" />
                    </div>
                </aside>

                <div className="flex-1">
                    <header className="h-[76px] border-b border-[#e3e7e1] bg-[#fbfcf9]">
                        <div className="flex h-full items-center justify-between px-5 lg:px-8">
                            <div className="h-5 w-28 animate-pulse rounded bg-[#e3e7e1]" />

                            <div className="h-10 w-10 animate-pulse rounded-full bg-[#e3e7e1]" />
                        </div>
                    </header>

                    <main className="p-5 lg:p-8">
                        <div className="mx-auto max-w-7xl">

                            <div className="h-8 w-52 animate-pulse rounded bg-[#e3e7e1]" />

                            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-[#eef2ed]" />

                            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="h-32 animate-pulse rounded-2xl border border-[#e3e7e1] bg-white"
                                    />
                                ))}
                            </div>

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