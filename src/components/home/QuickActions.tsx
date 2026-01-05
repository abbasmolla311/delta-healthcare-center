import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Pill, TestTube, Stethoscope, Scan, FileText, 
  Phone, MessageCircle, Building2
} from "lucide-react";

const quickActions = [
  {
    name: "Order Medicines",
    description: "Get medicines delivered",
    icon: Pill,
    color: "bg-blue-500",
    link: "/shop",
  },
  {
    name: "Lab Tests",
    description: "Book tests at home",
    icon: TestTube,
    color: "bg-green-500",
    link: "/lab-tests",
  },
  {
    name: "Consult Doctor",
    description: "Online consultations",
    icon: Stethoscope,
    color: "bg-purple-500",
    link: "/consult",
  },
  {
    name: "Book Scan",
    description: "X-Ray, MRI, CT Scan",
    icon: Scan,
    color: "bg-orange-500",
    link: "/scan-booking",
  },
  {
    name: "Upload Prescription",
    description: "Order via prescription",
    icon: FileText,
    color: "bg-teal-500",
    link: "/upload-prescription",
  },
  {
    name: "Visit Store",
    description: "Find our location",
    icon: Building2,
    color: "bg-amber-500",
    link: "/contact",
  },
];

const QuickActions = () => {
  return (
    <section className="py-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {quickActions.map((action) => (
          <Link key={action.name} to={action.link}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-transparent hover:border-primary/20 h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-semibold">{action.name}</p>
                <p className="text-xs text-muted-foreground hidden md:block">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
