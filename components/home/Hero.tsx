import { Button } from "@/components/ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="my-16 grid grid-cols-12 gap-5 items-center">
      <div className="col-span-12 md:col-span-6">
        <h2 className="font-extrabold text-3xl uppercase">Chúng tôi là ai</h2>
        <p className="pe-5 my-5 font-semibold">
          Chúng tôi không chỉ là một phòng khám bệnh lý lây truyền qua đường
          tình dục (STIs) — chúng tôi là ngọn lửa thắp lên sự chủ động trong
          chăm sóc sức khỏe của bạn. Chúng tôi không ngại phá vỡ sự im lặng, đập
          tan định kiến và đưa sự thật ra ánh sáng. Chúng tôi là tiếng nói của
          sự dũng cảm, là điểm tựa của những ai dám đối mặt với nỗi sợ và chăm
          sóc bản thân một cách tự tin. Bạn không chỉ đến để kiểm tra sức khỏe.
          Bạn đến để làm chủ cuộc sống của mình.
        </p>
        <Button className="uppercase rounded-xl px-5">Đọc thêm</Button>
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
