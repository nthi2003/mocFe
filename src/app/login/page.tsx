'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Coffee } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import axios from 'axios';
import Image from 'next/image'; // ✅ Import Image

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/Account/Authentication', {
        email,
        password,
      });

      const { data } = response.data;

      if (data?.jwToken) {
        localStorage.setItem('accessToken', data.jwToken);
        localStorage.setItem('user', JSON.stringify(data));

        toast.success('Đăng nhập thành công!');
        router.push('/');
      } else {
        toast.error('Token không tồn tại!');
      }
    } catch (error: unknown) {
      let message = 'Đăng nhập thất bại';

      if (axios.isAxiosError(error)) {
        message = (error.response?.data as { message?: string })?.message || message;
      }

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 w-[60%]">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="bg-primary p-2 rounded-md">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">F&B Mộc</h1>
            <p className="text-muted-foreground">Đăng nhập vào tài khoản của bạn</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fbstore.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
          <div className="text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
      <div className="w-[40%] relative h-[1050px]">
        <Image
          src="/images/loading.jpg"
          alt="Login Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
}
