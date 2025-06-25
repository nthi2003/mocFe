"use client"

import {
    Search,

    ChevronDown,
    Settings,
    Calendar,
    Users,
    Handshake,
    Store,
    ShoppingCart,
    List,
    Gift,
    Clock,
    SquareMenu,
    Bean,
    Truck,
    Scroll,
    ChartColumn,
    Dice4,
    Dices,
    TicketPercent,
    Crown,
    MapPinPlus,
    Hash,

} from "lucide-react"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"


export default function Sidebar() {
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
        "Đối quà": true,
    })

    const toggleExpanded = (itemLabel: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [itemLabel]: !prev[itemLabel],
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Tìm nhanh tác..." className="pl-10" />
                        </div>
                    </div>
                    <nav className="p-2">
                        {/* Menu */}
                        <div>
                            <div
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-700"
                                onClick={() => toggleExpanded("Thực đơn")}
                            >
                                <div className="flex items-center space-x-3">
                                    <SquareMenu className="w-4 h-4" />
                                    <span>Thực đơn</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedItems["Thực đơn"] ? "rotate-180" : ""}`}
                                />
                            </div>

                            {expandedItems["Thực đơn"] && (
                                <div className="ml-6">
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Scroll className="w-4 h-4" />
                                        <Link href="/setting/menu/menulist">Danh sách món ăn</Link>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <TicketPercent className="w-4 h-4" />
                                        <Link href="/setting/menu/discount">Giảm giá</Link>
                                    </div>

                                </div>
                            )}
                        </div>
                        {/* Đối quà */}
                        <div>
                            <div
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-700"
                                onClick={() => toggleExpanded("Đối quà")}
                            >
                                <div className="flex items-center space-x-3">
                                    <Handshake className="w-4 h-4" />
                                    <span>Đối quà</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedItems["Đối quà"] ? "rotate-180" : ""}`}
                                />
                            </div>

                            {expandedItems["Đối quà"] && (
                                <div className="ml-6">
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Store className="w-4 h-4" />
                                        <span>Cửa hàng</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Đơn hàng</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <List className="w-4 h-4" />
                                        <span>Danh mục</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Gift className="w-4 h-4" />
                                        <span>Ưu đãi</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Nguyên liệu */}
                        <div>
                            <div
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-700"
                                onClick={() => toggleExpanded("Nguyên liệu")}
                            >
                                <div className="flex items-center space-x-3">
                                    <Bean className="w-4 h-4" />
                                    <span>Nguyên liệu</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedItems["Nguyên liệu"] ? "rotate-180" : ""}`}
                                />
                            </div>

                            {expandedItems["Nguyên liệu"] && (
                                <div className="ml-6">
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Scroll className="w-4 h-4" />
                                        <Link href="/setting/material/materiallist">Danh sách nguyên liệu</Link>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <ChartColumn className="w-4 h-4" />
                                        <span>Thông kê nguyên liệu</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Truck className="w-4 h-4" />
                                        <Link href="/setting/material/supplier">Nhà cung cấp</Link>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Hash className="w-4 h-4" />
                                        <Link href='/setting/material/unit'>Đơn vị</Link>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* Chấm công */}
                        <div>
                            <div
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-700"
                                onClick={() => toggleExpanded("Chấm công")}
                            >
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-4 h-4" />
                                    <span>Chấm công</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedItems["Chấm công"] ? "rotate-180" : ""}`}
                                />
                            </div>


                            {expandedItems["Chấm công"] && (
                                <div className="ml-6">
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>Báo cáo chấm công</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Lịch làm việc</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <MapPinPlus className="w-4 h-4" />
                                        <span>Vị trí chấm công</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Đơn nghỉ phép</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <div
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-700"
                                onClick={() => toggleExpanded("Bàn")}
                            >
                                <div className="flex items-center space-x-3">
                                    <Dice4 className="w-4 h-4" />
                                    <span>Bàn</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedItems["Bàn"] ? "rotate-180" : ""}`}
                                />
                            </div>


                            {expandedItems["Bàn"] && (
                                <div className="ml-6">
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Dices className="w-4 h-4" />
                                        <Link href="/setting/table/tablelist">Danh sách bàn</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Hồ sơ nhân sự */}
                        <div>
                            <div
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-700"
                                onClick={() => toggleExpanded("Hồ sơ nhân sự")}
                            >
                                <div className="flex items-center space-x-3">
                                    <Users className="w-4 h-4" />
                                    <span>Hồ sơ nhân sự</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedItems["Hồ sơ nhân sự"] ? "rotate-180" : ""}`}
                                />
                            </div>

                            {/* Sub-items for Hồ sơ nhân sự */}
                            {expandedItems["Hồ sơ nhân sự"] && (
                                <div className="ml-6">
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>Danh sách nhân viên</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Settings className="w-4 h-4" />
                                        <span>Cấu hình hồ sơ</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Settings className="w-4 h-4" />
                                        <span>Vị trí công việc</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Quản lí khách hàng*/}
                        <div>
                            <div
                                className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-700"
                                onClick={() => toggleExpanded("Hồ sơ khách hàng")}
                            >
                                <div className="flex items-center space-x-3">
                                    <Crown className="w-4 h-4" />
                                    <span>Hồ sơ khách hàng</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedItems["Hồ sơ khách hàng"] ? "rotate-180" : ""}`}
                                />
                            </div>
                            {expandedItems["Hồ sơ khách hàng"] && (
                                <div className="ml-6">
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>Danh sách khách hàng</span>
                                    </div>

                                </div>
                            )}
                        </div>
                    </nav>
                </aside>
                {/* <main className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">DANH MỤC CỬA HÀNG</h1>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm mới
                        </Button>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 bg-gray-50">
                            <div className="font-medium text-gray-700">Hình ảnh</div>
                            <div className="font-medium text-gray-700">Tên danh mục</div>
                            <div className="font-medium text-gray-700">Xử lý</div>
                        </div>
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Store className="w-8 h-8 text-gray-400" />
                            </div>
                            <p>Chưa có danh mục cửa hàng nào</p>
                            <p className="text-sm mt-1">Nhấn "Thêm mới" để tạo danh mục đầu tiên</p>
                        </div>
                    </div>
                </main> */}
            </div>
        </div>
    )
}
