"use client"
import React, { useEffect, useState } from "react"
import { Plus, Settings, Users, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import Sidebar from "@/app/components/sidebar"
import { api } from "@/lib/axios"
import Link from "next/link"
import Header from "@/app/components/header"

interface Feature {
    id: string
    name: string
    createdBy: string
    createdOn: string
    modifiedBy?: string
    modifiedOn?: string
}

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    userName: string
}

export default function FeatureManagement() {

    const [features, setFeatures] = useState<Feature[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState({
        features: false,
        users: false,
        actions: false
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [dialogState, setDialogState] = useState({
        create: false,
        edit: false,
        delete: false
    })
    const [currentFeature, setCurrentFeature] = useState<Feature | null>(null)
    const [formData, setFormData] = useState({ name: '' })

    useEffect(() => {
        fetchFeatures()
        fetchUsers()
    }, [])

    const fetchFeatures = async () => {
        setLoading(prev => ({ ...prev, features: true }))
        try {
            const response = await api.get('/Feature')
            if (response.data.success) {
                setFeatures(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching features:', error)
        } finally {
            setLoading(prev => ({ ...prev, features: false }))
        }
    }

    const fetchUsers = async () => {
        setLoading(prev => ({ ...prev, users: true }))
        try {
            const response = await api.get('/Users')
            if (response.data.success) {
                setUsers(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(prev => ({ ...prev, users: false }))
        }
    }

    const handleCreateFeature = async () => {
        setLoading(prev => ({ ...prev, actions: true }))
        try {
            const response = await api.post('/Feature/CreateFeature', formData)
            if (response.data.success) {
                await fetchFeatures()
                setDialogState({ ...dialogState, create: false })
                setFormData({ name: '' })
            }
        } catch (error) {
            console.error('Error creating feature:', error)
        } finally {
            setLoading(prev => ({ ...prev, actions: false }))
        }
    }

    const handleUpdateFeature = async () => {
        if (!currentFeature) return
        setLoading(prev => ({ ...prev, actions: true }))
        try {
            const response = await api.put(`/Feature/UpdateFeature/${currentFeature.id}`, formData)
            if (response.data.success) {
                await fetchFeatures()
                setDialogState({ ...dialogState, edit: false })
                setCurrentFeature(null)
                setFormData({ name: '' })
            }
        } catch (error) {
            console.error('Error updating feature:', error)
        } finally {
            setLoading(prev => ({ ...prev, actions: false }))
        }
    }

    const handleDeleteFeature = async (id: string) => {
        setLoading(prev => ({ ...prev, actions: true }))
        try {
            const response = await api.delete(`/Feature/DeleteFeature/${id}`)
            if (response.data.success) {
                await fetchFeatures()
                setDialogState({ ...dialogState, delete: false })
            }
        } catch (error) {
            console.error('Error deleting feature:', error)
        } finally {
            setLoading(prev => ({ ...prev, actions: false }))
        }
    }


    const filteredFeatures = features.filter(feature =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredUsers = users.filter(user =>
    (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex">
                <Sidebar />

                <div className="flex-1 p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Quản lý tính năng</h1>
                            <p className="text-muted-foreground">Quản lý các tính năng ứng dụng và quyền truy cập người dùng</p>
                        </div>
                        <Dialog open={dialogState.create} onOpenChange={(o) => setDialogState({ ...dialogState, create: o })}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Tạo tính năng
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tạo tính năng mới</DialogTitle>
                                    <DialogDescription>
                                        Thêm một tính năng mới sẽ có sẵn cho tất cả người dùng
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Tên tính năng</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ name: e.target.value })}
                                            placeholder="Nhập tên tính năng"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setDialogState({ ...dialogState, create: false })}>
                                        Hủy
                                    </Button>
                                    <Button onClick={handleCreateFeature} disabled={loading.actions}>
                                        {loading.actions ? 'Đang tạo...' : 'Tạo'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Tabs defaultValue="features" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <TabsList>
                                <TabsTrigger value="features" className="gap-2">
                                    <Settings className="h-4 w-4" />
                                    Tính năng
                                </TabsTrigger>
                                <TabsTrigger value="users" className="gap-2">
                                    <Users className="h-4 w-4" />
                                    Phân quyền người dùng
                                </TabsTrigger>
                            </TabsList>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <TabsContent value="features" className="space-y-4">
                            {filteredFeatures.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center">
                                        <p className="text-muted-foreground">
                                            {searchTerm ? "Không tìm thấy tính năng nào phù hợp" : "Chưa có tính năng nào"}
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4">
                                    {filteredFeatures.map((feature) => (
                                        <Card key={feature.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                                <div className="space-y-1.5">
                                                    <CardTitle className="flex items-center gap-2">
                                                        {feature.name}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Tạo bởi: {feature.createdBy} vào {new Date(feature.createdOn).toLocaleString()}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setCurrentFeature(feature)
                                                            setFormData({ name: feature.name })
                                                            setDialogState({ ...dialogState, edit: true })
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog
                                                        open={dialogState.delete && currentFeature?.id === feature.id}
                                                        onOpenChange={(o) => {
                                                            setCurrentFeature(o ? feature : null)
                                                            setDialogState({ ...dialogState, delete: o })
                                                        }}
                                                    >
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xóa tính năng?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc chắn muốn xóa {feature.name}? Hành động này không thể hoàn tác.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteFeature(feature.id)}
                                                                    disabled={loading.actions}
                                                                >
                                                                    {loading.actions ? 'Đang xóa...' : 'Xóa'}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="users" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Phân quyền người dùng</CardTitle>
                                    <CardDescription>Quản lý quyền truy cập tính năng cho từng người dùng</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading.users ? (
                                        <div className="py-8 text-center">Đang tải dữ liệu...</div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="py-8 text-center">
                                            <p className="text-muted-foreground">
                                                {searchTerm ? "Không tìm thấy người dùng nào phù hợp" : "Chưa có người dùng nào"}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredUsers.map((user) => (
                                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarFallback>
                                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">
                                                                <Link href={`/setting/user/${user.id}`} className="font-medium hover:underline">
                                                                    {user.firstName} {user.lastName}
                                                                </Link>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                                            <div className="text-sm text-muted-foreground">@{user.userName}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Dialog open={dialogState.edit} onOpenChange={(o) => setDialogState({ ...dialogState, edit: o })}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Chỉnh sửa tính năng</DialogTitle>
                                <DialogDescription>Cập nhật thông tin tính năng</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Tên tính năng</Label>
                                    <Input
                                        id="edit-name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ name: e.target.value })}
                                        placeholder="Nhập tên tính năng"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogState({ ...dialogState, edit: false })}>
                                    Hủy
                                </Button>
                                <Button onClick={handleUpdateFeature} disabled={loading.actions}>
                                    {loading.actions ? 'Đang cập nhật...' : 'Cập nhật'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}