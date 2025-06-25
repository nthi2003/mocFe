'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/header';
import Sidebar from '@/app/components/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Table {
    id: string;
    name: string;
    capacity: number;
    location: string;
    type: string;
    status: number;
}

interface FormData {
    name: string;
    capacity: string;
    location: string;
    type: string;
    status: string;
}

export default function TableList() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        capacity: '',
        location: '',
        type: '',
        status: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentTableId, setCurrentTableId] = useState<string | null>(null);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Table');
            if (res.data.success) {
                setTables(res.data.data);
            } else {
                toast.error('Không thể tải dữ liệu bàn');
            }
        } catch {
            toast.error('Lỗi kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAddTable = async () => {
        try {
            setLoading(true);
            const response = await api.post("/Table/CreateTable", {
                name: formData.name,
                capacity: parseInt(formData.capacity),
                location: formData.location,
                type: formData.type,
                status: parseInt(formData.status)
            });

            if (response.data.success) {
                fetchTables();
                setIsDialogOpen(false);
                resetForm();
                toast.success('Thêm bàn thành công');
            } else {
                toast.error(response.data.message || 'Không thể thêm bàn');
            }
        } catch {
            toast.error('Lỗi khi thêm bàn');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTable = async () => {
        if (!currentTableId) return;

        try {
            setLoading(true);
            const response = await api.put(`/Table/UpdateTable/${currentTableId}`, {
                name: formData.name,
                capacity: parseInt(formData.capacity),
                location: formData.location,
                type: formData.type,
                status: parseInt(formData.status)
            });

            if (response.data.success) {
                fetchTables();
                setIsDialogOpen(false);
                resetForm();
                toast.success('Cập nhật bàn thành công');
            } else {
                toast.error(response.data.message || 'Không thể cập nhật bàn');
            }
        } catch {
            toast.error('Lỗi khi cập nhật bàn');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTable = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
            try {
                setLoading(true);
                const response = await api.delete(`/Table/DeleteTable/${id}`);

                if (response.data.success) {
                    fetchTables();
                    toast.success('Xóa bàn thành công');
                } else {
                    toast.error(response.data.message || 'Không thể xóa bàn');
                }
            } catch {
                toast.error('Lỗi khi xóa bàn');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            capacity: '',
            location: '',
            type: '',
            status: ''
        });
        setIsEditMode(false);
        setCurrentTableId(null);
    };

    const openEditDialog = (table: Table) => {
        setFormData({
            name: table.name,
            capacity: table.capacity.toString(),
            location: table.location,
            type: table.type,
            status: table.status.toString()
        });
        setIsEditMode(true);
        setCurrentTableId(table.id);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.capacity || !formData.location || !formData.type || !formData.status) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (isEditMode) {
            handleEditTable();
        } else {
            handleAddTable();
        }
    };

    const getStatusInfo = (status: number) => {
        switch (status) {
            case 1:
                return { text: 'Đang sử dụng', color: 'bg-green-100', textColor: 'text-green-700' };
            case 0:
                return { text: 'Ngừng sử dụng', color: 'bg-red-100', textColor: 'text-red-700' };
            default:
                return { text: 'Không xác định', color: 'bg-gray-100', textColor: 'text-gray-700' };
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
                            <h2 className="text-lg font-medium">Danh sách bàn</h2>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                if (!open) resetForm();
                                setIsDialogOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="h-4 w-4" />
                                        Thêm bàn mới
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{isEditMode ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div>
                                            <Label htmlFor="name">Tên bàn</Label>
                                            <Input
                                                id="name"
                                                placeholder="Nhập tên bàn..."
                                                className="mt-1"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                            <Label htmlFor="capacity">Số lượng ghế</Label>
                                            <Input
                                                id="capacity"
                                                placeholder="Nhập số lượng ghế..."
                                                className="mt-1"
                                                type="number"
                                                min="1"
                                                value={formData.capacity}
                                                onChange={handleInputChange}
                                            />
                                            <Label htmlFor="location">Vị trí</Label>
                                            <Input
                                                id="location"
                                                placeholder="Nhập vị trí..."
                                                className="mt-1"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                            />
                                            <Label htmlFor="type">Loại</Label>
                                            <Input
                                                id="type"
                                                placeholder="Loại bàn..."
                                                className="mt-1"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                            />
                                            <Label htmlFor="status">Trạng thái</Label>
                                            <Input
                                                id="status"
                                                placeholder="Nhập 1 (đang sử dụng) hoặc 0 (ngừng sử dụng)"
                                                className="mt-1"
                                                type="number"
                                                min="0"
                                                max="1"
                                                value={formData.status}
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
                                                        : 'Thêm bàn'}
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Tên bàn</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Số lượng ghế</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Vị trí</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Loại</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-600 w-32">Xử lí</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && tables.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4">
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : tables.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4">
                                                Không có bàn nào
                                            </td>
                                        </tr>
                                    ) : (
                                        tables.map((table, index) => {
                                            const statusInfo = getStatusInfo(table.status);
                                            return (
                                                <tr
                                                    key={table.id}
                                                    className="border-b last:border-b-0 hover:bg-gray-50"
                                                >
                                                    <td className="py-3 px-4">{index + 1}</td>
                                                    <td className="py-3 px-4">{table.name}</td>
                                                    <td className="py-3 px-4">{table.capacity}</td>
                                                    <td className="py-3 px-4">{table.location}</td>
                                                    <td className="py-3 px-4">{table.type}</td>
                                                    <td className={`py-3 px-4 ${statusInfo.textColor}`}>
                                                        <div className={`w-fit px-3 py-1 rounded-full ${statusInfo.color}`}>
                                                            {statusInfo.text}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                                onClick={() => openEditDialog(table)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                onClick={() => handleDeleteTable(table.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
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