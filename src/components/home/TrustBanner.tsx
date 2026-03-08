import { Shield, Truck, Phone, CreditCard } from "lucide-react";

const features = [
  { icon: <Shield className="h-5 w-5" />, title: "Secure Shopping", desc: "Safe & trusted platform" },
  { icon: <Truck className="h-5 w-5" />, title: "Nationwide Delivery", desc: "Across Zambia" },
  { icon: <Phone className="h-5 w-5" />, title: "Mobile Money", desc: "MTN, Airtel, Zamtel" },
];

const TrustBanner = () => {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="marketplace-container grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBanner;
