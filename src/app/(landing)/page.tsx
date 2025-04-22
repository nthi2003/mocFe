"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronRight, Clock, MapPin, Phone, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"

export default function Landing() {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
        <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/moc.png"
                            alt="Mộc"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="text-xl font-bold">Mộc - Thả Ga</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#menu" className="text-sm font-medium hover:text-primary">
                            Thực đơn
                        </Link>
                        <Link href="#about" className="text-sm font-medium hover:text-primary">
                            Giới thiệu
                        </Link>
                        <Link href="#gallery" className="text-sm font-medium hover:text-primary">
                            Hình ảnh
                        </Link>
                        <Link href="#contact" className="text-sm font-medium hover:text-primary">
                            Liên hệ
                        </Link>
                    </nav>
                    <Button>Đặt bàn</Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[70vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <video
                    src="/images/moc.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="object-cover w-full h-full"
                ></video>
                <div className="container relative z-20 flex flex-col items-center justify-center h-full text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Hương Vị Việt Nam Đích Thực</h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl">
                        Trải nghiệm ẩm thực Việt Nam truyền thống với những món ăn được chế biến từ nguyên liệu tươi ngon nhất
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                            Đặt món ngay
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                            Xem thực đơn
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Menu */}
            <section id="menu" className="py-16 bg-amber-50">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Món Ăn Đặc Sắc</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Khám phá những món ăn được yêu thích nhất tại nhà hàng chúng tôi, được chế biến bởi đầu bếp hàng đầu
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Phở Bò",
                                price: "85.000đ",
                                image: "/placeholder.svg?height=300&width=400",
                                desc: "Phở bò truyền thống với nước dùng đậm đà nấu trong 24 giờ",
                            },
                            {
                                name: "Bánh Mì Thịt",
                                price: "45.000đ",
                                image: "/placeholder.svg?height=300&width=400",
                                desc: "Bánh mì giòn với thịt heo quay, pate và rau thơm",
                            },
                            {
                                name: "Bún Chả",
                                price: "75.000đ",
                                image: "/placeholder.svg?height=300&width=400",
                                desc: "Bún chả Hà Nội với thịt nướng thơm lừng và nước mắm chua ngọt",
                            },
                            {
                                name: "Gỏi Cuốn",
                                price: "65.000đ",
                                image: "/placeholder.svg?height=300&width=400",
                                desc: "Gỏi cuốn tôm thịt tươi mát với nước chấm đặc biệt",
                            },
                            {
                                name: "Cơm Tấm",
                                price: "80.000đ",
                                image: "/placeholder.svg?height=300&width=400",
                                desc: "Cơm tấm sườn nướng với trứng ốp la và đồ chua",
                            },
                            {
                                name: "Chè Thái",
                                price: "35.000đ",
                                image: "/placeholder.svg?height=300&width=400",
                                desc: "Chè Thái ngọt mát với nhiều loại trái cây và sữa dừa",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-48">
                                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-semibold">{item.name}</h3>
                                        <span className="font-bold text-amber-600">{item.price}</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">{item.desc}</p>
                                    <Button variant="outline" className="w-full">
                                        Đặt món
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                            Xem toàn bộ thực đơn
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                            <Image
                                src="/placeholder.svg?height=800&width=600"
                                alt="Restaurant interior"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Về Nhà Hàng Chúng Tôi</h2>
                            <p className="text-muted-foreground mb-6">
                                Mộc được thành lập vào năm 2010 với mong muốn mang hương vị Việt Nam đích thực đến với thực
                                khách. Chúng tôi tự hào về nguồn nguyên liệu tươi ngon được lựa chọn kỹ lưỡng và công thức nấu ăn truyền
                                thống được truyền từ nhiều thế hệ.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-start gap-2">
                                    <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                                        <Star className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Chất Lượng</h4>
                                        <p className="text-sm text-muted-foreground">Nguyên liệu tươi ngon nhất</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Đội Ngũ</h4>
                                        <p className="text-sm text-muted-foreground">Đầu bếp chuyên nghiệp</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Phục Vụ</h4>
                                        <p className="text-sm text-muted-foreground">Nhanh chóng, chu đáo</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Không Gian</h4>
                                        <p className="text-sm text-muted-foreground">Thoáng đãng, sang trọng</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Tìm hiểu thêm</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-16 bg-amber-50">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Hình Ảnh Nhà Hàng</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Khám phá không gian và món ăn tại nhà hàng chúng tôi
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                <Image
                                    src={`/placeholder.svg?height=300&width=300&text=Gallery+${index + 1}`}
                                    alt={`Gallery image ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reservation Section */}
            <section id="contact" className="py-16">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Đặt Bàn</h2>
                            <p className="text-muted-foreground mb-8">
                                Hãy đặt bàn trước để có trải nghiệm tốt nhất tại nhà hàng chúng tôi. Chúng tôi sẽ liên hệ lại để xác
                                nhận đặt chỗ của bạn.
                            </p>

                            <form className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            Họ và tên
                                        </label>
                                        <Input id="name" placeholder="Nguyễn Văn A" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium">
                                            Số điện thoại
                                        </label>
                                        <Input id="phone" placeholder="0912 345 678" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="date" className="text-sm font-medium">
                                            Ngày
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                    {date ? format(date, "dd/MM/yyyy") : <span className="text-muted-foreground">Chọn ngày</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="time" className="text-sm font-medium">
                                            Giờ
                                        </label>
                                        <Input id="time" placeholder="19:00" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="guests" className="text-sm font-medium">
                                        Số khách
                                    </label>
                                    <Input id="guests" type="number" placeholder="4" min="1" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">
                                        Ghi chú
                                    </label>
                                    <Textarea id="message" placeholder="Yêu cầu đặc biệt..." />
                                </div>

                                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                                    Đặt bàn ngay
                                </Button>
                            </form>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Thông Tin Liên Hệ</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium">Địa chỉ</h4>
                                            <p className="text-muted-foreground">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium">Điện thoại</h4>
                                            <p className="text-muted-foreground">028 1234 5678</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium">Giờ mở cửa</h4>
                                            <p className="text-muted-foreground">Thứ 2 - Chủ nhật: 10:00 - 22:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-[300px] rounded-lg overflow-hidden">
                                <Image
                                    src="/placeholder.svg?height=600&width=800&text=Map"
                                    alt="Restaurant location map"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-amber-900 text-amber-50 py-12">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="logo"
                                    width={40}
                                    height={40}
                                    className="rounded-full bg-white"
                                />
                                <span className="text-xl font-bold">MỘC - thả ga</span>
                            </div>
                            <p className="text-amber-200 mb-4">
                                Trải nghiệm ẩm thực Việt Nam đích thực với những món ăn truyền thống được chế biến từ nguyên liệu tươi
                                ngon nhất.
                            </p>
                            <div className="flex gap-4">
                                <Link href="#" className="text-amber-200 hover:text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-facebook"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="text-amber-200 hover:text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-instagram"
                                    >
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                    </svg>
                                </Link>
                                <Link href="#" className="text-amber-200 hover:text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-twitter"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-amber-200 hover:text-white">
                                        Trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#menu" className="text-amber-200 hover:text-white">
                                        Thực đơn
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#about" className="text-amber-200 hover:text-white">
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#gallery" className="text-amber-200 hover:text-white">
                                        Hình ảnh
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#contact" className="text-amber-200 hover:text-white">
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Giờ mở cửa</h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between">
                                    <span className="text-amber-200">Thứ 2 - Thứ 6:</span>
                                    <span>10:00 - 22:00</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-amber-200">Thứ 7:</span>
                                    <span>09:00 - 23:00</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-amber-200">Chủ nhật:</span>
                                    <span>09:00 - 22:00</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-5 w-5 text-amber-400 mt-0.5" />
                                    <span>123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Phone className="h-5 w-5 text-amber-400 mt-0.5" />
                                    <span>028 1234 5678</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-amber-400 mt-0.5"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                    <span>info@nhahangviet.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200">
                        <p>© {new Date().getFullYear()} Nhà Hàng Việt. Tất cả các quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
