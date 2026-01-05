import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDoctors } from "@/hooks/useProducts";
import BookingModal from "@/components/BookingModal";
import { 
  Search, Video, MessageCircle, Phone, Star, Clock, 
  Calendar, Shield, Award, Heart, Brain, Baby, 
  Bone, Stethoscope, Eye, Smile
} from "lucide-react";

const specialties = [
  { name: "General Physician", icon: Stethoscope, doctors: 25, color: "bg-blue-100 text-blue-600" },
  { name: "Dermatologist", icon: Smile, doctors: 12, color: "bg-pink-100 text-pink-600" },
  { name: "Gynecologist", icon: Heart, doctors: 15, color: "bg-red-100 text-red-600" },
  { name: "Pediatrician", icon: Baby, doctors: 18, color: "bg-yellow-100 text-yellow-600" },
  { name: "Orthopedic", icon: Bone, doctors: 10, color: "bg-orange-100 text-orange-600" },
  { name: "Cardiologist", icon: Heart, doctors: 8, color: "bg-red-100 text-red-600" },
  { name: "Neurologist", icon: Brain, doctors: 6, color: "bg-purple-100 text-purple-600" },
  { name: "Ophthalmologist", icon: Eye, doctors: 9, color: "bg-green-100 text-green-600" },
];

// Fallback doctors when database is empty
const fallbackDoctors = [
  { id: "1", name: "Dr. Amit Kumar", specialty: "General Physician", qualification: "MBBS, MD", experience_years: 15, rating: 4.9, total_reviews: 1234, consultation_fee: 500, languages: ["English", "Hindi", "Bengali"], profile_image: "👨‍⚕️" },
  { id: "2", name: "Dr. Priya Sharma", specialty: "Dermatologist", qualification: "MBBS, MD (Dermatology)", experience_years: 12, rating: 4.8, total_reviews: 892, consultation_fee: 600, languages: ["English", "Hindi"], profile_image: "👩‍⚕️" },
  { id: "3", name: "Dr. Arpita Chakraborty", specialty: "Gynecologist", qualification: "MBBS, MS (OBG)", experience_years: 18, rating: 4.9, total_reviews: 1567, consultation_fee: 700, languages: ["English", "Bengali"], profile_image: "👩‍⚕️" },
  { id: "4", name: "Dr. Aritra Batbyal", specialty: "Pediatrician", qualification: "MBBS, MD (Pediatrics)", experience_years: 10, rating: 4.7, total_reviews: 678, consultation_fee: 500, languages: ["English", "Hindi", "Bengali"], profile_image: "👨‍⚕️" },
  { id: "5", name: "Dr. D.P. Mandal", specialty: "Cardiologist", qualification: "MBBS, DM (Cardiology)", experience_years: 22, rating: 4.9, total_reviews: 2134, consultation_fee: 1000, languages: ["English", "Hindi"], profile_image: "👨‍⚕️" },
  { id: "6", name: "Dr. Ashish Jha", specialty: "Neurologist", qualification: "MBBS, DM (Neurology)", experience_years: 16, rating: 4.8, total_reviews: 945, consultation_fee: 900, languages: ["English", "Hindi"], profile_image: "👨‍⚕️" },
];

const Consult = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<any>(null);
  
  const { data: doctors, isLoading } = useDoctors(selectedSpecialty || undefined);
  
  const displayDoctors = doctors && doctors.length > 0 ? doctors : fallbackDoctors;

  const filteredDoctors = displayDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Badge className="mb-4 bg-primary">Consult in 60 seconds</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Consult Top Doctors Online
              </h1>
              <p className="text-muted-foreground mb-6">
                Video, Audio, or Chat consultations with verified doctors. Get e-prescriptions instantly.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search doctors, specialties..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Consultation Types */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Video className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Video Consult</h3>
                <p className="text-sm text-muted-foreground">Face-to-face with doctor</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20 hover:border-secondary">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Phone className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold mb-1">Audio Consult</h3>
                <p className="text-sm text-muted-foreground">Talk over phone call</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-accent/20 hover:border-accent">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Chat Consult</h3>
                <p className="text-sm text-muted-foreground">Text-based consultation</p>
              </CardContent>
            </Card>
          </div>

          {/* Specialties */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Choose Specialty</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {specialties.map((specialty) => (
                <button
                  key={specialty.name}
                  onClick={() => setSelectedSpecialty(selectedSpecialty === specialty.name ? null : specialty.name)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedSpecialty === specialty.name 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${specialty.color}`}>
                    <specialty.icon className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-xs text-center line-clamp-1">{specialty.name}</p>
                  <p className="text-xs text-muted-foreground text-center">{specialty.doctors} doctors</p>
                </button>
              ))}
            </div>
          </section>

          {/* Doctors List */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Available Doctors</h2>
              {selectedSpecialty && (
                <Button variant="outline" size="sm" onClick={() => setSelectedSpecialty(null)}>
                  Clear Filter
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 bg-muted/30 animate-pulse h-32"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                        <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                        <div className="h-8 bg-muted animate-pulse rounded mt-4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor: any) => (
                  <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-md">
                            {doctor.profile_image || "👨‍⚕️"}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{doctor.name}</h3>
                            <p className="text-sm text-primary">{doctor.specialty}</p>
                            <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{doctor.rating || 4.5}</span>
                              <span className="text-xs text-muted-foreground">({doctor.total_reviews || 100} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-primary" />
                            <span>{doctor.experience_years || 5} years exp.</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-secondary" />
                            <span>Available</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-primary">₹{doctor.consultation_fee || 500}</span>
                            <span className="text-sm text-muted-foreground"> / consultation</span>
                          </div>
                          <Button onClick={() => setBookingDoctor(doctor)}>Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Features */}
          <section className="bg-muted/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Why Consult with Us?</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Verified Doctors</h3>
                <p className="text-sm text-muted-foreground">All doctors are verified with proper credentials</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Instant Consult</h3>
                <p className="text-sm text-muted-foreground">Connect with doctors within 60 seconds</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Easy Follow-ups</h3>
                <p className="text-sm text-muted-foreground">Free follow-up within 7 days</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">E-Prescription</h3>
                <p className="text-sm text-muted-foreground">Get digital prescriptions instantly</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal 
        open={!!bookingDoctor} 
        onClose={() => setBookingDoctor(null)} 
        doctor={bookingDoctor}
      />
    </div>
  );
};

export default Consult;
