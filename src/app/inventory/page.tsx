"use client"
import Header from "@/app/components/header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChartNoAxesColumn, Edit, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from '@/lib/axios'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { toast } from "sonner"

interface Inventory {
    id: string
    materialId: string
    quantity: number
    price: number
    supplierId: string
    importDate: string
    expiryDate: string
}

interface Supplier {
    id: string
    name: string
}

interface Material {
    id: string
    name: string
}

interface FormData {
    materialId: string
    quantity: string
    supplierId: string
    price: string
    importDate: string
    expiryDate: string
}

export default function InventoryListPage() {
    const [inventories, setInventories] = useState<Inventory[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [materials, setMaterials] = useState<Material[]>([])
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        materialId: '',
        quantity: '',
        supplierId: '',
        price: '',
        importDate: '',
        expiryDate: '',
    })

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [currentInventoryId, setCurrentInventoryId] = useState<string | null>(null)

    useEffect(() => {
        fetchInventory()
        fetchSuppliers()
        fetchMaterials()
    }, [])

    const fetchInventory = async () => {
        setLoading(true)
        try {
            const res = await api.get('/Inventory')
            if (res.data.success) {
                setInventories(res.data.data)
            } else {
                toast.error('Không thể tải dữ liệu kho nguyên liệu')
            }
        } catch {
            toast.error('Lỗi kết nối đến server')
        } finally {
            setLoading(false)
        }
    }

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/Suppliers')
            if (res.data.success) {
                setSuppliers(res.data.data)
            }
        } catch {
            toast.error('Lỗi khi tải danh sách nhà cung cấp')
        }
    }

    const fetchMaterials = async () => {
        try {
            const res = await api.get('/Material')
            if (res.data.success) {
                setMaterials(res.data.data)
            }
        } catch {
            toast.error('Lỗi khi tải danh sách nguyên liệu')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSelectChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAddInventory = async () => {
        try {
            setLoading(true)
            const response = await api.post("/Inventory/CreateInventory", {
                materialId: formData.materialId,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                supplierId: formData.supplierId,
                importDate: formData.importDate,
                expiryDate: formData.expiryDate
            })
            if (response.data.success) {
                fetchInventory()
                setIsDialogOpen(false)
                resetForm()
                toast.success('Thêm nguyên liệu thành công')
            }
        } catch {
            toast.error('Lỗi khi thêm nguyên liệu')
        } finally {
            setLoading(false)
        }
    }

    const handleEditInventory = async () => {
        if (!currentInventoryId) return
        try {
            setLoading(true)
            const response = await api.put(`/Inventory/UpdateInventory/${currentInventoryId}`, {
                materialId: formData.materialId,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                supplierId: formData.supplierId,
                importDate: formData.importDate,
                expiryDate: formData.expiryDate
            })
            if (response.data.success) {
                fetchInventory()
                setIsDialogOpen(false)
                resetForm()
                toast.success('Cập nhật nguyên liệu thành công')
            } else {
                toast.error(response.data.message || 'Không thể cập nhật nguyên liệu')
            }
        } catch {
            toast.error('Lỗi khi cập nhật nguyên liệu')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteInventory = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
            try {
                setLoading(true)
                const response = await api.delete(`/Inventory/DeleteInventory/${id}`)

                if (response.data.success) {
                    fetchInventory()
                    toast.success('Xóa nguyên liệu thành công')
                } else {
                    toast.error(response.data.message || 'Không thể xóa nguyên liệu')
                }
            } catch {
                toast.error('Lỗi khi xóa nguyên liệu')
            } finally {
                setLoading(false)
            }
        }
    }

    const resetForm = () => {
        setFormData({
            materialId: '',
            quantity: '',
            supplierId: '',
            price: '',
            importDate: '',
            expiryDate: '',
        })
        setIsEditMode(false)
        setCurrentInventoryId(null)
    }

    const openEditDialog = (inventory: Inventory) => {
        setFormData({
            materialId: inventory.materialId,
            quantity: inventory.quantity.toString(),
            price: inventory.price.toString(),
            supplierId: inventory.supplierId,
            importDate: inventory.importDate.split('T')[0],
            expiryDate: inventory.expiryDate.split('T')[0]
        })
        setIsEditMode(true)
        setCurrentInventoryId(inventory.id)
        setIsDialogOpen(true)
    }

    const handleSubmit = () => {
        if (isEditMode) {
            handleEditInventory()
        } else {
            handleAddInventory()
        }
    }

    const formatDate = (dateString: string) => {
        try {
            return dateString.split('T')[0]
        } catch {
            return dateString
        }
    }

    return (
        <div>
            <Header />
            <div className="flex">
                <div className="p-[30px] w-full">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex">
                                <h2 className="text-lg font-medium">Danh sách cập nhật kho</h2>
                                <div className="border-1 border-black ml-2 rounded-[5px]">
                                    <Link href="/inventory/statistical">
                                        <ChartNoAxesColumn />
                                    </Link>
                                </div>
                            </div>

                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                if (!open) resetForm()
                                setIsDialogOpen(open)
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="h-4 w-4" />
                                        Nhập kho
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{isEditMode ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu mới'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div>
                                            <Label>Nguyên liệu</Label>
                                            <Select
                                                value={formData.materialId}
                                                onValueChange={(value) => handleSelectChange('materialId', value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn nguyên liệu" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {materials.map((material) => (
                                                        <SelectItem key={material.id} value={material.id}>
                                                            {material.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Số lượng</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                placeholder="Nhập số lượng..."
                                                className="mt-1"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label>Giá</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                placeholder="Nhập giá tiền..."
                                                className="mt-1"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label>Nhà cung cấp</Label>
                                            <Select
                                                value={formData.supplierId}
                                                onValueChange={(value) => handleSelectChange('supplierId', value)}
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
                                            <Label htmlFor="importDate">Ngày nhập</Label>
                                            <Input
                                                id="importDate"
                                                type="date"
                                                className="mt-1"
                                                value={formData.importDate}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                                            <Input
                                                id="expiryDate"
                                                type="date"
                                                className="mt-1"
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                            />
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Số lượng</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Nhà cung cấp</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Giá</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày nhập</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày hết hạn</th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-600 w-32">Xử lí</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && inventories.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-4">
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : inventories.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-4">
                                                Không có nguyên liệu nào
                                            </td>
                                        </tr>
                                    ) : (
                                        inventories.map((inventory, index) => (
                                            <tr key={inventory.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4">{materials.find(u => u.id === inventory.materialId)?.name || 'N/A'}</td>
                                                <td className="py-3 px-4">{inventory.quantity}</td>
                                                <td className="py-3 px-4">
                                                    {suppliers.find(u => u.id === inventory.supplierId)?.name || 'N/A'}
                                                </td>
                                                <td className="py-3 px-4">{inventory.price}</td>
                                                <td className="py-3 px-4">{formatDate(inventory.importDate)}</td>
                                                <td className="py-3 px-4">{formatDate(inventory.expiryDate)}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                            onClick={() => openEditDialog(inventory)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            onClick={() => handleDeleteInventory(inventory.id)}
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