"use client";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { api } from '@/lib/axios';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    price: number;
    isPromotion: boolean;
    promotionEnd?: string;
    discountPercent?: number;
    image?: string;
}

interface Category {
    id: string;
    name: string;
}

interface MenuItemFormData {
    name: string;
    description: string;
    categoryId: string;
    price: string;
    isPromotion: string;
    promotionEnd: string;
    discountPercent: string;
    image: File | string;
}

function ImageUpload({ onFileChange }: { onFileChange: (file: File) => void }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onFileChange(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            onFileChange(droppedFile);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(droppedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={triggerFileInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {previewUrl ? (
                <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-md overflow-hidden mb-4 relative">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        Kéo thả hoặc click để chọn ảnh khác
                    </p>
                </div>
            ) : (
                <>
                    <p className="text-sm text-gray-500 mb-2">
                        Kéo thả hoặc click để chọn ảnh. Hỗ trợ JPG, PNG, GIF
                    </p>
                    <div className="border-t border-gray-200 my-4"></div>
                    <p className="text-lg font-medium text-gray-700">
                        Kéo thả ảnh vào đây
                    </p>
                    <p className="text-sm text-gray-500 mt-2">hoặc click để chọn file</p>
                </>
            )}
        </div>
    );
}

export default function MaterialListPage() {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<MenuItemFormData>({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        isPromotion: 'false',
        promotionEnd: '',
        discountPercent: '',
        image: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);

    useEffect(() => {
        fetchMenus();
        fetchCategories();
    }, []);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/MenuItems');

            if (response.data.success) {
                setMenu(response.data.data);
            } else {
                setError('Failed to load menu data');
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
            setError('Failed to connect to server');
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
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleFileChange = (file: File) => {
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleSelectChange = (field: keyof MenuItemFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const convertFormToFormData = (): globalThis.FormData => {
        const formDataObj = new FormData();
        formDataObj.append('Name', formData.name);
        formDataObj.append('CategoryId', formData.categoryId);
        formDataObj.append('Description', formData.description);
        formDataObj.append('Price', formData.price);
        formDataObj.append('IsPromotion', formData.isPromotion);

        if (formData.promotionEnd) {
            formDataObj.append('PromotionEnd', new Date(formData.promotionEnd).toISOString());
        }

        if (formData.discountPercent) {
            formDataObj.append('DiscountPercent', formData.discountPercent);
        }

        if (formData.image && typeof formData.image !== 'string') {
            formDataObj.append('Image', formData.image);
        }

        return formDataObj;
    };

    const handleAddMenu = async () => {
        try {
            setLoading(true);
            const formDataToSend = convertFormToFormData();

            const response = await api.post("/MenuItems/CreateMenuItem", formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                fetchMenus();
                setIsDialogOpen(false);
                resetForm();
            } else {
                setError(response.data.message || 'Failed to add menu item');
            }
        } catch (error) {
            console.error('Error adding menu:', error);
            setError('Error adding menu item');
        } finally {
            setLoading(false);
        }
    };

    const handleEditMenu = async () => {
        if (!currentMenuId) return;

        try {
            setLoading(true);
            const formDataToSend = convertFormToFormData();
            formDataToSend.append('Id', currentMenuId);

            const response = await api.put("/MenuItems/UpdateMenuItem", formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                fetchMenus();
                setIsDialogOpen(false);
                resetForm();
            } else {
                setError(response.data.message || 'Failed to update menu item');
            }
        } catch (error) {
            console.error('Error updating menu:', error);
            setError('Error updating menu item');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            categoryId: '',
            price: '',
            isPromotion: 'false',
            promotionEnd: '',
            discountPercent: '',
            image: '',
        });
        setIsEditMode(false);
        setCurrentMenuId(null);
    };

    const openEditDialog = (menu: MenuItem) => {
        setFormData({
            name: menu.name,
            description: menu.description,
            categoryId: menu.categoryId,
            price: menu.price.toString(),
            isPromotion: menu.isPromotion ? 'true' : 'false',
            promotionEnd: menu.promotionEnd?.split('T')[0] || '',
            discountPercent: menu.discountPercent?.toString() || '',
            image: menu.image || '',
        });
        setIsEditMode(true);
        setCurrentMenuId(menu.id);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (isEditMode) {
            handleEditMenu();
        } else {
            handleAddMenu();
        }
    };

    return (
        <div>
            <Header />
            <div className="flex">
                <Sidebar />
                <div className="p-[30px] w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Danh sách thực đơn</h2>
                        <Dialog open={isDialogOpen} onOpenChange={(open) => {
                            if (!open) resetForm();
                            setIsDialogOpen(open);
                        }}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="h-4 w-4" />
                                    Thêm mới
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{isEditMode ? 'Sửa thực đơn' : 'Tạo thực đơn'}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div>
                                        <Label htmlFor="name">Tên sản phẩm</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tên sản phẩm"
                                        />
                                    </div>
                                    <div>
                                        <Label>Loại</Label>
                                        <Select
                                            value={formData.categoryId}
                                            onValueChange={(v) => handleSelectChange('categoryId', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="price">Giá</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="Nhập giá...."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Mô tả</Label>
                                        <Input
                                            id="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Nhập mô tả"
                                        />
                                    </div>
                                    <div>
                                        <Label>Hình ảnh</Label>
                                        <ImageUpload onFileChange={handleFileChange} />
                                        {typeof formData.image === 'string' && formData.image && (
                                            <div className="mt-4 w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden relative">
                                                {formData.image.startsWith('data:') || formData.image.startsWith('blob:') ? (
                                                    <img
                                                        src={formData.image}
                                                        alt="preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={formData.image}
                                                        alt="preview"
                                                        fill
                                                        className="object-cover"
                                                        sizes="100px"
                                                        unoptimized={true}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Promotion</Label>
                                        <Select
                                            value={formData.isPromotion}
                                            onValueChange={(v) => handleSelectChange('isPromotion', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Có</SelectItem>
                                                <SelectItem value="false">Không</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {formData.isPromotion === 'true' && (
                                        <>
                                            <div>
                                                <Label htmlFor="promotionEnd">Ngày kết thúc giảm giá</Label>
                                                <Input
                                                    id="promotionEnd"
                                                    type="date"
                                                    value={formData.promotionEnd}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="discountPercent">Phần trăm (%)</Label>
                                                <Input
                                                    id="discountPercent"
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={formData.discountPercent}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập phần trăm"
                                                />
                                            </div>
                                        </>
                                    )}
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
                                                ? isEditMode ? 'Cập nhật...' : 'Thêm mới...'
                                                : isEditMode ? 'Cập nhật' : 'Thêm'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4">STT</th>
                                    <th className="text-left py-3 px-4">Tên sản phẩm</th>
                                    <th className="text-left py-3 px-4">Loại</th>
                                    <th className="text-left py-3 px-4">Giá</th>
                                    <th className="text-left py-3 px-4">Mô tả</th>
                                    <th className="text-left py-3 px-4">Hình ảnh</th>
                                    <th className="text-left py-3 px-4">Giảm giá</th>
                                    <th className="text-left py-3 px-4">Ngày kết thúc giảm giá</th>
                                    <th className="text-left py-3 px-4">Phần trăm</th>
                                    <th className="text-center py-3 px-4">Xử lí</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && menu.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-4">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : menu.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-4">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    menu.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">{index + 1}</td>
                                            <td className="py-3 px-4">{item.name}</td>
                                            <td className="py-3 px-4">
                                                {categories.find(c => c.id === item.categoryId)?.name || 'N/A'}
                                            </td>
                                            <td className="py-3 px-4">{item.price.toLocaleString()}</td>
                                            <td className="py-3 px-4 truncate max-w-xs">{item.description}</td>
                                            <td className="py-3 px-4">
                                                {item.image && (
                                                    <div className="w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden relative">
                                                        {item.image.startsWith('data:') || item.image.startsWith('blob:') ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="100px"
                                                                unoptimized={true}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">{item.isPromotion ? 'Có' : 'Không'}</td>
                                            <td className="py-3 px-4">
                                                {item.promotionEnd?.split('T')[0] || '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {item.discountPercent ? `${item.discountPercent}%` : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    onClick={() => openEditDialog(item)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
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
    );
}