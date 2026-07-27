"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  userId: string | undefined;
};

const plans = [
  {
    level: "Free",
    description: "Perfect for testing and personal projects.",
    priceMonthly: 0,
    priceYearly: 0,
    services: [
      "3 Free Credits",
      "Basic Support",
      "Limited Features",
      "Community access",
    ],
    icon: Sparkles,
    iconColor: "text-sky-400 bg-sky-500/10",
    buttonText: "Get Started for Free",
    popular: false,
    gradient: "hover:border-sky-500/30",
  },
  {
    level: "Pro",
    description: "Best for creators, designers & power users.",
    priceMonthly: 29,
    priceYearly: 23, // $23 * 12 = $276/year
    services: [
      "Unlimited Credits",
      "Priority Email Support",
      "Advanced AI features",
      "Community access & templates",
    ],
    icon: Zap,
    iconColor: "text-violet-400 bg-violet-500/10",
    buttonText: "Upgrade to Pro",
    popular: true,
    gradient: "border-violet-500/50 shadow-lg shadow-violet-500/10 hover:border-violet-400",
  },
  {
    level: "Enterprise",
    description: "For teams and businesses needing scale.",
    priceMonthly: 70,
    priceYearly: 56, // $56 * 12 = $672/year
    services: [
      "Unlimited Credits",
      "Dedicated 24/7 Support",
      "Custom integration features",
      "Team collaboration access",
      "Monthly custom updates",
    ],
    icon: Crown,
    iconColor: "text-amber-400 bg-amber-500/10",
    buttonText: "Upgrade to Enterprise",
    popular: false,
    gradient: "hover:border-amber-500/30",
  },
];

const PricingPage: React.FC<Props> = ({ userId }) => {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const checkoutHandler = async (price: number, plan: string) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    if (price === 0) {
      return;
    }

    try {
      const response = await axios.post("/api/stripe/checkout-session", {
        price,
        userId,
        plan: `${plan} (${billingCycle === "yearly" ? "Yearly" : "Monthly"})`,
      });

      const { url } = response.data;

      if (url) {
        router.push(url);
      } else {
        console.error("Checkout URL not found");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    }
  };

  return (
    <div className="relative py-16 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="text-center mb-12 relative z-10 space-y-4">
        <Badge className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full font-medium text-xs tracking-wider uppercase">
          Pricing Plans
        </Badge>
        <h1 className="font-extrabold text-4xl sm:text-5xl tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          Plan and pricing
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-base">
          Receive unlimited credits when you choose a premium plan, and unlock your workflow limits.
        </p>

        {/* Billing Toggle Switch */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <span className={`text-sm font-medium transition-colors duration-200 ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative w-14 h-7 bg-muted border border-border/80 rounded-full p-0.5 transition-all duration-300 focus:outline-none"
            aria-label="Toggle billing cycle"
          >
            <div
              className={`w-6 h-6 bg-primary rounded-full shadow-md transition-all duration-300 ${
                billingCycle === "yearly" ? "translate-x-7 bg-violet-600" : ""
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium transition-colors duration-200 ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold px-2 py-0.5">
              Save 20%
            </Badge>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 px-4 sm:px-6">
        {plans.map((plan, idx) => {
          const PlanIcon = plan.icon;
          const isPro = plan.popular;
          
          // Calculate dynamic prices
          const currentPrice = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const checkoutPrice = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly * 12;

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -8, transition: { duration: 0.2, ease: "easeInOut" } }}
              className="flex"
            >
              <Card
                className={`relative w-full flex flex-col justify-between overflow-hidden transition-all duration-300 border bg-background/40 backdrop-blur-md ${
                  isPro 
                    ? "border-violet-500/60 shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)] bg-background/60" 
                    : "border-border/50 shadow-sm"
                } ${plan.gradient} rounded-2xl`}
              >
                {/* Popular Glow Effect */}
                {isPro && (
                  <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                )}

                <CardHeader className="pb-6">
                  <div className="flex justify-between items-center mb-4">
                    {/* Header Icon */}
                    <div className={`p-2.5 rounded-xl ${plan.iconColor}`}>
                      <PlanIcon className="w-5 h-5" />
                    </div>

                    {/* Popular Badge */}
                    {isPro && (
                      <Badge className="bg-violet-600 hover:bg-violet-700 text-white rounded-full font-semibold text-xs px-2.5 py-0.5 shadow-sm shadow-violet-500/20">
                        🔥 Popular
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.level}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-1 pb-6 space-y-6">
                  {/* Price Block */}
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        ${currentPrice}
                      </span>
                      <span className="text-muted-foreground ml-1 text-sm font-semibold">
                        /month
                      </span>
                    </div>
                    {billingCycle === "yearly" && plan.priceMonthly > 0 && (
                      <p className="text-xs text-emerald-400 font-medium mt-1">
                        Billed yearly (${checkoutPrice}/year)
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] bg-border/40 w-full" />

                  {/* Services List */}
                  <ul className="space-y-3.5">
                    {plan.services.map((item, index) => (
                      <li key={index} className="flex items-start text-sm text-foreground/80">
                        <div className="mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0 pb-6">
                  <Button
                    onClick={() => checkoutHandler(checkoutPrice, plan.level)}
                    className={`w-full h-11 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      isPro
                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/10 hover:shadow-violet-500/20"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                    variant={isPro ? "default" : "secondary"}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPage;
