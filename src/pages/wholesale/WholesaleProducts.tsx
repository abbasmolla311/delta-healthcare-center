
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, FileText } from "lucide-react";
import { toast } from "sonner";

const WholesaleProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["wholesale-products"],
    queryFn: async () => {
      // ✅ THE FIX: Fetching only products where category is 'Wholesale'
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price, stock_quantity")
        .eq("category", "Wholesale");

      if (error) throw error;
      return data;
    },
  });

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleGenerateQuote = () => {
    if (selectedProducts.size === 0) {
      toast.error("Please select at least one product to generate a quote.");
      return;
    }
    toast.info(`Generating quote for ${selectedProducts.size} products...`);
    console.log("Selected Product IDs:", Array.from(selectedProducts));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Browse Wholesale Products</h1>
          <p className="text-muted-foreground">Select products to include in your quote request.</p>
        </div>
        <Button onClick={handleGenerateQuote} disabled={selectedProducts.size === 0}>
          <FileText className="h-4 w-4 mr-2"/>
          Generate Quote ({selectedProducts.size})
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search wholesale products..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map(product => (
                <TableRow key={product.id} className={selectedProducts.has(product.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.has(product.id)}
                      onCheckedChange={() => handleSelectProduct(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                  <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock_quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WholesaleProducts;
