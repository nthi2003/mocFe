import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";

export default function DiscountPage() {
    return (
        <div>
            <Header />
            <div className="flex">
                <Sidebar />
                <div className="p-[30px]">
                    3
                </div>
            </div>
        </div>
    )
}
