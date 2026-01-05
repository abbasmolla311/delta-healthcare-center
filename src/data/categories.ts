import { 
  ShoppingBag, Baby, Bath, Pill, Apple, Droplets, Home, Smile, Heart, 
  Package, Shirt, Dumbbell, Leaf, Beaker, Stethoscope, Scan, 
  Activity, Eye, Ear, Scissors, Sparkles, Hand, FlaskConical,
  Syringe, Bone, Wind, Brain, Thermometer, ShieldCheck, TestTube,
  HeartPulse, Microscope, FileText, User, Utensils, Cookie,
  LucideIcon
} from "lucide-react";

export interface SubCategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
  subcategories: SubCategory[];
}

export interface CategoryGroup {
  name: string;
  slug: string;
  icon: LucideIcon;
  categories: Category[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    name: "General Store",
    slug: "general-store",
    icon: ShoppingBag,
    categories: [
      { name: "Accessories", slug: "accessories", icon: Package, color: "bg-blue-500", subcategories: [] },
      { name: "Baby Care", slug: "baby-care", icon: Baby, color: "bg-pink-500", subcategories: [] },
      { name: "Bathing Needs", slug: "bathing-needs", icon: Bath, color: "bg-cyan-500", subcategories: [] },
      { name: "Health & Nutrition", slug: "health-nutrition", icon: Apple, color: "bg-green-500", subcategories: [] },
      { name: "Dried Fruits & Nuts", slug: "dried-fruits-nuts", icon: Cookie, color: "bg-amber-500", subcategories: [] },
      { name: "Household Needs", slug: "household-needs", icon: Home, color: "bg-orange-500", subcategories: [] },
      { name: "Oral Care", slug: "oral-care", icon: Smile, color: "bg-sky-500", subcategories: [] },
      { name: "Personal Care", slug: "personal-care", icon: Heart, color: "bg-rose-500", subcategories: [] },
      { name: "Sanitary & Hygiene", slug: "sanitary-hygiene", icon: ShieldCheck, color: "bg-purple-500", subcategories: [] },
      { name: "OTC & Health Needs", slug: "otc-health", icon: Pill, color: "bg-emerald-500", subcategories: [] },
      { name: "Food Items", slug: "food-items", icon: Utensils, color: "bg-yellow-500", subcategories: [] },
      { name: "Men's Fashion", slug: "mens-fashion", icon: Shirt, color: "bg-indigo-500", subcategories: [] },
      { name: "Gym Needs", slug: "gym-needs", icon: Dumbbell, color: "bg-red-500", subcategories: [] },
    ]
  },
  {
    name: "Baby Needs",
    slug: "baby-needs",
    icon: Baby,
    categories: [
      { name: "Baby Care", slug: "baby-care", icon: Baby, color: "bg-pink-500", subcategories: [] },
      { name: "Baby Food", slug: "baby-food", icon: Apple, color: "bg-orange-500", subcategories: [] },
    ]
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    icon: Heart,
    categories: [
      { name: "Skin Care", slug: "skin-care", icon: Sparkles, color: "bg-pink-400", subcategories: [] },
      { name: "Sanitary & Hygiene", slug: "sanitary-hygiene", icon: ShieldCheck, color: "bg-purple-500", subcategories: [] },
      { name: "Oral Care", slug: "oral-care", icon: Smile, color: "bg-cyan-500", subcategories: [] },
      { name: "Hair Care", slug: "hair-care", icon: Scissors, color: "bg-amber-600", subcategories: [] },
      { name: "Bath & Body", slug: "bath-body", icon: Bath, color: "bg-blue-400", subcategories: [] },
      { name: "Sexual Wellness", slug: "sexual-wellness", icon: Heart, color: "bg-red-500", subcategories: [] },
      { name: "Deodorants & Perfumes", slug: "deodorants-perfumes", icon: Droplets, color: "bg-violet-500", subcategories: [] },
      { name: "Eyes, Ears & Lips", slug: "eyes-ears-lips", icon: Eye, color: "bg-teal-500", subcategories: [] },
      { name: "Hand, Foot & Nails", slug: "hand-foot-nails", icon: Hand, color: "bg-rose-400", subcategories: [] },
      { name: "Makeup Essentials", slug: "makeup-essentials", icon: Sparkles, color: "bg-fuchsia-500", subcategories: [] },
    ]
  },
  {
    name: "Women Care",
    slug: "women-care",
    icon: Heart,
    categories: [
      { name: "Mother Care", slug: "mother-care", icon: Heart, color: "bg-pink-500", subcategories: [] },
      { name: "Nutrition Needs", slug: "nutrition-needs", icon: Apple, color: "bg-green-500", subcategories: [] },
      { name: "Makeup Essentials", slug: "makeup-essentials", icon: Sparkles, color: "bg-fuchsia-500", subcategories: [] },
      { name: "Sanitary Needs", slug: "sanitary-needs", icon: ShieldCheck, color: "bg-purple-500", subcategories: [] },
    ]
  },
  {
    name: "Health & Nutrition",
    slug: "health-nutrition",
    icon: Apple,
    categories: [
      { name: "Nutritional Foods", slug: "nutritional-foods", icon: Apple, color: "bg-green-500", subcategories: [] },
      { name: "Breakfast Cereals", slug: "breakfast-cereals", icon: Cookie, color: "bg-amber-500", subcategories: [] },
      { name: "Weight Management", slug: "weight-management", icon: Activity, color: "bg-blue-500", subcategories: [] },
    ]
  },
  {
    name: "OTC & Health Needs",
    slug: "otc-health-needs",
    icon: Pill,
    categories: [
      { name: "First Aid", slug: "first-aid", icon: ShieldCheck, color: "bg-red-500", subcategories: [] },
      { name: "Pain Relief", slug: "pain-relief", icon: Thermometer, color: "bg-orange-500", subcategories: [] },
      { name: "Cold Relief", slug: "cold-relief", icon: Wind, color: "bg-blue-400", subcategories: [] },
      { name: "Joint Care", slug: "joint-care", icon: Bone, color: "bg-amber-600", subcategories: [] },
      { name: "Skin & Foot Care", slug: "skin-foot-care", icon: Sparkles, color: "bg-pink-400", subcategories: [] },
      { name: "Digestives", slug: "digestives", icon: Activity, color: "bg-green-500", subcategories: [] },
      { name: "Healthcare Devices", slug: "healthcare-devices", icon: HeartPulse, color: "bg-purple-500", subcategories: [] },
    ]
  },
  {
    name: "Vitamins & Supplements",
    slug: "vitamins-supplements",
    icon: FlaskConical,
    categories: [
      { name: "Sports Supplements", slug: "sports-supplements", icon: Dumbbell, color: "bg-red-500", subcategories: [] },
      { name: "Vitamins & Minerals", slug: "vitamins-minerals", icon: FlaskConical, color: "bg-orange-500", subcategories: [] },
      { name: "Other Supplements", slug: "other-supplements", icon: Pill, color: "bg-green-500", subcategories: [] },
    ]
  },
  {
    name: "Diabetic Needs",
    slug: "diabetic-needs",
    icon: Syringe,
    categories: [
      { name: "Diabetic Testing", slug: "diabetic-testing", icon: TestTube, color: "bg-blue-500", subcategories: [] },
      { name: "Diabetic Nutrition", slug: "diabetic-nutrition", icon: Apple, color: "bg-green-500", subcategories: [] },
      { name: "Diabetic Aids", slug: "diabetic-aids", icon: Syringe, color: "bg-purple-500", subcategories: [] },
    ]
  },
  {
    name: "Ayurvedic",
    slug: "ayurvedic",
    icon: Leaf,
    categories: [
      { name: "Ayurvedic Foods", slug: "ayurvedic-foods", icon: Leaf, color: "bg-green-600", subcategories: [] },
      { name: "Ayurvedic Personal Care", slug: "ayurvedic-personal-care", icon: Heart, color: "bg-emerald-500", subcategories: [] },
      { name: "Ayurvedic Remedies", slug: "ayurvedic-remedies", icon: FlaskConical, color: "bg-lime-600", subcategories: [] },
      { name: "Herbal Supplements", slug: "herbal-supplements", icon: Leaf, color: "bg-teal-500", subcategories: [] },
      { name: "Immunity Boosters", slug: "immunity-boosters", icon: ShieldCheck, color: "bg-green-500", subcategories: [] },
    ]
  },
];

