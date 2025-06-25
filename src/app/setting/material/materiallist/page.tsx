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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Material {
    id: string;
    name: string;
    categoryId: string;
    unitId: string;
}

interface Category {
    id: string;
    name: string;
}

interface Unit {
    id: string;
    name: string;
}

export default function MaterialListPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        unitId: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);

    useEffect(() => {
        fetchMaterials();
        fetchCategories();
        fetchUnits();
    }, []);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Material');
            if (response.data.success) {
                setMaterials(response.data.data);
            }
        } catch {
            toast.error('Lỗi khi tải danh sách nguyên liệu');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/Category');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch {
            toast.error('Lỗi khi tải danh mục');
        }
    };

    const fetchUnits = async () => {
        try {
            const response = await api.get('/Unit');
            if (response.data.success) {
                setUnits(response.data.data);
            }
        } catch {
            toast.error('Lỗi khi tải đơn vị tính');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddMaterial = async () => {
        try {
            setLoading(true);
            const response = await api.post("/Material/CreateMaterial", formData);
            if (response.data.success) {
                toast.success('Thêm nguyên liệu thành công');
                fetchMaterials();
                setIsDialogOpen(false);
                resetForm();
            }
        } catch {
            toast.error('Lỗi khi thêm nguyên liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleEditMaterial = async () => {
        if (!currentMaterialId) return;
        try {
            setLoading(true);
            const response = await api.put(`/Material/UpdateMaterial/${currentMaterialId}`, formData);
            if (response.data.success) {
                toast.success('Cập nhật nguyên liệu thành công');
                fetchMaterials();
                setIsDialogOpen(false);
                resetForm();
            }
        } catch {
            toast.error('Lỗi khi cập nhật nguyên liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMaterial = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
            try {
                setLoading(true);
                const response = await api.delete(`/Material/DeleteMaterial/${id}`);
                if (response.data.success) {
                    toast.success('Xóa nguyên liệu thành công');
                    fetchMaterials();
                }
            } catch {
                toast.error('Lỗi khi xóa nguyên liệu');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            categoryId: '',
            unitId: '',
        });
        setIsEditMode(false);
        setCurrentMaterialId(null);
    };

    const openEditDialog = (material: Material) => {
        setFormData({
            name: material.name,
            categoryId: material.categoryId,
            unitId: material.unitId,
        });
        setIsEditMode(true);
        setCurrentMaterialId(material.id);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (isEditMode) {
            handleEditMaterial();
        } else {
            handleAddMaterial();
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
                            <h2 className="text-lg font-medium">Danh sách nguyên liệu</h2>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                if (!open) resetForm();
                                setIsDialogOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="h-4 w-4" />
                                        Thêm nguyên liệu mới
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{isEditMode ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu mới'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div>
                                            <Label htmlFor="name">Tên nguyên liệu</Label>
                                            <Input
                                                id="name"
                                                placeholder="Nhập tên nguyên liệu..."
                                                className="mt-1"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <Label>Danh mục</Label>
                                            <Select
                                                value={formData.categoryId}
                                                onValueChange={(value) => handleSelectChange('categoryId', value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Đơn vị</Label>
                                            <Select
                                                value={formData.unitId}
                                                onValueChange={(value) => handleSelectChange('unitId', value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn đơn vị" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {units.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id}>
                                                            {unit.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-4">
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
                                                        : 'Thêm nguyên liệu'}
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Tên nguyên liệu</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Danh mục</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Đơn vị</th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-600 w-32">Xử lí</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && materials.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : materials.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">
                                                Không có nguyên liệu nào
                                            </td>
                                        </tr>
                                    ) : (
                                        materials.map((material, index) => (
                                            <tr key={material.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4">{material.name}</td>
                                                <td className="py-3 px-4">
                                                    {categories.find(c => c.id === material.categoryId)?.name || 'N/A'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {units.find(u => u.id === material.unitId)?.name || 'N/A'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                            onClick={() => openEditDialog(material)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            onClick={() => handleDeleteMaterial(material.id)}
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
    )
}