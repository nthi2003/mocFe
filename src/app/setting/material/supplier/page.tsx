"use client"

import { useState, useEffect } from "react";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Supplier {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    paymentTerms: string;
}

export default function SupplierListPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        paymentTerms: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = () => {
        setLoading(true);
        api.get('/Suppliers')
            .then((res) => {
                if (res.data.success) {
                    setSuppliers(res.data.data);
                }
            })
            .catch(() => {
                // Handle error silently or show a toast notification
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAddSupplier = async () => {
        try {
            setLoading(true);
            const response = await api.post("/Suppliers/CreateSuppliers", formData);
            if (response.data.success) {
                fetchSuppliers();
                setIsDialogOpen(false);
                resetForm();
            }
        }
        catch {
            // Handle error silently or show a toast notification
        } finally {
            setLoading(false);
        }
    }

    const handleEditSupplier = async () => {
        if (!currentSupplierId) return;
        try {
            setLoading(true);
            const response = await api.put(`/Suppliers/UpdateSuppliers/${currentSupplierId}`, formData);
            if (response.data.success) {
                fetchSuppliers();
                setIsDialogOpen(false);
                resetForm();
            }
        }
        catch {
            // Handle error silently or show a toast notification
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteSupplier = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
            try {
                setLoading(true);
                const response = await api.delete(`/Suppliers/DeleteSuppliers/${id}`);
                if (response.data.success) {
                    fetchSuppliers();
                }
            } catch {
                // Handle error silently or show a toast notification
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            paymentTerms: ''
        });
        setIsEditMode(false);
        setCurrentSupplierId(null);
    };

    const openEditDialog = (supplier: Supplier) => {
        setFormData({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address,
            paymentTerms: supplier.paymentTerms
        });
        setIsEditMode(true);
        setCurrentSupplierId(supplier.id);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (isEditMode) {
            handleEditSupplier();
        } else {
            handleAddSupplier();
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
                            <h2 className="text-lg font-medium">Danh sách nhà cung cấp</h2>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                if (!open) resetForm();
                                setIsDialogOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="h-4 w-4" />
                                        Thêm nhà cung cấp mới
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{isEditMode ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="name">Tên nhà cung cấp</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Nhập tên nhà cung cấp"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">Số điện thoại</Label>
                                                <Input
                                                    id="phone"
                                                    placeholder="Nhập số điện thoại"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    placeholder="Nhập Email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="address">Địa chỉ</Label>
                                                <Input
                                                    id="address"
                                                    placeholder="Nhập địa chỉ"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="paymentTerms">Hình thức thanh toán</Label>
                                                <Input
                                                    id="paymentTerms"
                                                    placeholder="Nhập hình thức thanh toán"
                                                    value={formData.paymentTerms}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
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
                                                        : 'Thêm nhà cung cấp'}
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Tên nhà cung cấp</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Số điện thoại</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Địa chỉ</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Hình thức thanh toán</th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-600 w-32">Xử lý</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && suppliers.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4">
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : suppliers.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4">
                                                Không có nhà cung cấp nào
                                            </td>
                                        </tr>
                                    ) : (
                                        suppliers.map((supplier, index) => (
                                            <tr key={supplier.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4">{supplier.name}</td>
                                                <td className="py-3 px-4">{supplier.phone}</td>
                                                <td className="py-3 px-4">{supplier.email}</td>
                                                <td className="py-3 px-4">{supplier.address}</td>
                                                <td className="py-3 px-4">{supplier.paymentTerms}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                            onClick={() => openEditDialog(supplier)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            onClick={() => handleDeleteSupplier(supplier.id)}
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