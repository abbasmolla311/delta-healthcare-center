import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const mockScans = [
  { id: 1, name: "Chest X-Ray", type: "X-Ray", price: 300, mrp: 500, reportTime: "2 hours", prescription: false, status: "active" },
  { id: 2, name: "Abdomen Ultrasound", type: "Ultrasound", price: 800, mrp: 1200, reportTime: "Same day", prescription: false, status: "active" },
  { id: 3, name: "Brain MRI", type: "MRI", price: 5000, mrp: 8000, reportTime: "24 hours", prescription: true, status: "active" },
  { id: 4, name: "CT Scan Chest", type: "CT Scan", price: 2500, mrp: 4000, reportTime: "24 hours", prescription: true, status: "inactive" },
];

const AdminScans = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScans = mockScans.filter(scan =>
    scan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scan.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Scans</h1>
          <p className="text-muted-foreground">Manage imaging services</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Scan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scans..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Report Time</TableHead>
                <TableHead>Prescription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="font-medium">{scan.name}</TableCell>
                  <TableCell>{scan.type}</TableCell>
                  <TableCell className="font-semibold">₹{scan.price}</TableCell>
                  <TableCell className="text-muted-foreground">₹{scan.mrp}</TableCell>
                  <TableCell>{scan.reportTime}</TableCell>
                  <TableCell>
                    <Badge variant={scan.prescription ? "destructive" : "outline"}>
                      {scan.prescription ? "Required" : "Not Required"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={scan.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                      {scan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
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

export default AdminScans;
