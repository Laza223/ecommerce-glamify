"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { storeConfig } from "@/config/store";
import { useCartStore } from "@/stores/cart-store";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Step = "email" | "verify" | "address" | "payment";

export default function CheckoutPage() {
  const { items, getSubtotal, getItemPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const subtotal = getSubtotal();
  const shipping =
    subtotal >= storeConfig.freeShippingThreshold
      ? 0
      : storeConfig.defaultShippingCost;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(storeConfig.locale, {
      style: "currency",
      currency: storeConfig.currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Ingresá un email válido");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar código");
      }

      toast.success("¡Código enviado!", {
        description: `Revisá tu email ${email}`,
      });
      setStep("verify");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al enviar código";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Código inválido");
      }

      setIsEmailVerified(true);
      toast.success("¡Email verificado!");
      setStep("address");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al verificar";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    // Validate address form
    if (
      !formData.fullName ||
      !formData.streetAddress ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      toast.error("Completá todos los campos obligatorios");
      return;
    }
    setStep("payment");
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        customer_email: email,
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        shipping_address: {
          full_name: formData.fullName,
          phone: formData.phone,
          street_address: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: "Argentina",
        },
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: getItemPrice(item),
          product_name: item.product.name,
          variant_name: item.variant?.name,
          product_image: item.product.images[0],
        })),
        subtotal,
        shipping_cost: shipping,
        total,
      };

      // Call API to create order and get Mercado Pago checkout URL
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear el pedido");
      }

      toast.success("¡Pedido creado!", {
        description: "Redirigiendo al pago...",
      });

      // Clear cart and redirect to Mercado Pago
      clearCart();
      window.location.href = data.checkout_url;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al procesar el pedido";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-full bg-muted p-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">
          Agregá productos antes de finalizar tu compra
        </p>
        <Button className="mt-6" size="lg" asChild>
          <Link href="/productos">Ver Productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/carrito">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al carrito
        </Link>
      </Button>

      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          {[
            { key: "email", label: "Email", icon: Mail },
            { key: "verify", label: "Verificar", icon: Check },
            { key: "address", label: "Dirección", icon: MapPin },
            { key: "payment", label: "Pagar", icon: CreditCard },
          ].map((s, index) => {
            const isCompleted =
              (s.key === "email" && step !== "email") ||
              (s.key === "verify" && isEmailVerified) ||
              (s.key === "address" && step === "payment");
            const isCurrent = s.key === step;

            return (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isCompleted
                      ? "bg-green-100 text-green-700"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {index < 3 && (
                  <div className="mx-2 h-px w-8 bg-muted-foreground/30" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Form Steps */}
        <div className="space-y-6">
          {/* Step 1: Email */}
          {step === "email" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Tu Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Te enviaremos un código de verificación para confirmar tu
                  email.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <Button
                  onClick={handleSendCode}
                  disabled={isLoading || !email}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Enviar código
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Verify Code */}
          {step === "verify" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Verificar Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ingresá el código de 6 dígitos que enviamos a{" "}
                  <strong>{email}</strong>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="code">Código de verificación</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep("email")}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cambiar email
                  </Button>
                  <Button
                    onClick={handleVerifyCode}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Verificar
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="text-sm text-primary hover:underline w-full text-center"
                  disabled={isLoading}
                >
                  ¿No recibiste el código? Reenviar
                </button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Address */}
          {step === "address" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  ✓ Email verificado: <strong>{email}</strong>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Dirección *</Label>
                  <Input
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Calle y número"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apartment">Departamento / Piso</Label>
                  <Input
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Opcional"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Provincia *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Código Postal *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Button onClick={handleProceedToPayment} className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continuar al pago
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Payment */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Confirmar y Pagar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Envío:</strong> {formData.streetAddress},{" "}
                    {formData.city}, {formData.state}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setStep("address")}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Modificar dirección
                </Button>

                <Button
                  onClick={handleSubmit}
                  className="w-full shadow-pink"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Procesando..." : "Pagar con Mercado Pago"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Serás redirigido a Mercado Pago para completar el pago de
                  forma segura
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.variant_id}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.value}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(getItemPrice(item) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
