import Image from "next/image";

export default function FooterLogo() {
  return (
    <div>

      <div className="flex items-center gap-3">

        <Image
          src="/images/Fares-Logo.jpg"
          alt="Church Logo"
          width={50}
          height={50}
          className="rounded-full"
        />


        <h2 className="text-xl font-bold">
          Fares International Church
        </h2>

      </div>


      <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">

        A welcoming church community growing together
        in faith, love, and service.

      </p>


    </div>
  );
}