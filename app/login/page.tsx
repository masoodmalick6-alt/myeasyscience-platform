import { AuthForm } from "@/components/auth-form";
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="login" error={params.error} message={params.message}/>;
}
