
import { useState, useEffect } from "react";
import { Search, X, Pill, Stethoscope, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const doctors = [
  { name: "Dr. Indranil Khatua", specialty: "ENT Specialist", schedule: "Wednesday, 6:30 PM", type: "doctor" },
  { name: "Dr. Md. Nazibullah", specialty: "Child Specialist", schedule: "Thursday, 4:00 PM", type: "doctor" },
];

const medicines = [
  { name: "Antibiotics", category: "Infection Treatment", type: "medicine" },
  { name: "Painkillers", category: "Pain Management", type: "medicine" },
];

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const allItems = [...doctors, ...medicines];

  const filteredItems = query.length > 0
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        ("specialty" in item && item.specialty.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelect = (item: any) => {
    if (item.type === 'doctor') {
      navigate('/doctors');
    } else {
      navigate('/shop');
    }
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <VisuallyHidden><DialogTitle>Search</DialogTitle></VisuallyHidden>
          <VisuallyHidden><DialogDescription>Search for medicines, doctors, or services.</DialogDescription></VisuallyHidden>
        </DialogHeader>

        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search medicines, doctors, services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 text-lg py-6"
            autoFocus
          />
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="p-2">
              {filteredItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {item.type === 'doctor' ? <Stethoscope className="h-4 w-4 text-primary" /> : <Pill className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {'specialty' in item ? item.specialty : item.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">Recent Searches</p>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors text-left">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Blood Test Packages</span>
                </button>
                <button className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors text-left">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cardiologist</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-4 py-3 bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted border">ESC</kbd> to close</span>
          <span>Search powered by Delta HealthCare</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
