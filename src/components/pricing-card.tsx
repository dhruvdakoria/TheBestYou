"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { supabase } from "../../supabase/supabase";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  // Define features based on plan
  const getFeatures = (planName: string) => {
    const baseFeatures = [
      "Strength training tracking",
      "Basic nutrition logging",
      "Habit tracking (up to 3)",
      "Progress visualizations",
    ];

    const proFeatures = [
      "Everything in Free plan",
      "AI meal recognition",
      "Unlimited habit tracking",
      "Advanced analytics",
      "Personalized recommendations",
      "Priority support",
    ];

    const premiumFeatures = [
      "Everything in Pro plan",
      "1-on-1 coaching sessions",
      "Custom workout programs",
      "Nutrition plan creation",
      "API access",
      "White-glove support",
    ];

    if (planName.toLowerCase().includes("pro")) return proFeatures;
    if (planName.toLowerCase().includes("premium")) return premiumFeatures;
    return baseFeatures;
  };

  const features = getFeatures(item.name || "");

  return (
    <Card
      className={`w-[350px] relative overflow-hidden ${item.popular ? "border-2 border-primary shadow-xl scale-105" : "border border-border"}`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-30" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-purple-400 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold">${item?.amount / 100}</span>
          <span className="text-muted-foreground">/{item?.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="relative">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className={`w-full py-6 text-lg font-medium ${item.popular ? "bg-primary hover:bg-primary/90" : ""}`}
        >
          {item.amount === 0 ? "Get Started Free" : "Subscribe Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
