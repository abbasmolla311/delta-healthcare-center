import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Home, ArrowRight, TestTube } from "lucide-react";
import { useHealthPackages } from "@/hooks/useProducts";

const fallbackPackages = [
  {
    id: "1",
    name: "Basic Health Checkup",
    total_tests: 35,
    discounted_price: 999,
    original_price: 2500,
    is_popular: true,
    tests_included: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Blood Sugar"],
  },
  {
    id: "2",
    name: "Comprehensive Health Package",
    total_tests: 72,
    discounted_price: 1999,
    original_price: 5000,
    is_popular: true,
    tests_included: ["All Basic Tests", "Thyroid Profile", "Vitamin D & B12", "Iron Studies", "Urine Analysis"],
  },
  {
    id: "3",
    name: "Diabetes Care Package",
    total_tests: 28,
    discounted_price: 1299,
    original_price: 3000,
    is_popular: false,
    tests_included: ["HbA1c", "Fasting Glucose", "Post Prandial", "Kidney Function", "Lipid Profile"],
  },
  {
    id: "4",
    name: "Heart Care Package",
    total_tests: 42,
    discounted_price: 2499,
    original_price: 6000,
    is_popular: false,
    tests_included: ["Lipid Profile", "ECG", "Cardiac Markers", "Homocysteine", "hs-CRP"],
  },
];

const HealthPackages = () => {
  const { data: dbPackages = [] } = useHealthPackages();
  const packages = dbPackages.length > 0 ? dbPackages : fallbackPackages;

  const getDiscount = (original: number | null, discounted: number) => {
    if (!original || original <= discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Health Packages</h2>
          <p className="text-muted-foreground text-sm">Comprehensive health checkups at best prices</p>
        </div>
        <Link to="/lab-tests">
          <Button variant="outline" className="gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.slice(0, 4).map((pkg: any) => {
          const discount = getDiscount(pkg.original_price, pkg.discounted_price);
          return (
            <Card key={pkg.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {pkg.is_popular && (
                <Badge className="absolute top-3 right-3 bg-orange-500">Popular</Badge>
              )}
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-2">
                  <TestTube className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Includes {pkg.total_tests} tests</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {(pkg.tests_included || []).slice(0, 5).map((test: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                      <span className="line-clamp-1">{test}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Home className="h-3 w-3" />
                  <span>Home collection available</span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">₹{pkg.discounted_price}</span>
                  {pkg.original_price && (
                    <span className="text-sm text-muted-foreground line-through">₹{pkg.original_price}</span>
                  )}
                  {discount > 0 && (
                    <Badge variant="secondary">{discount}% OFF</Badge>
                  )}
                </div>
                <Link to={`/lab-tests?package=${pkg.id}`}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default HealthPackages;