export const pharmacyCategories = [
  { name: "Gastrointestinal", slug: "gastrointestinal", icon: Activity, color: "bg-amber-500" },
  { name: "Cardiovascular", slug: "cardiovascular", icon: HeartPulse, color: "bg-red-500" },
  { name: "Respiratory", slug: "respiratory", icon: Wind, color: "bg-sky-500" },
  { name: "Central Nervous System", slug: "cns", icon: Brain, color: "bg-purple-500" },
  { name: "Musculo-Skeletal", slug: "musculo-skeletal", icon: Bone, color: "bg-orange-500" },
  { name: "Hormones", slug: "hormones", icon: Activity, color: "bg-pink-500" },
  { name: "Infectious Disease", slug: "infectious-disease", icon: ShieldCheck, color: "bg-green-500" },
  { name: "Oncology", slug: "oncology", icon: Microscope, color: "bg-blue-600" },
  { name: "Vitamins & Minerals", slug: "vitamins-minerals", icon: FlaskConical, color: "bg-yellow-500" },
  { name: "Dermatologicals", slug: "dermatologicals", icon: Sparkles, color: "bg-rose-500" },
  { name: "Allergy & Immune", slug: "allergy-immune", icon: ShieldCheck, color: "bg-indigo-500" },
  { name: "Eye Care", slug: "eye-care", icon: Eye, color: "bg-cyan-500" },
];

