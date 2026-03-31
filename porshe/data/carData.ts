export interface Phase {
  id: string;
  startProgress: number;
  endProgress: number;
  title: string;
  subtitle?: string;
  body?: string;
  highlight?: string;
  price?: string;
  cta?: string;
  specs?: { label: string; value: string }[];
}

export const phases: Phase[] = [
  {
    id: "hero",
    startProgress: 0,
    endProgress: 0.33,
    title: "911 Turbo S",
    subtitle: "Timeless Precision. Relentless Performance.",
    price: "₹3.35 Cr / €220,000",
    cta: "Configure Now",
  },
  {
    id: "design",
    startProgress: 0.33,
    endProgress: 0.66,
    title: "Design",
    body: "Iconic silhouette. Wide rear stance. Active aerodynamics.",
    highlight: "Carbon Fiber & Aluminium Hybrid Body",
  },
  {
    id: "performance",
    startProgress: 0.66,
    endProgress: 1.0,
    title: "Performance",
    specs: [
      { label: "Engine", value: "3.8L Twin-Turbo Flat-Six" },
      { label: "Power", value: "640 HP" },
      { label: "0–100 km/h", value: "2.7 seconds" },
      { label: "Drive", value: "AWD System" },
      { label: "Top Speed", value: "330 km/h" },
    ],
  },
];

export const fullSpecs = [
  { label: "Engine", value: "3.8L Biturbo" },
  { label: "Displacement", value: "3,745 cc" },
  { label: "Output", value: "640 HP / 470 kW" },
  { label: "Torque", value: "800 Nm" },
  { label: "0–100 km/h", value: "2.7 s" },
  { label: "Top Speed", value: "330 km/h" },
  { label: "Drive", value: "All-Wheel Drive" },
  { label: "Transmission", value: "8-Speed PDK" },
  { label: "Fuel (Combined)", value: "11.6 L/100km" },
  { label: "Weight", value: "1,640 kg" },
  { label: "Wheelbase", value: "2,450 mm" },
  { label: "Year", value: "2024" },
];

export const features = [
  {
    icon: "⚡",
    title: "Sport Chrono Package",
    description:
      "Launch Control delivers max acceleration from a standing start. 0–200 km/h in 8.3 seconds.",
  },
  {
    icon: "🔧",
    title: "PASM Active Suspension",
    description:
      "Porsche Active Suspension Management continuously adapts damper forces to the road and driving style.",
  },
  {
    icon: "🛡️",
    title: "Carbon Ceramic Brakes",
    description:
      "PCCB ceramic composite brakes — 30% lighter than cast iron, fade-resistant up to 1,000 °C.",
  },
  {
    icon: "🎯",
    title: "Porsche Torque Vectoring",
    description:
      "PTV Plus with rear-axle mechanical locking differential for maximum traction in every corner.",
  },
];
