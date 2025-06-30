"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User, Mail, Edit, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { api } from '@/lib/axios'
import Sidebar from '@/app/components/sidebar'
import Header from '@/app/components/header'

interface User {
    id: string
    userName: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    emailConfirmed: boolean
    phoneNumberConfirmed: boolean
    twoFactorEnabled: boolean

}

export default function UserDetailPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetchUser();
    }, [params.id]);

    const fetchUser = () => {
        setLoading(true);
        api.get(`/Users/${params.id}`)
            .then((res) => {
                if (res.data.success) {
                    setUser(res.data.data);
                }
            })
            .catch(() => {

            })
            .finally(() => {
                setLoading(false);
            });
    }


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }


    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <User className="w-12 h-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-bold mb-2">Không tìm thấy người dùng</h2>
                <p className="text-gray-600 mb-4">ID: {params.id}</p>
                <Button asChild>
                    <Link href="/users">Quay lại danh sách</Link>
                </Button>
            </div>
        )
    }

    return (

        <div>
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="container p-4 md:p-6 max-full">
                    <div className="flex justify-between items-center mb-6">
                        <Button variant="outline" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2" /> Quay lại
                        </Button>
                        <h1 className="text-2xl font-bold">Thông tin chi tiết</h1>
                        <Button>
                            <Edit className="mr-2" /> Chỉnh sửa
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    {user.firstName} {user.lastName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">@{user.userName}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" /> Thông tin cá nhân
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Họ và tên</p>
                                    <p>{user.firstName} {user.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p>@{user.userName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ID</p>
                                    <p className="font-mono text-sm">{user.id}</p>
                                </div>
                            </CardContent>
                        </Card>


                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="w-5 h-5" /> Liên hệ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <div className="flex items-center gap-2">
                                        <p>{user.email}</p>
                                        {user.email ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Điện thoại</p>
                                    <div className="flex items-center gap-2">
                                        <p>{user.phoneNumber}</p>
                                        {user.phoneNumber ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}