import Link from "next/link";


const footerLinks = [
  {
    title: "Quick Links",
    links: [
      {
        name: "Home",
        href: "/",
      },
      {
        name: "About",
        href: "/about",
      },
      {
        name: "Ministries",
        href: "/ministries",
      },
      {
        name: "Events",
        href: "/events",
      },
      {
        name: "Sermons",
        href: "/sermons",
      },
      {
        name: "Contact",
        href: "/contact",
      },
    ],
  },
];


export default function FooterLinks() {

  return (

    <div>

      {
        footerLinks.map((section) => (

          <div key={section.title}>

            <h3 className="mb-5 text-lg font-semibold">
              {section.title}
            </h3>


            <ul className="space-y-3">

              {
                section.links.map((link)=>(
                  
                  <li key={link.name}>

                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 transition hover:text-white"
                    >

                      {link.name}

                    </Link>

                  </li>

                ))
              }

            </ul>

          </div>

        ))
      }


    </div>

  );
}