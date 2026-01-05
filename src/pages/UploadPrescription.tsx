import { useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, Camera, FileText, Image, Check, 
  AlertCircle, Shield, Clock, Pill
} from "lucide-react";
import { toast } from "sonner";

const UploadPrescription = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("prescriptions")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("prescriptions")
        .getPublicUrl(fileName);

      // Save prescription record
      const { error: dbError } = await supabase
        .from("prescriptions")
        .insert({
          user_id: user.id,
          image_url: urlData.publicUrl,
          notes: notes || null,
          status: "pending",
        });

      if (dbError) throw dbError;

      toast.success("Prescription uploaded successfully! Our team will review it shortly.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload prescription");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Upload Prescription</h1>
            <p className="text-muted-foreground mb-8">
              Upload your prescription and we'll deliver the medicines to your doorstep
            </p>

            {/* Upload Area */}
            <Card className="mb-6">
              <CardContent className="p-6">
                {preview ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img 
                        src={preview} 
                        alt="Prescription preview" 
                        className="w-full max-h-96 object-contain rounded-lg border"
                      />
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">{selectedFile?.name}</span>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Upload Prescription</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, or PDF (max 5MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button 
                variant="outline" 
                className="h-auto py-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Image className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Gallery</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Camera className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Camera</span>
                </div>
              </Button>
            </div>

            {/* Notes */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any special instructions or notes for our pharmacist..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Prescription
                </>
              )}
            </Button>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">100% Genuine</p>
                  <p className="text-xs text-muted-foreground">All medicines are verified</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Quick Review</p>
                  <p className="text-xs text-muted-foreground">Processed within 2 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Pill className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Best Prices</p>
                  <p className="text-xs text-muted-foreground">Up to 25% discount</p>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Prescription Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-secondary mt-0.5" />
                    Prescription should be valid (issued within last 6 months)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-secondary mt-0.5" />
                    Doctor's name, signature, and registration number should be visible
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-secondary mt-0.5" />
                    Patient's name and date should be clearly mentioned
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-secondary mt-0.5" />
                    Medicine names and dosage should be readable
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadPrescription;
