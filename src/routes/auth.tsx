import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useLogin, useRegister, useForgotPassword } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in or register — Atelier" }] }),
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const forgotMutation = useForgotPassword();

  const isPending = loginMutation.isPending || registerMutation.isPending || forgotMutation.isPending;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === "forgot") {
      forgotMutation.mutate(email, {
        onSuccess: () => {
          toast.success("Reset link sent", {
            description: `If ${email} is registered, you'll receive an email.`,
          });
          setTab("login");
        },
        onError: (err) => toast.error(err.message),
      });
      return;
    }

    if (tab === "login") {
      loginMutation.mutate({ email, password }, {
        onSuccess: () => {
          toast.success("Welcome back");
          router.navigate({ to: "/account" });
        },
        onError: (err) => toast.error(err.message),
      });
    } else {
      registerMutation.mutate({ name: name || email.split("@")[0], email, password }, {
        onSuccess: () => {
          toast.success("Account created");
          router.navigate({ to: "/account" });
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-12 text-white">
          <Link to="/" className="font-display text-2xl">atelier.</Link>
          <p className="max-w-sm font-display text-3xl leading-tight">
            Sign in to track orders, save favorites, and check out faster.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-block font-display text-2xl lg:hidden">atelier.</Link>
          {tab !== "forgot" ? (
            <>
              <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-8">
                  <h1 className="font-display text-3xl">Welcome back</h1>
                </TabsContent>
                <TabsContent value="register" className="mt-8">
                  <h1 className="font-display text-3xl">Create your account</h1>
                </TabsContent>
              </Tabs>

              <form onSubmit={submit} className="mt-6 space-y-4">
                {tab === "register" && (
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {tab === "login" && (
                  <button type="button" onClick={() => setTab("forgot")} className="block text-xs text-muted-foreground hover:text-foreground">
                    Forgot password?
                  </button>
                )}
                <Button type="submit" size="lg" className="w-full rounded-full" disabled={isPending}>
                  {isPending ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <div className="relative my-6 text-center text-xs text-muted-foreground">
                <span className="bg-background px-3 relative">or continue with</span>
                <span className="absolute left-0 right-0 top-1/2 -z-10 h-px bg-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-full" disabled>Google</Button>
                <Button variant="outline" className="rounded-full" disabled>Apple</Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl">Reset your password</h1>
              <p className="mt-2 text-sm text-muted-foreground">We'll email you a reset link.</p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input id="forgot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full" disabled={isPending}>
                  {isPending ? "Sending…" : "Send reset link"}
                </Button>
                <button type="button" onClick={() => setTab("login")} className="block w-full text-center text-xs text-muted-foreground hover:text-foreground">
                  ← Back to sign in
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
