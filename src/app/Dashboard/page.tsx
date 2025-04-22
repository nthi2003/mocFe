'use client'

import Header from "../components/header/LandingHeader"
import { Sidebar } from "../components/slider/sidebar"


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