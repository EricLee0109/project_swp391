import Image from "next/image";

const Features = () => {
  return (
    <div className="my-16 grid grid-cols-12 gap-10">
      <div className="col-span-4 text-center">
        <div className="flex justify-center">
          <Image src="/FreeShipping.png" alt="" width={64} height={64} />
        </div>
        <hr className="border-pink-600 my-2" />
        <h5 className="uppercase text-pink-600 font-extrabold text-lg">
          Miễn phí vận chuyển
        </h5>
        <p className="font-semibold">
          Giao hàng miễn phí trên toàn quốc để mang lại sự tiện lợi tối đa.
        </p>
      </div>
      <div className="col-span-4 text-center">
        <div className="flex justify-center">
          <Image src="/OnlineShopping.png" alt="" width={64} height={64} />
        </div>
        <hr className="border-pink-600 my-2" />
        <h5 className="uppercase text-pink-600 font-extrabold text-lg">
          Mua dịch vụ trực tuyến an toàn
        </h5>
        <p className="font-semibold">
          Hệ thống thanh toán an toàn đảm bảo sự an tâm khi mua sắm trực tuyến.
        </p>
      </div>
      <div className="col-span-4 text-center">
        <div className="flex justify-center">
          <Image src="/Headset.png" alt="" width={64} height={64} />
        </div>
        <hr className="border-pink-600 my-2" />
        <h5 className="uppercase text-pink-600 font-extrabold text-lg">
          Hỗ trợ khách hàng tận tâm
        </h5>
        <p className="font-semibold">
          Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ, dù bạn mua sắm trực tuyến
          hay tại cửa hàng.
        </p>
      </div>
    </div>
  );
};

export default Features;
