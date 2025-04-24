'use client';

import Header from "@/app/components/header";
import { Sidebar } from "@/app/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {api} from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

export default function Menu() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {

        const response = await api.get("/Category");
        setCategories(response.data.data);
      } catch {
        toast.error("Có lỗi không lấy được API");
        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex min-h-screen w-full flex-col">
        <Header
          title="Quản lý Menu"
          description="Quản lý danh sách sản phẩm và menu của cửa hàng"
        />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-[250px] lg:w-[300px] pl-8"
                />
              </div>
            </div>

           <Link href={"/addProduct"}>
           <Button className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Thêm sản phẩm mới</span>
            </Button>
           </Link>
          </div>

          {loading ? (
            <div className="text-center">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : categories.length > 0 ? (
            <Tabs defaultValue={categories[0].name} className="space-y-4">
              <TabsList className="flex-wrap h-auto">
                <TabsList>
                </TabsList>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.name}
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent
                  key={`content-${category.id}`}
                  value={category.name}
                  className="mt-4"
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Danh mục {category.name}</CardTitle>
                      <CardDescription>Quản lý các sản phẩm {category.name} trong menu</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="overflow-hidden">
                          <div className="aspect-video w-full overflow-hidden">
                           {/* <img src="" alt="" /> */}
                           2
                          </div>
                          <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">2</h3>
                            <p className="text-sm text-muted-foreground">3</p>
                          </div>
                          <div
                           
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                          >
                            Còn hàng
                          </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">Đồ ăn </p>
                          <div className="flex justify-between items-center">
                          <div className="font-medium">12312312</div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                ...
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                <span>Chỉnh sửa</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                                <Trash2 className="h-4 w-4" />
                                <span>Xóa</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Không có danh mục nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
