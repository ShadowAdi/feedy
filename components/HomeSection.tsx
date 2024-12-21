import React from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";

const HomeSection = () => {
  return (
    <section className="flex mt-8   md:flex-row flex-col justify-between w-[80%] mx-auto items-start">
      <div className="flex w-[70%] py-8  flex-col justify-start items-center md:items-start pt-14 gap-10">
        <h1 className="text-4xl md:text-6xl font-bold text-left ">
          Easily Collect and Manage Feedback for Your Projects!
        </h1>
        <p className="text-base md:text-xl font-medium text-[#727171] ">
          Empower your projects with real-time user feedback and seamless
          collaboration. Start now for free!
        </p>
        <div className="flex gap-3 items-center">
          <Link href={"/login"}>
            <Button className="w-[250px] hover:bg-[#beb8b8] py-10  rounded-full">
              <span className="text-2xl font-medium">Get Started</span>
            </Button>
          </Link>
          <Link href={"#feature"}>
          <Button
            variant="solid"
            className="w-[250px]  py-10 bg-black hover:bg-[#181818] hover:opacity-100 text-white  rounded-full"
          >
            <span className="text-2xl font-medium">Learn More</span>
          </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 w-[30%] ">
        <Image
          src={"/demo.gif"}
          alt="demo"
          layout={"responsive"}
          width={155}
          height={155}
          unoptimized={true}
        />
      </div>
    </section>
  );
};

export default HomeSection;
