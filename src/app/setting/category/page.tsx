"use client"
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from '@/lib/axios';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Category {
    id: string;
    name: string;
}

export default function CategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        api.get('/Category')
            .then((res) => {
                if (res.data.success) {
                    setCategories(res.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                // TODO: Add toast notification
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAddCategory = async () => {
        try {
            setLoading(true);
            const response = await api.post("/Category/CreateCategory", {
                name: formData.name,
            });
            if (response.data.success) {
                fetchCategories();
                setIsDialogOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error("Error adding category:", error);
            // TODO: Add toast notification
        } finally {
            setLoading(false);
        }
    };

    const handleEditCategory = async () => {
        if (!currentCategoryId) return;
        try {
            setLoading(true);
            const response = await api.put(`/Category/UpdateCategory/${currentCategoryId}`, {
                name: formData.name
            });
            if (response.data.success) {
                fetchCategories();
                setIsDialogOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error("Error updating category:", error);
            // TODO: Add toast notification
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                setLoading(true);
                const response = await api.delete(`/Category/DeleteCategory/${id}`);
                if (response.data.success) {
                    fetchCategories();
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                // TODO: Add toast notification
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: ''
        });
        setIsEditMode(false);
        setCurrentCategoryId(null);
    };

    const openEditDialog = (category: Category) => {
        setFormData({
            name: category.name,
        });
        setIsEditMode(true);
        setCurrentCategoryId(category.id);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (isEditMode) {
            handleEditCategory();
        } else {
            handleAddCategory();
        }
    };

    return (
        <div>
            <Header />
            <div className="flex">
                <Sidebar />
                <div className="p-[30px] w-full">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Danh sách danh mục</h2>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                if (!open) resetForm();
                                setIsDialogOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="h-4 w-4" />
                                        Thêm danh mục mới
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{isEditMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div>
                                            <Label htmlFor="name">Tên danh mục</Label>
                                            <Input
                                                id="name"
                                                placeholder="Nhập tên danh mục..."
                                                className="mt-1"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsDialogOpen(false)}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={loading}
                                            >
                                                {loading
                                                    ? isEditMode
                                                        ? 'Đang cập nhật...'
                                                        : 'Đang thêm...'
                                                    : isEditMode
                                                        ? 'Cập nhật'
                                                        : 'Thêm danh mục'}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 w-16">STT</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Tên danh mục</th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-600 w-32">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4">
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4">
                                                Không có danh mục nào
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category, index) => (
                                            <tr key={category.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4">{category.name}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                            onClick={() => openEditDialog(category)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}