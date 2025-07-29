"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="my-16 grid grid-cols-12 gap-5 items-center">
      <div className="col-span-12 md:col-span-6">
        <h2 className="font-extrabold text-3xl uppercase">Chúng tôi là ai</h2>
        <p
          className={`pe-5 my-5 font-medium ${showFull ? "" : "line-clamp-6"}`}
        >
          <span className="block mb-3">
            Bệnh lây truyền qua đường tình dục (STIs), trước đây thường được gọi
            là STDs, là những bệnh nhiễm trùng có thể lây từ người này sang
            người khác thông qua hoạt động tình dục không an toàn, bao gồm cả
            quan hệ tình dục qua đường âm đạo, hậu môn hoặc miệng. Những bệnh
            này có thể do vi khuẩn, virus, hoặc ký sinh trùng gây ra.
          </span>
          <span className="block mb-3">
            STIs có thể lây truyền qua các dịch cơ thể như tinh dịch, dịch âm
            đạo, dịch tiết khác, và cũng có thể truyền từ mẹ sang con trong quá
            trình mang thai hoặc khi sinh nở. Ngoài ra, việc dùng chung kim tiêm
            hoặc truyền máu cũng có thể là con đường lây truyền.{" "}
          </span>
          <span className="block">
            Hiện nay, có hơn 20 loại STIs đã được xác định, và chúng phổ biến ở
            mọi lứa tuổi, đặc biệt là ở những người trong độ tuổi sinh sản.
            Nhiều STIs có thể gây ra những vấn đề sức khỏe nghiêm trọng và lâu
            dài nếu không được chẩn đoán và điều trị kịp thời, bao gồm viêm
            nhiễm đường sinh dục, vô sinh, hoặc các biến chứng sức khỏe khác.
            Việc phòng ngừa và phát hiện sớm là vô cùng quan trọng để bảo vệ sức
            khỏe cá nhân và cộng đồng.
          </span>
        </p>
        <Button
          className="uppercase rounded-xl px-5 text-white"
          onClick={() => setShowFull((prev) => !prev)}
        >
          {showFull ? "Thu gọn" : "Đọc thêm"}
        </Button>
      </div>

      <div className="col-span-12 md:col-span-6 flex justify-center">
        <Image
          src="/docter.png"
          alt="doctor"
          width={400}
          height={400}
          className="object-contain max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Hero;
