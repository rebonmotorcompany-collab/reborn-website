import type { Metadata } from "next";
import PrivacyPolicy from "@/components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Rebon Motor Company",
  description:
    "Read the official Privacy Policy of Rebon Motor Company. Learn about our data practices, Meta Platform integrations, and WhatsApp Cloud API usage.",
  robots: "index, follow",
  openGraph: {
    title: "Privacy Policy | Rebon Motor Company",
    description:
      "Read the official Privacy Policy of Rebon Motor Company. Learn about our data practices, Meta Platform integrations, and WhatsApp Cloud API usage.",
    type: "website",
    url: "https://rebonmotorcompany.com.pk/privacy-policy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Rebon Motor Company",
    description:
      "Read the official Privacy Policy of Rebon Motor Company. Learn about our data practices, Meta Platform integrations, and WhatsApp Cloud API usage.",
  },
  alternates: {
    canonical: "https://rebonmotorcompany.com.pk/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
