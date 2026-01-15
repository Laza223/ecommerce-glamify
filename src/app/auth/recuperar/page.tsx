"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeConfig } from "@/config/store";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${storeConfig.url}/auth/callback?redirect=/auth/nueva-password`,
      });

      if (error) {
        toast.error("Error al enviar el email", {
          description: error.message,
        });
        return;
      }

      setEmailSent(true);
      toast.success("Email enviado");
    } catch {
      toast.error("Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          <Link
            href="/auth/login"
            className="absolute left-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <Image
              src="/logo-glamify-makeup.jpeg"
              alt={storeConfig.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
          <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Te enviaremos un link para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">¡Email enviado!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Revisá tu bandeja de entrada en <strong>{email}</strong>
                </p>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/login">Volver al login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Enviar link de recuperación
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Volver al login
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
