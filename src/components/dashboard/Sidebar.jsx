import React from "react";
import logo from "../../assets/logo.png";
import { HiOutlineHome } from "react-icons/hi2";

export default function Sidebar({
    activeMenu,
    setActiveMenu,
    t,
    onGoLanding,
    menuItems = [],
    title = "", // Optional title like "Dashboard Admin"
    showBackToLanding = true, // New prop to control footer
}) {
    return (
        <aside className="w-[240px] bg-white p-4 shadow-lg border-r flex flex-col items-center flex-shrink-0 h-full">
            <img src={logo} alt="logo" className="w-24 mb-4 mt-2" />

            {title && (
                <span className="text-xs text-[#5FCAAC] font-medium tracking-wide mb-6">
                    {title}
                </span>
            )}

            {menuItems.map((item) => (
                <SidebarButton
                    key={item.key}
                    icon={item.icon}
                    text={item.label}
                    active={activeMenu === item.key}
                    onClick={() => setActiveMenu(item.key)}
                />
            ))}

            {showBackToLanding && (
                <div className="mt-auto w-full pt-3">
                    <div className="h-px bg-gray-100 mb-3" />
                    <SidebarButton
                        icon={HiOutlineHome}
                        text={t("dashboard.sidebar.backToLanding", {
                            defaultValue: "Kembali ke Beranda",
                        })}
                        active={false}
                        onClick={onGoLanding}
                        landing
                    />
                </div>
            )}
        </aside>
    );
}

export function SidebarButton({ icon: Icon, text, active, onClick, landing }) {
    return (
        <button
            onClick={onClick}
            className={[
                "group w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[14px] font-semibold transition mb-2",
                active
                    ? "bg-[#5CC9AF] text-white shadow-sm"
                    : landing
                        ? "text-emerald-700 hover:bg-emerald-50 border border-emerald-100"
                        : "text-gray-600 hover:bg-gray-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
            ].join(" ")}
        >
            <span
                className={[
                    "w-9 h-9 rounded-xl flex items-center justify-center border transition shrink-0",
                    active
                        ? "bg-white/20 border-white/20"
                        : landing
                            ? "bg-emerald-50 border-emerald-100"
                            : "bg-gray-50 border-gray-100 group-hover:bg-gray-100",
                ].join(" ")}
            >
                <Icon
                    size={18}
                    className={
                        active
                            ? "text-white"
                            : landing
                                ? "text-emerald-700"
                                : "text-gray-600"
                    }
                />
            </span>

            <span className="tracking-wide text-left">{text}</span>
        </button>
    );
}
