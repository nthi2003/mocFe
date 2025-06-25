"use client"
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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
    inventories?: Inventory[];
}

interface Category {
    id: string;
    name: string;
}

interface Unit {
    id: string;
    name: string;
}

interface Supplier {
    id: string;
    name: string;
}

interface Inventory {
    id: string;
    quantity: number;
}

interface FormData {
    name: string;
    categoryId: string;
    unitId: string;
}

interface InventoryFormData {
    materialId: string;
    quantity: number;
    supplierId: string;
    price: number;
    importDate: string;
    expiryDate: string;
}

export default function MaterialListPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        categoryId: '',
        unitId: '',
    });

    const [inventoryFormData, setInventoryFormData] = useState<InventoryFormData>({
        materialId: '',
        quantity: 0,
        supplierId: '',
        price: 0,
        importDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);

    useEffect(() => {
        fetchMaterials();
        fetchCategories();
        fetchUnits();
        fetchSuppliers();
    }, []);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Material');
            if (res.data.success) {
                setMaterials(res.data.data);
            } else {
                toast.error('Không thể tải dữ liệu nguyên liệu');
            }
        } catch {
            toast.error('Lỗi kết nối đến server');
        } finally {
            setLoading(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await api.get('/Category');
            if (res.data.success) {
                setCategories(res.data.data);
            }
        } catch {
            toast.error('Không thể tải danh mục');
        }
    }

    const fetchUnits = async () => {
        try {
            const res = await api.get('/Unit');
            if (res.data.success) {
                setUnits(res.data.data);
            }
        } catch {
            toast.error('Không thể tải đơn vị');
        }
    }

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/Suppliers');
            if (res.data.success) {
                setSuppliers(res.data.data);
            }
        } catch {
            toast.error('Không thể tải nhà cung cấp');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddMaterial = async () => {
        try {
            setLoading(true);
            const response = await api.post("/Material/CreateMaterial", {
                name: formData.name,
                categoryId: formData.categoryId,
                unitId: formData.unitId,
            });
            if (response.data.success) {
                fetchMaterials();
                setIsDialogOpen(false);
                resetForm();
                toast.success('Thêm nguyên liệu thành công');
            }
        } catch {
            toast.error('Lỗi khi thêm nguyên liệu');
        } finally {
            setLoading(false);
        }
    }

    const handleEditMaterial = async () => {
        if (!currentMaterialId) return;
        try {
            setLoading(true);
            const response = await api.put(`/Material/UpdateMaterial/${currentMaterialId}`, {
                name: formData.name,
                categoryId: formData.categoryId,
                unitId: formData.unitId,
            });
            if (response.data.success) {
                fetchMaterials();
                setIsDialogOpen(false);
                resetForm();
                toast.success('Cập nhật nguyên liệu thành công');
            } else {
                toast.error(response.data.message || 'Không thể cập nhật nguyên liệu');
            }
        } catch {
            toast.error('Lỗi khi cập nhật nguyên liệu');
        } finally {
            setLoading(false);
        }
    }

    const handleAddInventory = async () => {
        try {
            setLoading(true);
            const response = await api.post("/Inventory/CreateInventory", {
                materialId: inventoryFormData.materialId,
                quantity: inventoryFormData.quantity,
                supplierId: inventoryFormData.supplierId,
                price: inventoryFormData.price,
                importDate: inventoryFormData.importDate,
                expiryDate: inventoryFormData.expiryDate
            });
            if (response.data.success) {
                fetchMaterials();
                setInventoryDialogOpen(false);
                setInventoryFormData({
                    materialId: '',
                    quantity: 0,
                    supplierId: '',
                    price: 0,
                    importDate: new Date().toISOString().split('T')[0],
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                });
                toast.success('Thêm số lượng nguyên liệu thành công');
            }
        } catch {
            toast.error('Lỗi khi thêm số lượng nguyên liệu');
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteMaterial = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
            try {
                setLoading(true);
                const response = await api.delete(`/Material/DeleteMaterial/${id}`);

                if (response.data.success) {
                    fetchMaterials();
                    toast.success('Xóa nguyên liệu thành công');
                } else {
                    toast.error(response.data.message || 'Không thể xóa nguyên liệu');
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

    const openAddInventoryDialog = (material: Material) => {
        setInventoryFormData({
            ...inventoryFormData,
            materialId: material.id
        });
        setInventoryDialogOpen(true);
    };

    const handleSubmit = () => {
        if (isEditMode) {
            handleEditMaterial();
        } else {
            handleAddMaterial();
        }
    };

    const calculateTotalQuantity = (material: Material) => {
        if (material.inventories && material.inventories.length > 0) {
            return material.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
        }
        return 0;
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Số lượng</th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-600 w-32">Xử lí</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && materials.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : materials.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
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
                                                    {calculateTotalQuantity(material)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                            onClick={() => openAddInventoryDialog(material)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                                            onClick={() => openEditDialog(material)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            onClick={() => handleDeleteMaterial(material.id)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                                            </svg>
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

            {/* Dialog thêm inventory */}
            <Dialog open={inventoryDialogOpen} onOpenChange={setInventoryDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm số lượng nguyên liệu</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div>
                            <Label>Số lượng</Label>
                            <Input
                                type="number"
                                placeholder="Nhập số lượng..."
                                className="mt-1"
                                value={inventoryFormData.quantity}
                                onChange={(e) => setInventoryFormData({
                                    ...inventoryFormData,
                                    quantity: parseInt(e.target.value) || 0
                                })}
                            />
                        </div>

                        <div>
                            <Label>Nhà cung cấp</Label>
                            <Select
                                value={inventoryFormData.supplierId}
                                onValueChange={(value) => setInventoryFormData({
                                    ...inventoryFormData,
                                    supplierId: value
                                })}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Chọn nhà cung cấp" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((supplier) => (
                                        <SelectItem key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Giá</Label>
                            <Input
                                type="number"
                                placeholder="Nhập giá..."
                                className="mt-1"
                                value={inventoryFormData.price}
                                onChange={(e) => setInventoryFormData({
                                    ...inventoryFormData,
                                    price: parseInt(e.target.value) || 0
                                })}
                            />
                        </div>

                        <div>
                            <Label>Ngày nhập</Label>
                            <Input
                                type="date"
                                className="mt-1"
                                value={inventoryFormData.importDate}
                                onChange={(e) => setInventoryFormData({
                                    ...inventoryFormData,
                                    importDate: e.target.value
                                })}
                            />
                        </div>

                        <div>
                            <Label>Hạn sử dụng</Label>
                            <Input
                                type="date"
                                className="mt-1"
                                value={inventoryFormData.expiryDate}
                                onChange={(e) => setInventoryFormData({
                                    ...inventoryFormData,
                                    expiryDate: e.target.value
                                })}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setInventoryDialogOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleAddInventory}
                                disabled={loading}
                            >
                                {loading ? 'Đang thêm...' : 'Thêm số lượng'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}