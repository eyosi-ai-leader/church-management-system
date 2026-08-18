import { Globe, MessageCircle, Play, Send } from "lucide-react";

const socialLinks = [
  {
    name: "Facebook",
    icon: Globe,
    href: "https://www.facebook.com/profile.php?id=100064806303220",
  },
  {
    name: "Instagram",
    icon: MessageCircle,
    href: "https://www.instagram.com",
  },
  {
    name: "YouTube",
    icon: Play,
    href: "#",
  },
  {
    name: "Telegram",
    icon: Send,
    href: "#",
  },
];

export default function FooterSocial() {
  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold">Follow Us</h3>

      <div className="flex gap-4">
        {socialLinks.map((social) => {
          const Icon = social.icon;

          return (
            <a
              key={social.name}
              href={social.href}
              aria-label={social.name}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-slate-800
                text-slate-300
                transition
                hover:bg-blue-600
                hover:text-white
              "
            >
              <Icon size={20} />
            </a>
          );
        })}
      </div>
    </div>
  );
}