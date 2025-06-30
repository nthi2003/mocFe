"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Package, ArrowLeft } from "lucide-react"
import { api } from "@/lib/axios"
import { useParams, useRouter } from "next/navigation"
import Header from "@/app/components/header"
import { Button } from "@/components/ui/button"



interface Material {
    id: string
    name: string

}

interface Inventory {
    id: string
    materialId: string
    quantity: number
    supplierId: string
    price: number
    material: Material
    importDate: string
    expiryDate: string
}

export default function InventoryList() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const [inventoryMarial, setInventoryMarial] = useState<Inventory[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchInventoryByMarialId();
    }, [params.id]);
    const fetchInventoryByMarialId = () => {
        setLoading(true);
        api.get(`/Inventory/marial/${params.id}`)
            .then((res) => {
                if (res.data.success) {
                    setInventoryMarial(res.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching marial:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }


    return (
        <div>
            <Header />
            <div className="flex">
                <div className="p-[30px] w-full">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2" /> Quay lại
                    </Button>
                    <Card className="mt-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Danh sách tồn kho
                            </CardTitle>
                            <CardDescription>Quản lý tồn kho theo từng lô hàng nhập</CardDescription>
                        </CardHeader>
                        <CardContent>


                            {inventoryMarial.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Không có dữ liệu tồn kho</p>
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="">Số lượng</TableHead>
                                                <TableHead className="text-center">Đơn giá</TableHead>
                                                <TableHead className="text-center">Ngày nhập</TableHead>
                                                <TableHead className="text-center">Hạn sử dụng</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {inventoryMarial.map((inventory) => (
                                                <TableRow key={inventory.id}>
                                                    <TableCell className="">{inventory.quantity}</TableCell>
                                                    <TableCell className="text-center font-medium">{inventory.price}</TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        {new Date(inventory.importDate).toLocaleDateString('vi-VN')}
                                                    </TableCell>
                                                    <TableCell className="text-center font-medium">
                                                        {new Date(inventory.expiryDate).toLocaleDateString('vi-VN')}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
