// import TrustSignal1 from "@/assets/imgs/Truck.png";
// import TrustSignal2 from "@/assets/imgs/Natural User Interface 2.png";
// import TrustSignal3 from "@/assets/imgs/Magnetic Card.png";
// import TrustSignal4 from "@/assets/imgs/Transaction.png";
const TrustSignals = () => {
  return (
    <div className="my-16 grid grid-cols-12 gap-5">
      <div className="col-span-3 flex justify-center items-center flex-col gap-1">
        {/* <img src={TrustSignal1} alt="" /> */}
        <h3 className="text-pink-600 text-sm uppercase font-bold text-center">
          Giao hàng miễn phí nội thành
        </h3>
        <p className="text-sm text-center">
          <span className="font-bold">Miễn phí vận chuyển</span> trong thành
          phố, trên toàn quốc cho các đơn hàng trên một số tiền nhất định.
        </p>
      </div>
      <div className="col-span-3 flex justify-center items-center flex-col gap-1">
        {/* <img src={TrustSignal2} alt="" /> */}
        <h3 className="text-pink-600  text-lg uppercase font-bold">
          Nhấp & nhận miễn phí
        </h3>
        <p className="text-sm text-center">Chỉ cần đặt cọc 10%. Chỉ cần đặt cọc 10%.</p>
      </div>
      <div className="col-span-3 flex justify-center items-center flex-col gap-1">
        {/* <img src={TrustSignal3} alt="" /> */}
        <h3 className="text-pink-600  text-lg uppercase font-bold">
          Bảo đảm thanh toán
        </h3>
        <p className="text-sm text-center">
          Mua sắm trực tuyến dễ dàng và nhanh chóng
        </p>
      </div>
      <div className="col-span-3 flex justify-center items-center flex-col gap-1">
        {/* <img src={TrustSignal4} alt="" /> */}
        <h3 className="text-pink-600 text-lg uppercase font-bold">
          14 ngày hoàn trả
        </h3>
        <p className="text-sm text-center">
          Tận hưởng chính sách linh hoạt khi bạn thay đổi quyết định
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;
