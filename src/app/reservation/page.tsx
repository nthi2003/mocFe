"use client"
import { useState, useEffect } from "react";
import Header from "@/app/components/header";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Table {
    id: string;
    name: string;
}

interface FormData {
    tableId: string;
    customerName: string;
    numberPeople: string;
    notes: string;
    dateTime: string;
    status: string;
}

interface Reservation {
    id: string;
    tableId: string;
    customerName: string;
    numberPeople: number;
    notes: string;
    dateTime: string;
    status: string;
}

export default function ReservationsListPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [tables, setTables] = useState<Table[]>([]);
    const [formData, setFormData] = useState<FormData>({
        tableId: '',
        customerName: '',
        numberPeople: '',
        notes: '',
        dateTime: '',
        status: '1',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentReservationId, setCurrentReservationId] = useState<string | null>(null);

    useEffect(() => {
        fetchTables();
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Reservations');
            if (res.data.success) {
                setReservations(res.data.data);
            } else {
                toast.error('Không thể tải dữ liệu đặt bàn');
            }
        } catch {
            toast.error('Lỗi kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    const fetchTables = async () => {
        try {
            const response = await api.get('/Table');
            if (response.data.success) {
                setTables(response.data.data);
            }
        } catch {
            toast.error('Không thể tải danh sách bàn');
        }
    };

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

    const handleAddReservation = async () => {
        try {
            setLoading(true);
            const response = await api.post("/Reservations/CreateReservations", {
                tableId: formData.tableId,
                customerName: formData.customerName,
                numberPeople: Number(formData.numberPeople),
                notes: formData.notes,
                dateTime: formData.dateTime,
                status: '1'
            });
            if (response.data.success) {
                fetchReservations();
                setIsDialogOpen(false);
                resetForm();
                toast.success('Đặt bàn thành công');
            }
        } catch {
            toast.error('Lỗi khi đặt bàn');
        } finally {
            setLoading(false);
        }
    };

    const handleEditReservation = async () => {
        if (!currentReservationId) return;
        try {
            setLoading(true);
            const response = await api.put(`/Reservations/UpdateReservations/${currentReservationId}`, {
                tableId: formData.tableId,
                customerName: formData.customerName,
                numberPeople: Number(formData.numberPeople),
                notes: formData.notes,
                dateTime: formData.dateTime,
                status: formData.status
            });
            if (response.data.success) {
                fetchReservations();
                setIsDialogOpen(false);
                resetForm();
                toast.success('Cập nhật đặt bàn thành công');
            } else {
                toast.error(response.data.message || 'Không thể cập nhật đặt bàn');
            }
        } catch {
            toast.error('Lỗi khi cập nhật đặt bàn');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReservation = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa đặt bàn này?')) {
            try {
                setLoading(true);
                const response = await api.delete(`/Reservations/DeleteReservations/${id}`);

                if (response.data.success) {
                    fetchReservations();
                    toast.success('Xóa đặt bàn thành công');
                } else {
                    toast.error(response.data.message || 'Không thể xóa đặt bàn');
                }
            } catch {
                toast.error('Lỗi khi xóa đặt bàn');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            tableId: '',
            customerName: '',
            numberPeople: '',
            notes: '',
            dateTime: '',
            status: '1',
        });
        setIsEditMode(false);
        setCurrentReservationId(null);
    };

    const openEditDialog = (reservation: Reservation) => {
        setFormData({
            tableId: reservation.tableId,
            customerName: reservation.customerName,
            numberPeople: reservation.numberPeople.toString(),
            notes: reservation.notes,
            dateTime: reservation.dateTime.split('T')[0],
            status: reservation.status,
        });
        setIsEditMode(true);
        setCurrentReservationId(reservation.id);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.tableId || !formData.customerName || !formData.numberPeople || !formData.dateTime) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        if (isEditMode) {
            handleEditReservation();
        } else {
            handleAddReservation();
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case '1':
                return { text: 'Đã đặt bàn', color: 'bg-green-100', textColor: 'text-green-700' };
            case '0':
                return { text: 'Hủy đặt bàn', color: 'bg-red-100', textColor: 'text-red-700' };
            case '2':
                return { text: 'Đã xác nhận', color: 'bg-purple-100', textColor: 'text-purple-700' };
            default:
                return { text: 'Không xác định', color: 'bg-gray-100', textColor: 'text-gray-700' };
        }
    };

    return (
        <div>
            <Header />
            <div className="flex">
                <div className="p-[30px] w-full">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Danh sách đặt bàn</h2>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                if (!open) resetForm();
                                setIsDialogOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="h-4 w-4" />
                                        Thêm đặt bàn
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{isEditMode ? 'Cập nhật đặt bàn' : 'Thêm đặt bàn'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label>Bàn</Label>
                                            <Select
                                                value={formData.tableId}
                                                onValueChange={(v) => handleSelectChange('tableId', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn bàn" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {tables.map((table) => (
                                                        <SelectItem key={table.id} value={table.id}>{table.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Label htmlFor="dateTime">Ngày đặt</Label>
                                            <Input
                                                id="dateTime"
                                                type="date"
                                                value={formData.dateTime}
                                                onChange={handleInputChange}
                                            />

                                            <Label htmlFor="customerName">Tên người đặt</Label>
                                            <Input
                                                id="customerName"
                                                placeholder="Nhập tên người đặt..."
                                                value={formData.customerName}
                                                onChange={handleInputChange}
                                            />

                                            <Label htmlFor="numberPeople">Số người</Label>
                                            <Input
                                                id="numberPeople"
                                                type="number"
                                                placeholder="Nhập số người..."
                                                value={formData.numberPeople}
                                                onChange={handleInputChange}
                                            />

                                            {isEditMode && (
                                                <>
                                                    <Label>Trạng thái</Label>
                                                    <Select
                                                        value={formData.status}
                                                        onValueChange={(v) => handleSelectChange('status', v)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="2">Đã xác nhận</SelectItem>
                                                            <SelectItem value="0">Đã hủy</SelectItem>
                                                            <SelectItem value="1">Hoàn thành</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </>
                                            )}

                                            <Label htmlFor="notes">Ghi chú</Label>
                                            <Input
                                                id="notes"
                                                placeholder="Nhập ghi chú..."
                                                value={formData.notes}
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
                                                        : 'Đặt bàn'}
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Bàn</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày đặt</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Tên người đặt</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Số người</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Ghi chú</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-600 w-32">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-4">
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-4">
                                                Không có đặt bàn nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        reservations.map((reservation, index) => {
                                            const statusInfo = getStatusInfo(reservation.status);
                                            return (
                                                <tr key={reservation.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                    <td className="py-3 px-4">{index + 1}</td>
                                                    <td className="py-3 px-4">
                                                        {tables.find(u => u.id === reservation.tableId)?.name || 'N/A'}
                                                    </td>
                                                    <td className="py-3 px-4">{reservation.dateTime.split('T')[0]}</td>
                                                    <td className="py-3 px-4">{reservation.customerName}</td>
                                                    <td className="py-3 px-4">{reservation.numberPeople} người</td>
                                                    <td className="py-3 px-4">{reservation.notes || '-'}</td>
                                                    <td className={`py-3 px-4 ${statusInfo.textColor}`}>
                                                        <div className={`w-fit px-3 py-1 rounded-full ${statusInfo.color}`}>
                                                            {statusInfo.text}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditDialog(reservation)}
                                                            >
                                                                <Edit className="h-4 w-4 text-blue-600" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteReservation(reservation.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
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