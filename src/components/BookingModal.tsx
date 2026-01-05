import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Video, Phone, MessageCircle, Building, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  consultation_fee: number;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
  "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM"
];

const BookingModal = ({ open, onClose, doctor }: BookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [mode, setMode] = useState<"video" | "audio" | "chat" | "offline">("video");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!user) {
      toast.error("Please login to book an appointment");
      navigate("/auth");
      return;
    }

    if (!doctor || !date || !time) {
      toast.error("Please select date and time");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          doctor_id: doctor.id,
          appointment_date: format(date, "yyyy-MM-dd"),
          appointment_time: time,
          consultation_mode: mode,
          consultation_fee: doctor.consultation_fee || 500,
          symptoms: symptoms || null,
          status: "pending",
          payment_status: "pending",
        });

      if (error) throw error;

      toast.success("Appointment booked successfully!");
      onClose();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              👨‍⚕️
            </div>
            <div>
              <p className="font-semibold">{doctor.name}</p>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              <p className="text-sm font-medium text-primary">₹{doctor.consultation_fee || 500}</p>
            </div>
          </div>

          {/* Consultation Mode */}
          <div>
            <Label className="mb-3 block">Consultation Type</Label>
            <RadioGroup 
              value={mode} 
              onValueChange={(v) => setMode(v as any)}
              className="grid grid-cols-2 gap-2"
            >
              <div className={cn(
                "flex items-center gap-2 p-3 border rounded-lg cursor-pointer",
                mode === "video" && "border-primary bg-primary/5"
              )}>
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                  <Video className="h-4 w-4" />
                  Video
                </Label>
              </div>
              <div className={cn(
                "flex items-center gap-2 p-3 border rounded-lg cursor-pointer",
                mode === "audio" && "border-primary bg-primary/5"
              )}>
                <RadioGroupItem value="audio" id="audio" />
                <Label htmlFor="audio" className="flex items-center gap-2 cursor-pointer">
                  <Phone className="h-4 w-4" />
                  Audio
                </Label>
              </div>
              <div className={cn(
                "flex items-center gap-2 p-3 border rounded-lg cursor-pointer",
                mode === "chat" && "border-primary bg-primary/5"
              )}>
                <RadioGroupItem value="chat" id="chat" />
                <Label htmlFor="chat" className="flex items-center gap-2 cursor-pointer">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Label>
              </div>
              <div className={cn(
                "flex items-center gap-2 p-3 border rounded-lg cursor-pointer",
                mode === "offline" && "border-primary bg-primary/5"
              )}>
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline" className="flex items-center gap-2 cursor-pointer">
                  <Building className="h-4 w-4" />
                  In-Person
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Selection */}
          <div>
            <Label className="mb-3 block">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div>
            <Label className="mb-3 block">Select Time</Label>
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={cn(
                    "p-2 text-xs rounded border transition-colors",
                    time === slot 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : "hover:border-primary/50"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <Label htmlFor="symptoms">Symptoms (Optional)</Label>
            <Textarea
              id="symptoms"
              placeholder="Describe your symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={2}
            />
          </div>

          {/* Book Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleBook}
            disabled={!date || !time || loading}
          >
            {loading ? "Booking..." : `Book for ₹${doctor.consultation_fee || 500}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
