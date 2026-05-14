"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Field, inputClass } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    let signInError: { message: string } | null = null;

    try {
      const supabase = createSupabaseBrowserClient();
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      signInError = result.error;
    } catch (caught) {
      signInError =
        caught instanceof Error ? { message: caught.message } : { message: "Sign in failed" };
    }

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Field label="Email">
        <input
          className={inputClass}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </Field>
      <Field label="Password">
        <input
          className={inputClass}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </Field>
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <Button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
    </form>
  );
}
