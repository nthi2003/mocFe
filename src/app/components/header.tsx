import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react"
interface HeaderProps {
    title : string,
    description: string;
}
export default function Header({title , description} : HeaderProps){
    return(
        <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Tìm kiếm..." className="w-[200px] lg:w-[300px] pl-8" />
            </div>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
      </div>
    )
}