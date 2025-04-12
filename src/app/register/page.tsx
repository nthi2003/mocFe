'use client';
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Coffee } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== comfirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
     await axios.post("/Account/RegisterUser", {
        firstName,
        lastName,
        email,
        userName,
        gender,
        password,
        comfirmPassword,
        phoneNumber,
      });

      toast.success("Đăng ký thành công!", {
        description: "Bạn có thể đăng nhập ngay bây giờ",
      });

      router.push("/login");
    } catch {
      toast.error("Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="bg-primary p-2 rounded-md">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">F&B Mộc</h1>
            <p className="text-muted-foreground">Tạo tài khoản mới</p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="flex space-x-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="firstName">Họ</Label>
                <Input id="firstName" placeholder="Nguyễn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="lastName">Tên</Label>
                <Input id="lastName" placeholder="Văn A" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@fbstore.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="PhoneNumber">Số điện thoại</Label>
              <Input id="PhoneNumber" type="tel" placeholder="0123456789" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>

            <div className="flex space-x-4">
              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select onValueChange={(value) => setGender(Number(value))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Nam</SelectItem>
                    <SelectItem value="1">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1">
                <Label htmlFor="UserName">UserName</Label>
                <Input id="UserName" placeholder="abc" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comfirmPassword">Xác nhận mật khẩu</Label>
              <Input id="comfirmPassword" type="password" value={comfirmPassword} onChange={(e) => setComfirmPassword(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Tôi đồng ý với{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  điều khoản sử dụng
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full">
              Đăng kí
            </Button>
          </form>

          <div className="text-center text-sm">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
