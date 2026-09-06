import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#f8f8f3] text-[#17231c]">
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <div className="min-h-screen lg:pl-[236px]">
                <Topbar
                    onMenuClick={() => setMobileOpen(true)}
                />

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}