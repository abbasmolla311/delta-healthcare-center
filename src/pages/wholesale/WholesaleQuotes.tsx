
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Send } from "lucide-react";
import { toast } from "sonner";

const WholesaleQuotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quoteItems, setQuoteItems] = useState([{ product_name: "", quantity: 1, notes: "" }]);
  const [generalNotes, setGeneralNotes] = useState("");

  const { data: pastQuotes = [], isLoading } = useQuery({
    queryKey: ["wholesale-quotes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("quote_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { mutate: submitQuote, isLoading: isSubmitting } = useMutation({
    mutationFn: async () => {
        if (!user) throw new Error("User not logged in");
        const { error } = await supabase.from("quote_requests").insert({ user_id: user.id, items: quoteItems, notes: generalNotes, status: 'pending' });
        if(error) throw error;
    },
    onSuccess: () => {
        toast.success("Quote request submitted successfully!");
        queryClient.invalidateQueries(["wholesale-quotes", user?.id]);
        setQuoteItems([{ product_name: "", quantity: 1, notes: "" }]);
        setGeneralNotes("");
    },
    onError: (error) => toast.error(`Submission failed: ${error.message}`)
  });

  const handleItemChange = (index, field, value) => {
    const newItems = [...quoteItems];
    newItems[index][field] = value;
    setQuoteItems(newItems);
  };

  const addQuoteItem = () => setQuoteItems([...quoteItems, { product_name: "", quantity: 1, notes: "" }]);
  const removeQuoteItem = (index) => setQuoteItems(quoteItems.filter((_, i) => i !== index));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quote Request</CardTitle>
          <CardDescription>Add products and quantities to get a custom quote from our team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quoteItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <Input placeholder="Product Name or ID" value={item.product_name} onChange={(e) => handleItemChange(index, 'product_name', e.target.value)} className="flex-1" />
              <Input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} className="w-24" />
              <Button variant="destructive" size="icon" onClick={() => removeQuoteItem(index)}><Minus className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" onClick={addQuoteItem}><Plus className="h-4 w-4 mr-2"/>Add another item</Button>
          <Textarea placeholder="Add any general notes for your quote request..." value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)} />
          <Button onClick={submitQuote} disabled={isSubmitting}><Send className="h-4 w-4 mr-2"/>{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Past Quote Requests</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Items</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={3}>Loading quotes...</TableCell></TableRow>}
              {pastQuotes.map(quote => (
                <TableRow key={quote.id}>
                  <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{quote.items.length}</TableCell>
                  <TableCell><Badge>{quote.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WholesaleQuotes;
