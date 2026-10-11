import { RegisterForm } from "@/components/auth/register-form";

interface RegisterPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : null;
  const initialRole = params.role === "landlord" ? "LANDLORD" : "TENANT";

  return <RegisterForm next={next} initialRole={initialRole} />;
}
