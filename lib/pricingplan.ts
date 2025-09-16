export type PricingPlan = {
  level: string;
  price: string;
  services: string[];
};

export const pricingPlan: PricingPlan[] = [
  {
    level: "Free",
    price: "$0/month",
    services: [
      "3 Free Credits",
      "Basic Supports",
      "Limited Features",
      "Community access",
    ],
  },
  {
    level: "Pro",
    price: "$29/month",
    services: [
      "Unlimited Credits",
      "Basic Supports",
      "Limited Features",
      "Community access",
    ],
  },
  {
    level: "Enterprise",
    price: "$70/month",
    services: [
      "Unlimited Credits",
      "Basic Supports",
      "Limited Features",
      "Community access",
      "Monthly updates",
    ],
  },
];
