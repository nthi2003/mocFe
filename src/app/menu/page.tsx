'use client';

import Header from "@/app/components/header";
import { Sidebar } from "@/app/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "@/lib/axios";

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

        const response = await axios.get("/Category");
        setCategories(response.data.data);
      } catch  {
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

            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Thêm sản phẩm mới</span>
            </Button>
          </div>

          {loading ? (
            <div className="text-center">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : categories.length > 0 ? (
            <Tabs defaultValue={categories[0].name} className="space-y-4">
              <TabsList className="flex-wrap h-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.name}
                    className="data-[state=active]:bg-primary/10"
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
                  <div className="p-4 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                  </div>
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
