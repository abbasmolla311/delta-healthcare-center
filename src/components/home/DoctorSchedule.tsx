import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Stethoscope, Star, ArrowRight } from "lucide-react";

const visitingDoctors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    specialty: "General Medicine",
    qualification: "MBBS, MD",
    visitDays: ["Monday", "Wednesday", "Friday"],
    timing: "10:00 AM - 2:00 PM",
    rating: 4.8,
    fee: 300,
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialty: "Gynaecology",
    qualification: "MBBS, DGO",
    visitDays: ["Tuesday", "Thursday"],
    timing: "11:00 AM - 1:00 PM",
    rating: 4.9,
    fee: 400,
  },
  {
    id: 3,
    name: "Dr. Amit Patel",
    specialty: "Cardiology",
    qualification: "MBBS, DM Cardiology",
    visitDays: ["Saturday"],
    timing: "10:00 AM - 12:00 PM",
    rating: 4.7,
    fee: 500,
  },
  {
    id: 4,
    name: "Dr. Sneha Gupta",
    specialty: "Dermatology",
    qualification: "MBBS, MD Dermatology",
    visitDays: ["Monday", "Thursday"],
    timing: "4:00 PM - 6:00 PM",
    rating: 4.8,
    fee: 350,
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    specialty: "Orthopaedics",
    qualification: "MBBS, MS Ortho",
    visitDays: ["Wednesday", "Saturday"],
    timing: "5:00 PM - 7:00 PM",
    rating: 4.6,
    fee: 400,
  },
  {
    id: 6,
    name: "Dr. Anita Desai",
    specialty: "Paediatrics",
    qualification: "MBBS, DCH",
    visitDays: ["Tuesday", "Friday"],
    timing: "10:00 AM - 1:00 PM",
    rating: 4.9,
    fee: 350,
  },
];

const getDayColor = (day: string) => {
  const colors: Record<string, string> = {
    Monday: "bg-blue-100 text-blue-700",
    Tuesday: "bg-green-100 text-green-700",
    Wednesday: "bg-purple-100 text-purple-700",
    Thursday: "bg-orange-100 text-orange-700",
    Friday: "bg-pink-100 text-pink-700",
    Saturday: "bg-teal-100 text-teal-700",
    Sunday: "bg-red-100 text-red-700",
  };
  return colors[day] || "bg-gray-100 text-gray-700";
};

const DoctorSchedule = () => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayDoctors = visitingDoctors.filter(doc => doc.visitDays.includes(today));

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Visiting Doctors</h2>
          <p className="text-muted-foreground text-sm">Book appointment with specialist doctors</p>
        </div>
        <Link to="/doctors">
          <Button variant="outline" className="gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Today's Doctors */}
      {todayDoctors.length > 0 && (
        <div className="mb-6 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-secondary" />
            <span className="font-semibold text-secondary">Today's Visiting Doctors ({today})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {todayDoctors.map(doc => (
              <Badge key={doc.id} variant="secondary" className="py-1.5">
                {doc.name} - {doc.specialty} ({doc.timing})
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visitingDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{doctor.name}</h3>
                  <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                  <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{doctor.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {doctor.visitDays.map((day) => (
                    <Badge 
                      key={day} 
                      variant="outline" 
                      className={`text-xs ${getDayColor(day)}`}
                    >
                      {day.slice(0, 3)}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{doctor.timing}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <span className="text-sm font-bold text-primary">₹{doctor.fee}</span>
                <Link to={`/consult?doctor=${doctor.id}`}>
                  <Button size="sm">Book Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default DoctorSchedule;
