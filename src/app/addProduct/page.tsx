import { Sidebar } from "@/app/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default function AddProduct() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 min-w-5xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/menu">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
                    </div>
                    <div className="flex gap-2 ml-[100px]">
                        <Button variant="outline">Hủy</Button>
                        <Button>Lưu</Button>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-6">
                    <Tabs defaultValue="thong-tin" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="thong-tin">Thông tin sản phẩm</TabsTrigger>
                            <TabsTrigger value="gia-ban">Giá bán</TabsTrigger>
                            <TabsTrigger value="ton-kho">Tồn kho</TabsTrigger>
                        </TabsList>

                        <TabsContent value="thong-tin" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ten-san-pham">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                        <Input id="ten-san-pham" placeholder="Nhập tên sản phẩm" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ma-san-pham">Mã sản phẩm</Label>
                                        <Input id="ma-san-pham" placeholder="Nhập mã sản phẩm" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="loai-san-pham">
                                            Loại sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại sản phẩm" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="do-uong">Đồ uống</SelectItem>
                                                <SelectItem value="do-an">Đồ ăn</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="danh-muc">Danh mục</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn danh mục" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cafe">Cà phê</SelectItem>
                                                <SelectItem value="tra-sua">Trà sữa</SelectItem>
                                                <SelectItem value="banh-mi">Bánh mì</SelectItem>
                                                <SelectItem value="mon-an-nhe">Món ăn nhẹ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mo-ta">Mô tả</Label>
                                        <Textarea id="mo-ta" placeholder="Nhập mô tả sản phẩm" rows={4} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Hình ảnh sản phẩm</Label>
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Upload className="h-10 w-10 text-gray-400" />
                                                <p className="text-sm text-gray-500">Kéo thả hoặc nhấp để tải lên</p>
                                                <p className="text-xs text-gray-400">PNG, JPG (Tối đa 5MB)</p>
                                                <Button variant="outline" size="sm" className="mt-2">
                                                    Chọn tệp
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="trang-thai">Trạng thái</Label>
                                        <Select defaultValue="con-hang">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="con-hang">Còn hàng</SelectItem>
                                                <SelectItem value="het-hang">Hết hàng</SelectItem>
                                                <SelectItem value="ngung-kinh-doanh">Ngừng kinh doanh</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="gia-ban" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="gia-ban">
                                            Giá bán <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input id="gia-ban" type="number" placeholder="0" />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-gray-500">VNĐ</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gia-goc">Giá gốc</Label>
                                        <div className="relative">
                                            <Input id="gia-goc" type="number" placeholder="0" />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-gray-500">VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="ton-kho" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="so-luong">Số lượng tồn kho</Label>
                                        <Input id="so-luong" type="number" placeholder="0" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="don-vi">Đơn vị tính</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn đơn vị" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cai">Cái</SelectItem>
                                                <SelectItem value="ly">Ly</SelectItem>
                                                <SelectItem value="dia">Đĩa</SelectItem>
                                                <SelectItem value="phan">Phần</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
