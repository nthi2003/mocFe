'use client'

import Header from "@/app/components/header"
import { Sidebar } from "@/app/components/sidebar"

export default function Home() {

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <Header
          title="Tổng quan"
          description="Xem tổng quan về hoạt động kinh doanh của cửa hàng"
        ></Header>
      </div>
    </main>
  )
}