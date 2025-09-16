"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PricingPlan, pricingPlan } from "@/lib/pricingplan";
import { Badge } from "./ui/badge";
import { CheckCircle } from "lucide-react";

import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  userId: string | undefined;
};

const PricingPage: React.FC<Props> = ({ userId }) => {
  const router = useRouter();

  const checkoutHandler = async (price: number, plan: string) => {
    if (!userId) {
      router.push("/sign-in");
    }
    if (price === 0) {
      return;
    }

    try {
      const response = await axios.post("/api/stripe/checkout-session", {
        price,
        userId,
        plan,
      });

      const { url } = response.data; // Destructuring session URL from backend response

      if (url) {
        router.push(url); // Redirect to the Stripe-hosted checkout page using the URL
      } else {
        console.error("Checkout URL not found");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    }
  };

  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="font-extrabold text-3xl">Plan and pricing</h1>
        <p className="text-gray-500">
          Recieve unlimited credits when you pay early, and save your plan
        </p>
      </div>
      <div className="grid grid-cols-3 gap-10">
        {pricingPlan.map((plan: PricingPlan, idx: number) => (
          <Card
            key={idx}
            className={`${
              plan.level === "Enterprise" && "bg-[#1c1c1c] text-white"
            } w-[350px] flex flex-col justify-between`}
          >
            <CardHeader className="flex flex-row items-center gap-2 ">
              <CardTitle>{plan.level}</CardTitle>
              {plan.level === "Pro" && (
                <Badge className="rounded-full bg-orange-600 hover:bg-null">
                  🔥 Popular
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-2xl font-bold ">{plan.price}</p>
              <ul className="mt-4 space-y-2">
                {plan.services.map((item: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">
                      <CheckCircle />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={`${
                  plan.level === "Enterprise" ? "default" : "outline"
                }`}
                className={`${
                  plan.level === "Enterprise" &&
                  "text-black bg-gray-200 hover:bg-gray-300"
                } w-full`}
                onClick={() =>
                  checkoutHandler(
                    plan.level === "Pro"
                      ? 29
                      : plan.level === "Enterprise"
                      ? 70
                      : 0,
                    plan.level
                  )
                }
              >
                Get started with {plan.level}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
