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

const mockLabTests = [
  { id: 1, name: "Complete Blood Count (CBC)", category: "Blood", price: 299, mrp: 450, reportTime: "6 hours", homeCollection: true, status: "active" },
  { id: 2, name: "Lipid Profile", category: "Heart", price: 399, mrp: 600, reportTime: "12 hours", homeCollection: true, status: "active" },
  { id: 3, name: "Thyroid Profile (T3, T4, TSH)", category: "Thyroid", price: 449, mrp: 700, reportTime: "24 hours", homeCollection: true, status: "active" },
  { id: 4, name: "Vitamin D Total", category: "Vitamins", price: 699, mrp: 1200, reportTime: "24 hours", homeCollection: true, status: "inactive" },
];

const AdminLabTests = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = mockLabTests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Lab Tests</h1>
          <p className="text-muted-foreground">Manage available lab tests</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Test
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
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
                <TableHead>Test Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Report Time</TableHead>
                <TableHead>Home Collection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>{test.category}</TableCell>
                  <TableCell className="font-semibold">₹{test.price}</TableCell>
                  <TableCell className="text-muted-foreground">₹{test.mrp}</TableCell>
                  <TableCell>{test.reportTime}</TableCell>
                  <TableCell>
                    <Badge variant={test.homeCollection ? "default" : "outline"}>
                      {test.homeCollection ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={test.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                      {test.status}
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

export default AdminLabTests;
