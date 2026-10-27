import Link from "next/link";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Ministries", href: "/ministries" },
      { name: "Events", href: "/events" },
      { name: "Sermons", href: "/sermons" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

export default function FooterLinks() {
  return (
    <div>
      {footerLinks.map((section) => (
        <nav key={section.title} aria-label={section.title}>
          <h3 className="mb-3 text-lg font-semibold">{section.title}</h3>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {section.links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}