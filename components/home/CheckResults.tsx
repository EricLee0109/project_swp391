"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface TestResult {
  appointment?: {
    appointment_id: string;
    type: string;
    start_time: string;
    end_time: string;
    status: string;
    payment_status: string;
    mode: string;
    service: {
      service_id: string;
      name: string;
      category: string;
    };
    shipping_info?: {
      contact_name: string;
      contact_phone: string;
      shipping_address: string;
      province: string;
      district: string;
      ward: string;
      expected_delivery_time: string;
    };
    payments?: Array<{
      amount: string;
      payment_method: string;
      status: string;
      created_at: string;
    }>;
  };
  testResult?: {
    result_id: string;
    test_code: string;
    result_data: string;
    status: string;
    is_abnormal: boolean;
    notes: string;
    updated_at: string;
  };
  basic_info?: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  message: string;
}

export default function CheckResults() {
  const [testCode, setTestCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [result, setResult] = useState<TestResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/appointments/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCode, fullName }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.data || data);
        setIsDialogOpen(true);
      } else {
        setError(data.message || 'Không tìm thấy kết quả');
      }
    } catch {
      setError('Đã có lỗi xảy ra, vui lòng thử lại');
    }
  };

  // Map English statuses to Vietnamese
  const translateStatus = (status: string | undefined): string => {
    if (!status) return 'Không có dữ liệu';
    switch (status) {
      case 'Pending':
        return 'Đang chờ';
      case 'Completed':
        return 'Hoàn thành';
      case 'Failed':
        return 'Thất bại';
      default:
        return status; // Return original status if not matched
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Kiểm tra kết quả xét nghiệm</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="testCode" className="text-lg">Mã xét nghiệm</Label>
                <Input
                  id="testCode"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  placeholder="Nhập mã xét nghiệm (VD: STI-123)"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="fullName" className="text-lg">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên (VD: Nguyen Van A)"
                  className="mt-1"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                Kiểm tra kết quả
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Kết quả xét nghiệm</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về kết quả xét nghiệm của bạn
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {result.basic_info ? (
                  <div>
                    <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                    <p><strong>Họ và tên:</strong> {result.basic_info.full_name || 'Không có dữ liệu'}</p>
                    <p><strong>Email:</strong> {result.basic_info.email || 'Không có dữ liệu'}</p>
                    <p><strong>Số điện thoại:</strong> {result.basic_info.phone_number || 'Không có dữ liệu'}</p>
                  </div>
                ) : (
                  <p className="text-red-500">Không có thông tin cá nhân</p>
                )}
                {result.testResult ? (
                  <div>
                    <h3 className="text-lg font-semibold">Kết quả xét nghiệm</h3>
                    <p><strong>Mã xét nghiệm:</strong> {result.testResult.test_code || 'Không có dữ liệu'}</p>
                    <p><strong>Kết quả:</strong> {result.testResult.result_data || 'Không có dữ liệu'}</p>
                    <p><strong>Trạng thái:</strong> {translateStatus(result.testResult.status)}</p>
                    <p><strong>Ghi chú:</strong> {result.testResult.notes || 'Không có dữ liệu'}</p>
                    <p><strong>Cập nhật lần cuối:</strong> {result.testResult.updated_at ? new Date(result.testResult.updated_at).toLocaleString() : 'Không có dữ liệu'}</p>
                  </div>
                ) : (
                  <p className="text-red-500">Không có kết quả xét nghiệm</p>
                )}
                {result.appointment?.payments && result.appointment.payments.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold">Thanh toán</h3>
                    {result.appointment.payments.map((payment, index) => (
                      <div key={index}>
                        <p><strong>Số tiền:</strong> {payment.amount ? parseInt(payment.amount).toLocaleString() + ' VND' : 'Không có dữ liệu'}</p>
                        <p><strong>Phương thức:</strong> {payment.payment_method || 'Không có dữ liệu'}</p>
                        <p><strong>Trạng thái:</strong> {translateStatus(payment.status)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500">Không có thông tin thanh toán</p>
                )}
              </div>
              <Button onClick={() => setIsDialogOpen(false)} className="mt-4 bg-pink-500 hover:bg-pink-600 text-white">
                Đóng
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}