"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3,
    Coffee,
    CreditCard,
    Home,
    Package,
    Settings,
    ShoppingCart,
    Users,
    Utensils,
    LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
const routes = [
    {
        label: "Tổng quan",
        icon: Home,
        href: "/Dashboard",
        color: "text-sky-500",
    },
    {
        label: "Đơn hàng",
        icon: ShoppingCart,
        href: "/orders",
        color: "text-violet-500",
    },
    {
        label: "Menu",
        icon: Coffee,
        href: "/menu",
        color: "text-pink-700",
    },
    {
        label: "Kho hàng",
        icon: Package,
        href: "/inventory",
        color: "text-orange-500",
    },
    {
        label: "Nhân viên",
        icon: Users,
        href: "/staff",
        color: "text-emerald-500",
    },
    {
        label: "Khách hàng",
        icon: Users,
        href: "/customers",
        color: "text-blue-500",
    },
    {
        label: "Nhà cung cấp",
        icon: Utensils,
        href: "/suppliers",
        color: "text-rose-500",
    },
    {
        label: "Báo cáo",
        icon: BarChart3,
        href: "/reports",
        color: "text-yellow-500",
    },
    {
        label: "Thanh toán",
        icon: CreditCard,
        href: "/payments",
        color: "text-green-500",
    },
    {
        label: "Cài đặt",
        icon: Settings,
        href: "/settings",
        color: "text-gray-500",
    },
]
export function Sidebar() {
    const pathname = usePathname()
    return (
        <div className="flex flex-col max-h-[1200px] space-y-4 py-4 bg-slate-50 border-r w-64">
            <div className="px-3 py-2">
                <Link href="/" className="flex items-center pl-3 mb-6">
                    <div className="relative w-8 h-8 mr-2">
                        <Coffee className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold">F&B Manager</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center py-3 px-3 rounded-lg text-sm group hover:bg-slate-100",
                                pathname === route.href ? "bg-slate-100" : "transparent",
                            )}
                        >
                            <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                            {route.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}  