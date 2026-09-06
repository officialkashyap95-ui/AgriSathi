import {
    BarChart3,
    Factory,
    HelpCircle,
    LayoutDashboard,
    Leaf,
    Settings,
    Sprout,
    Store,
    Warehouse,
    Wheat,
    X,
} from "lucide-react"
import { NavLink } from "react-router-dom"

interface SidebarProps {
    mobileOpen: boolean
    onClose: () => void
}

const mainNavigation = [
    {
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "My Harvests",
        to: "/harvests",
        icon: Wheat,
    },
]

const operationNavigation = [
    {
        label: "Market",
        to: "/market",
        icon: Store,
    },
    {
        label: "Processors",
        to: "/processors",
        icon: Factory,
    },
    {
        label: "FPO",
        to: "/fpo",
        icon: Sprout,
    },
    {
        label: "Storage",
        to: "/storage",
        icon: Warehouse,
    },
]

export default function Sidebar({
    mobileOpen,
    onClose,
}: SidebarProps) {
    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex w-[236px] flex-col
                    border-r border-[#e3e7e1] bg-[#fbfcf9]
                    transition-transform duration-200
                    lg:translate-x-0
                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* Brand */}
                <div className="flex h-[76px] items-center justify-between px-6">
                    <NavLink
                        to="/dashboard"
                        onClick={onClose}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#075b2b] text-white">
                            <Leaf size={21} strokeWidth={2.2} />
                        </div>

                        <span className="text-[19px] font-bold tracking-[-0.02em] text-[#17251c]">
                            AgriSathi
                        </span>
                    </NavLink>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="rounded-lg p-2 text-[#69766e] hover:bg-[#eef2ed] lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-5">
                    {/* Main */}
                    <NavigationGroup
                        title="Main"
                        items={mainNavigation}
                        onNavigate={onClose}
                    />

                    {/* Primary action */}
                    <div className="mt-7">
                        <NavLink
                            to="/harvests/new"
                            onClick={onClose}
                            className="group flex items-center gap-3 rounded-xl bg-[#075b2b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064b24]" 
                            style={{color: "white"}}
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-lg" style={{color:"white"}}>
                                +
                            </span>

                            <span>Create Harvest Lot</span>
                        </NavLink>
                    </div>

                    {/* Operations */}
                    <div className="mt-8">
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a958d]">
                            Operations
                        </p>

                        <div className="space-y-1">
                            {operationNavigation.map((item) => {
                                const Icon = item.icon

                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `
                                            group flex items-center gap-3 rounded-xl
                                            px-3 py-2.5 text-[14px] font-medium
                                            transition
                                            ${
                                                isActive
                                                    ? "bg-[#e8efea] font-semibold text-[#075b2b]"
                                                    : "text-[#5d6b62] hover:bg-[#f0f3ef] hover:text-[#173a29]"
                                            }
                                            `
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon
                                                    size={18}
                                                    strokeWidth={
                                                        isActive ? 2.2 : 1.9
                                                    }
                                                />

                                                <span>{item.label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom navigation */}
                <div className="border-t border-[#e3e7e1] px-4 py-4">
                    <NavLink
                        to="/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `
                            flex items-center gap-3 rounded-xl px-3 py-2.5
                            text-[14px] font-medium transition
                            ${
                                isActive
                                    ? "bg-[#e8efea] font-semibold text-[#075b2b]"
                                    : "text-[#5d6b62] hover:bg-[#f0f3ef] hover:text-[#173a29]"
                            }
                            `
                        }
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </NavLink>

                    <button
                        type="button"
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#5d6b62] transition hover:bg-[#f0f3ef] hover:text-[#173a29]"
                    >
                        <HelpCircle size={18} />
                        <span>Help & Support</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

interface NavigationGroupProps {
    title: string
    items: {
        label: string
        to: string
        icon: typeof BarChart3
    }[]
    onNavigate: () => void
}

function NavigationGroup({
    title,
    items,
    onNavigate,
}: NavigationGroupProps) {
    return (
        <div className="mt-5">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a958d]">
                {title}
            </p>

            <div className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `
                                group flex items-center gap-3 rounded-xl
                                px-3 py-2.5 text-[14px] font-medium transition
                                ${
                                    isActive
                                        ? "bg-[#e8efea] font-semibold text-[#075b2b]"
                                        : "text-[#5d6b62] hover:bg-[#f0f3ef] hover:text-[#173a29]"
                                }
                                `
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={18}
                                        strokeWidth={isActive ? 2.2 : 1.9}
                                    />

                                    <span>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    )
                })}
            </div>
        </div>
    )
}