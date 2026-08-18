import NavItem from "./navitem";
import Button from "@/components/shared/Button";
import navigation from "@/data/navigation";

const DesktopNav = () => {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Desktop Navigation">
      {navigation.map((item) => (
        <NavItem key={item.label} href={item.href} label={item.label} />
      ))}

      <Button
        href="/give"
        variant="secondary"
        className="ml-3 rounded-full border-ink px-6 py-2 text-ink transition-all duration-300 hover:bg-ink hover:text-white"
      >
        Give
      </Button>
    </nav>
  );
};

export default DesktopNav;