export const diagnosticCategories = [
  { name: "Diabetes", slug: "diabetes", icon: Syringe, color: "bg-blue-500" },
  { name: "Heart", slug: "heart", icon: HeartPulse, color: "bg-red-500" },
  { name: "Kidney", slug: "kidney", icon: Activity, color: "bg-orange-500" },
  { name: "Liver", slug: "liver", icon: Activity, color: "bg-amber-600" },
  { name: "Thyroid", slug: "thyroid", icon: Activity, color: "bg-purple-500" },
  { name: "Vitamins", slug: "vitamins", icon: FlaskConical, color: "bg-yellow-500" },
  { name: "Bone", slug: "bone", icon: Bone, color: "bg-gray-500" },
  { name: "Fever", slug: "fever", icon: Thermometer, color: "bg-red-400" },
  { name: "Immunity", slug: "immunity", icon: ShieldCheck, color: "bg-green-500" },
  { name: "Anaemia", slug: "anaemia", icon: Droplets, color: "bg-rose-500" },
  { name: "Allergy", slug: "allergy", icon: Wind, color: "bg-sky-400" },
  { name: "Pregnancy", slug: "pregnancy", icon: Baby, color: "bg-pink-500" },
];

export const radiologyCategories = [
  { name: "X-Ray", slug: "x-ray", icon: Scan, color: "bg-gray-600" },
  { name: "MRI", slug: "mri", icon: Scan, color: "bg-blue-600" },
  { name: "CT Scan", slug: "ct-scan", icon: Scan, color: "bg-purple-600" },
  { name: "Ultrasound", slug: "ultrasound", icon: Scan, color: "bg-cyan-500" },
  { name: "Mammography", slug: "mammography", icon: Scan, color: "bg-pink-500" },
  { name: "ECG", slug: "ecg", icon: HeartPulse, color: "bg-red-500" },
  { name: "2D Echo", slug: "2d-echo", icon: HeartPulse, color: "bg-rose-500" },
  { name: "TMT", slug: "tmt", icon: Activity, color: "bg-orange-500" },
];

export const doctorSpecialties = [
  { name: "General Medicine", slug: "general-medicine", icon: Stethoscope, color: "bg-blue-500" },
  { name: "Paediatrics", slug: "paediatrics", icon: Baby, color: "bg-pink-500" },
  { name: "Gynaecology", slug: "gynaecology", icon: Heart, color: "bg-rose-500" },
  { name: "Diabetology", slug: "diabetology", icon: Syringe, color: "bg-orange-500" },
  { name: "Cardiology", slug: "cardiology", icon: HeartPulse, color: "bg-red-500" },
  { name: "Orthopaedics", slug: "orthopaedics", icon: Bone, color: "bg-amber-600" },
  { name: "Dermatology", slug: "dermatology", icon: Sparkles, color: "bg-purple-500" },
  { name: "Pulmonology", slug: "pulmonology", icon: Wind, color: "bg-sky-500" },
  { name: "ENT", slug: "ent", icon: Ear, color: "bg-teal-500" },
  { name: "Neurology", slug: "neurology", icon: Brain, color: "bg-indigo-500" },
];
