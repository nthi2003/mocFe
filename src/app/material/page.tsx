"use client"
import Header from "@/app/components/header";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from '@/lib/axios';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

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

interface Supplier {
    id: string;
    name: string;
}

interface Inventory {
    id: string;
    materialId: string;
    quantity: number;
    supplierId: string;
    price: number;
    importDate: string;
    expiryDate: string;
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
    const router = useRouter()
    const [materials, setMaterials] = useState<Material[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [materialQuantities, setMaterialQuantities] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);


    const [inventoryFormData, setInventoryFormData] = useState<InventoryFormData>({
        materialId: '',
        quantity: 0,
        supplierId: '',
        price: 0,
        importDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);

    useEffect(() => {
        fetchMaterials();
        fetchCategories();
        fetchUnits();
        fetchSuppliers();
        fetchInventories();
    }, []);

    useEffect(() => {

        const quantities: Record<string, number> = {};
        inventories.forEach(inv => {
            quantities[inv.materialId] = (quantities[inv.materialId] || 0) + inv.quantity;
        });
        setMaterialQuantities(quantities);
    }, [inventories]);

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

    const fetchInventories = async () => {
        try {
            const res = await api.get('/Inventory');
            if (res.data.success) {
                setInventories(res.data.data);
            }
        } catch {
            toast.error('Không thể tải dữ liệu tồn kho');
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
                fetchInventories();
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



    const openAddInventoryDialog = (material: Material) => {
        setInventoryFormData({
            ...inventoryFormData,
            materialId: material.id
        });
        setInventoryDialogOpen(true);
    };



    return (
        <div>
            <Header />
            <div className="flex">
                <div className="p-[30px] w-full">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2" /> Quay lại
                    </Button>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Danh sách nguyên liệu</h2>

                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 w-16">STT</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Tên nguyên liệu</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Danh mục</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Số lượng</th>
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
                                                <td className="py-3 px-4">
                                                    <Link href={`/material/${material.id}`} className="font-medium hover:underline">{material.name}</Link>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {categories.find(c => c.id === material.categoryId)?.name || 'N/A'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {materialQuantities[material.id] || 0} {units.find(u => u.id === material.unitId)?.name || 'N/A'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                            onClick={() => openAddInventoryDialog(material)}
                                                        >
                                                            <Plus className="h-4 w-4" />
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
                                    quantity: parseInt(e.target.value)
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
                                    price: parseInt(e.target.value)
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