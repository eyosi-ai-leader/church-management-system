import FooterLogo from "./FooterLogo";
import FooterLinks from "./FooterLinks";
import FooterContact from "./FooterContact";
import FooterSocial from "./FooterSocial";


export default function Footer() {

  return (

    <footer className="bg-slate-900 text-white">

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">


        <div className="grid gap-10 md:grid-cols-4">


          <FooterLogo />


          <FooterLinks />


          <FooterContact />


          <FooterSocial />


        </div>



        <div className="
          mt-12
          border-t
          border-slate-700
          pt-6
          text-center
          text-sm
          text-slate-400
        ">

          © {new Date().getFullYear()} Church Name.
          All rights reserved.

        </div>


      </div>

    </footer>

  );

}