import Image from "next/image";

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center flex flex-col items-center">
        <Image src="/comming-soon.png" alt="Coming Soon" width={250} height={250} />
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Sắp ra mắt!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Chúng tôi đang nỗ lực để mang tính năng này đến với bạn. Hãy theo dõi nhé!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
