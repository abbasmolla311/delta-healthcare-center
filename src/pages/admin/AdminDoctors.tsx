
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Star, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AdminDoctors = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", qualification: "", experience: 0, fee: 0 });

  const { data: doctors = [], isLoading } = useQuery({ /* ... */ });
  const { mutate: addDoctor, isLoading: isAdding } = useMutation({ /* ... */ });
  const { mutate: deleteDoctor } = useMutation({ /* ... */ });

  const handleAddSubmit = (e) => { /* ... */ };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading doctors...</div>;

  return (
    <div className="space-y-6">
      {/* ... Dialog and Header ... */}

      <Card>
        <CardHeader>{/* ... Search Input ... */}</CardHeader>
        <CardContent>
          <Table>
            {/* ✅ THIS IS THE FIX: Added the missing TableHeader content */}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead className="text-right">Experience</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.qualification}</TableCell>
                  <TableCell className="text-right">{doctor.experience} yrs</TableCell>
                  <TableCell className="text-right">₹{doctor.fee}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal/></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="h-4 w-4 mr-2"/>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteDoctor(doctor.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDoctors;
