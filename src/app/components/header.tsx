import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Bell, Calendar, Search, Settings } from "lucide-react"
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <Link href="/" className="text-xl font-semibold text-blue-600">moc</Link>
          </div>

          <Button variant="outline" size="sm" className="text-green-600 border-green-600">
            Cài đặt
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Tìm nhanh thứ..." className="pl-10 w-64" />
          </div>
        </div>

        <div className="flex items-center space-x-4">


          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Việc trong ngày</span>
            <Button variant="ghost" size="sm">
              <Calendar className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>TC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}