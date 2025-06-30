"use client"

import Header from "@/app/components/header"
import { CheckCircle2, Clock, Calendar, Contact, Timer, Settings, HandPlatter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra token khi component được mount
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
      if (!token) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }

    // Chỉ chạy kiểm tra trên client side
    if (typeof window !== 'undefined') {
      checkAuth()
    }
  }, [router])

  const handleNavigation = (path: string) => {
    router.push(path)
  }


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Header />
      <div className="mx-auto max-w-3xl mt-3">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-black-800 animate-slide-down">
            Chúc bạn một ngày làm việc hiệu quả
          </h1>
          <div className="mx-auto h-1 w-20 rounded-full animate-expand"></div>
        </div>

        <div className="mb-2">
          <h3 className="mb-4 text-xl font-semibold text-amber-700 border-b border-amber-100 pb-2">Công việc</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
            <button
              onClick={() => handleNavigation("/order")}
              className="cursor-pointer animate-slide-up focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-xl"
              style={{ animationDelay: "0ms" }}
            >
              <div className="flex flex-col items-center space-y-2 rounded-xl p-3 hover:bg-amber-50 transition-colors duration-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-amber-600 transition-all duration-300 hover:bg-amber-200 hover:shadow-md hover:scale-110 hover:-translate-y-1 hover:rotate-6">
                  <HandPlatter className="h-4 w-4" />
                </div>
                <span className="text-center text-sm font-medium text-amber-800">Đặt món</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigation("/donhang")}
              className="cursor-pointer animate-slide-up focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-xl"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex flex-col items-center space-y-2 rounded-xl p-3 hover:bg-amber-50 transition-colors duration-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-amber-600 transition-all duration-300 hover:bg-amber-200 hover:shadow-md hover:scale-110 hover:-translate-y-1 hover:rotate-6">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-center text-sm font-medium text-amber-800">Đơn hàng</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigation("/reservation")}
              className="cursor-pointer animate-slide-up focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-xl"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex flex-col items-center space-y-2 rounded-xl p-3 hover:bg-amber-50 transition-colors duration-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-amber-600 transition-all duration-300 hover:bg-amber-200 hover:shadow-md hover:scale-110 hover:-translate-y-1 hover:rotate-6">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-center text-sm font-medium text-amber-800">Đặt bàn</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigation("/material")}
              className="cursor-pointer animate-slide-up focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-xl"
              style={{ animationDelay: "300ms" }}
            >
              <div className="flex flex-col items-center space-y-2 rounded-xl p-3 hover:bg-amber-50 transition-colors duration-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-amber-600 transition-all duration-300 hover:bg-amber-200 hover:shadow-md hover:scale-110 hover:-translate-y-1 hover:rotate-6">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-center text-sm font-medium text-amber-800">Nguyên liệu</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigation("/nhanvien")}
              className="cursor-pointer animate-slide-up focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-xl"
              style={{ animationDelay: "400ms" }}
            >
              <div className="flex flex-col items-center space-y-2 rounded-xl p-3 hover:bg-amber-50 transition-colors duration-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-amber-600 transition-all duration-300 hover:bg-amber-200 hover:shadow-md hover:scale-110 hover:-translate-y-1 hover:rotate-6">
                  <Contact className="h-4 w-4" />
                </div>
                <span className="text-center text-sm font-medium text-amber-800">Nhân viên</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="mb-4 text-xl font-semibold text-blue-500 border-b border-blue-100 pb-2">Bổ trợ</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
            <button
              onClick={() => handleNavigation("/chamcong")}
              className="cursor-pointer animate-slide-up focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-xl"
              style={{ animationDelay: "0ms" }}
            >
              <div className="flex flex-col items-center space-y-2 rounded-xl p-3 hover:bg-blue-50 transition-colors duration-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 text-blue-600 transition-all duration-300 hover:bg-blue-200 hover:shadow-md hover:scale-110 hover:-translate-y-1 hover:rotate-6">
                  <Timer className="h-4 w-4" />
                </div>
                <span className="text-center text-sm font-medium text-blue-800">Chấm công</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="mb-4 text-xl font-semibold text-green-300 border-b border-green-200 pb-2">Tiện ích</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
            <button
              onClick={() => handleNavigation("/setting/menu/menulist")}
              className="cursor-pointer animate-slide-up focus:outline-none focus:ring-2 focus:ring-green-300 rounded-xl"
              style={{ animationDelay: "0ms" }}
            >
              <div className="flex flex-col items-center space-y-2 rounded-xl p-3 hover:bg-green-50 transition-colors duration-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-200 bg-green-100 text-green-600 transition-all duration-300 hover:bg-green-200 hover:shadow-md hover:scale-110 hover:-translate-y-1 hover:rotate-6">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="text-center text-sm font-medium text-green-800">Cài đặt</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}