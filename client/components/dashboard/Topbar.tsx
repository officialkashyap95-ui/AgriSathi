import { Bell, Menu } from "lucide-react"
import { UserButton, useUser } from "@clerk/clerk-react"

interface TopbarProps {
    onMenuClick: () => void
}

export default function Topbar({
    onMenuClick,
}: TopbarProps) {
    const { user } = useUser()

    const firstName =
        user?.firstName ||
        user?.username ||
        "Farmer"

    return (
        <header className="sticky top-0 z-30 h-[76px] border-b border-[#e3e7e1] bg-[#fbfcf9]/95 backdrop-blur">
            <div className="flex h-full items-center justify-between px-5 lg:px-8">
                {/* Left */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation"
                        className="rounded-xl p-2 text-[#4f5e55] hover:bg-[#eef2ed] lg:hidden"
                    >
                        <Menu size={21} />
                    </button>

                    <div>
                        <div className="hidden items-center gap-2 text-sm sm:flex">
                            <span className="text-[#829087]">
                                Home
                            </span>

                            <span className="text-[#a4ada6]">
                                /
                            </span>

                            <span className="font-semibold text-[#26372d]">
                                Dashboard
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-[#26372d] sm:hidden">
                            Dashboard
                        </p>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 sm:gap-5">
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative rounded-xl p-2 text-[#59685f] transition hover:bg-[#eef2ed]"
                    >
                        <Bell size={20} />

                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d86f35]" />
                    </button>

                    <div className="hidden h-7 w-px bg-[#dfe4df] sm:block" />

                    <div className="flex items-center gap-3">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-10 w-10",
                                },
                            }}
                        />

                        <div className="hidden leading-tight md:block">
                            <p className="text-sm font-semibold text-[#1d2d23]">
                                {user?.fullName || firstName}
                            </p>

                            <p className="mt-0.5 text-xs text-[#7a877f]">
                                Farmer account
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}