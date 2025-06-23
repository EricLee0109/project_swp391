import Link from "next/link";
import MaxWidthWrapper from "../profile/MaxWidthWrapper";
import { Input } from "../ui/input";

const Footer = () => {
  return (
    <div className="bg-[#3b3b43] text-white text-sm">
      <MaxWidthWrapper className="px-6 py-16">
        <div className="grid grid-cols-12 gap-5">
          {/* SHOP */}
          <div className="col-span-12 sm:col-span-3">
            <h4 className="uppercase font-bold text-white">Shop</h4>
            <hr className="my-2 border-white/30" />
            <ul className="space-y-2">
              <li><Link href="/about-us">Về chúng tôi</Link></li>
              <li><Link href="/our-team">Đội ngũ của chúng tôi</Link></li>
              <li><Link href="/flagship-store">Cửa hàng hàng đầu</Link></li>
            </ul>
          </div>

          {/* DỊCH VỤ KHÁCH HÀNG */}
          <div className="col-span-12 sm:col-span-3">
            <h4 className="uppercase font-bold text-white">Dịch vụ khách hàng</h4>
            <hr className="my-2 border-white/30" />
            <ul className="space-y-2">
              <li><Link href="/faq/contact">Liên hệ</Link></li>
              <li><Link href="/faq/services-and-maintenance">Dịch vụ & Bảo trì</Link></li>
              <li><Link href="/faq/wholesale">Bán buôn</Link></li>
              <li><Link href="/faq/sell-your-gear">Bán thiết bị của bạn</Link></li>
              <li><Link href="/faq/shipping-policies">Chính sách vận chuyển</Link></li>
              <li><Link href="/faq/terms-of-service">Điều khoản dịch vụ</Link></li>
              <li><Link href="/faq/return-policies">Chính sách trả hàng</Link></li>
              <li><Link href="/faq/privacy-policies">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* GHÉ THĂM CHÚNG TÔI */}
          <div className="col-span-12 sm:col-span-3">
            <h4 className="uppercase font-bold text-white">Ghé thăm chúng tôi</h4>
            <hr className="my-2 border-white/30" />
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold">Giờ mở</h5>
                <p>Thứ Hai - Chủ Nhật</p>
                <p>10:00 AM - 08:30 PM</p>
              </div>
              <div>
                <h5 className="font-semibold">Reverb</h5>
                <p>Ghé thăm cửa hàng trên Reverb</p>
              </div>
              <div>
                <h5 className="font-semibold">Vintage & Rare</h5>
                <p>Ghé thăm cửa hàng trên <span className="font-bold">Vintage & Rare</span></p>
              </div>
              <div>
                <h5 className="font-semibold">Lab's Shopee</h5>
                <p>Ghé thăm cửa hàng trên <span className="font-bold">Shopee</span></p>
              </div>
            </div>
          </div>

          {/* HÃY GIỮ LIÊN LẠC */}
          <div className="col-span-12 sm:col-span-3 flex flex-col justify-center items-start sm:items-center text-center sm:text-center">
            <h4 className="text-2xl font-bold uppercase">Hãy giữ liên lạc</h4>
            <p className="text-xs mt-2 mb-4">Cập nhật tin tức, ưu đãi và sự kiện mới nhất của chúng tôi</p>
            <Input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              className="bg-white text-black placeholder:text-center max-w-sm"
            />
          </div>
        </div>

        <p className="text-xs text-white mt-10 text-center">© Innovibe 2024</p>
      </MaxWidthWrapper>
    </div>
  );
};

export default Footer;
