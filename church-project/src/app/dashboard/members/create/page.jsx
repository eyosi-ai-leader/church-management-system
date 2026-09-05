import CreateMemberForm from "@/components/dashboard/members/create/CreateMemberForm";

export const metadata = {
  title: "Add Member | CHMS",
  description: "Add a new church member",
};

export default function Page() {
  return <CreateMemberForm />;
}