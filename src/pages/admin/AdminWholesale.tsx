
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, CheckCircle, XCircle, Store, FileText, Building, Phone, Mail, MapPin } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";

const AdminWholesale = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [quoteResponse, setQuoteResponse] = useState({ quoted_amount: "", quoted_items: [] as any[], notes: "" });

  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-wholesale-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("wholesale_profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: quotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ["admin-quote-requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_requests").select("*, wholesale_profiles(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // ✅ THE FINAL, ROBUST FIX: No optimistic update, just refetch on success.
  const updateProfile = useMutation({
    mutationFn: async ({ id, userId, updates }: { id: string; userId?: string; updates: any }) => {
      const { data, error } = await supabase.from("wholesale_profiles").update(updates).eq("id", id).select().single();
      if (error) throw error;
      if (!data) throw new Error("Update failed: Profile not found.");

      if (updates.is_verified && userId) {
        const { error: roleError } = await supabase.from("user_roles").update({ role: "wholesale" }).eq("user_id", userId);
        if (roleError) throw roleError;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      // This is the most reliable way: just refetch the data from the server.
      queryClient.invalidateQueries({ queryKey: ["admin-wholesale-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      setSelectedProfile(null);
    },
    onError: (error: any) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  const respondToQuote = useMutation({ mutationFn: async ({ id, status, response }: { id: string; status: string; response?: any }) => { const updates: any = { status }; if (status === "quoted" && response) { updates.quoted_amount = parseFloat(response.quoted_amount); updates.quoted_items = response.quoted_items; updates.valid_until = addDays(new Date(), 7).toISOString(); } const { error } = await supabase.from("quote_requests").update(updates).eq("id", id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-quote-requests"] }); toast.success("Quote updated"); setSelectedQuote(null); }, onError: () => toast.error("Failed to update quote"), });
  const filteredProfiles = profiles.filter((p: any) => p.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) || p.email?.toLowerCase().includes(searchQuery.toLowerCase()));
  const pendingProfiles = profiles.filter((p: any) => !p.is_verified && p.is_active);
  const pendingQuotes = quotes.filter((q: any) => q.status === "pending");
  const getStatusBadge = (status: string) => { const colors: Record<string, string> = { pending: "bg-yellow-500", quoted: "bg-blue-500", accepted: "bg-green-500", rejected: "bg-red-500", expired: "bg-gray-500", }; return <Badge className={colors[status] || "bg-gray-500"}>{status}</Badge>; };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold">Wholesale Management</h1><p className="text-muted-foreground">Manage wholesale partners and quote requests</p></div></div>
      <div className="grid grid-cols-4 gap-4"><Card><CardContent className="p-4"><div className="flex items-center gap-3"><Store className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{profiles.length}</p><p className="text-sm text-muted-foreground">Total Partners</p></div></div></CardContent></Card><Card><CardContent className="p-4"><div className="flex items-center gap-3"><CheckCircle className="h-8 w-8 text-green-500" /><div><p className="text-2xl font-bold">{profiles.filter((p: any) => p.is_verified).length}</p><p className="text-sm text-muted-foreground">Verified</p></div></div></CardContent></Card><Card><CardContent className="p-4"><div className="flex items-center gap-3"><Building className="h-8 w-8 text-yellow-500" /><div><p className="text-2xl font-bold">{pendingProfiles.length}</p><p className="text-sm text-muted-foreground">Pending Verification</p></div></div></CardContent></Card><Card><CardContent className="p-4"><div className="flex items-center gap-3"><FileText className="h-8 w-8 text-blue-500" /><div><p className="text-2xl font-bold">{pendingQuotes.length}</p><p className="text-sm text-muted-foreground">Pending Quotes</p></div></div></CardContent></Card></div>
      <Tabs defaultValue="partners">
        <TabsList><TabsTrigger value="partners">Wholesale Partners{pendingProfiles.length > 0 && (<Badge className="ml-2 bg-yellow-500">{pendingProfiles.length}</Badge>)}</TabsTrigger><TabsTrigger value="quotes">Quote Requests{pendingQuotes.length > 0 && (<Badge className="ml-2 bg-blue-500">{pendingQuotes.length}</Badge>)}</TabsTrigger></TabsList>
        <TabsContent value="partners">
          <Card>
            <CardHeader><div className="flex items-center gap-4"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search partners..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/></div></div></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Type</TableHead><TableHead>Contact</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile: any) => (
                    <TableRow key={profile.id}>
                      <TableCell><div><p className="font-medium">{profile.business_name}</p><p className="text-sm text-muted-foreground">GST: {profile.gst_number || "N/A"}</p></div></TableCell>
                      <TableCell className="capitalize">{profile.business_type?.replace("_", " ")}</TableCell>
                      <TableCell><div className="text-sm"><p>{profile.contact_person}</p><p className="text-muted-foreground">{profile.phone}</p></div></TableCell>
                      <TableCell>{profile.business_city}, {profile.business_state}</TableCell>
                      <TableCell>{profile.is_verified ? (<Badge className="bg-green-500">Verified</Badge>) : (<Badge className="bg-yellow-500">Pending</Badge>)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedProfile(profile)}><Eye className="h-4 w-4" /></Button>
                          {!profile.is_verified && profile.is_active && (
                            <>
                              <Button variant="ghost" size="sm" className="text-green-600" onClick={() => updateProfile.mutate({ id: profile.id, userId: profile.user_id, updates: { is_verified: true } })}><CheckCircle className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => updateProfile.mutate({ id: profile.id, userId: profile.user_id, updates: { is_active: false } })}><XCircle className="h-4 w-4" /></Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quotes"><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>Quote ID</TableHead><TableHead>Business</TableHead><TableHead>Items</TableHead><TableHead>Status</TableHead><TableHead>Quoted Amount</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{quotes.map((quote: any) => (<TableRow key={quote.id}><TableCell className="font-mono text-sm">#{quote.id.slice(0, 8)}</TableCell><TableCell>{quote.wholesale_profiles?.business_name || "N/A"}</TableCell><TableCell>{(quote.items as any[])?.length || 0} items</TableCell><TableCell>{getStatusBadge(quote.status)}</TableCell><TableCell>{quote.quoted_amount ? `₹${quote.quoted_amount.toLocaleString()}` : "-"}</TableCell><TableCell>{format(new Date(quote.created_at), "PP")}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => { setSelectedQuote(quote); setQuoteResponse({ quoted_amount: quote.quoted_amount?.toString() || "", quoted_items: quote.items as any[] || [], notes: "", }); }}><Eye className="h-4 w-4" /></Button></TableCell></TableRow>))}</TableBody></Table></CardContent></Card></TabsContent>
      </Tabs>
      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Wholesale Partner Details</DialogTitle></DialogHeader>{selectedProfile && (<div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label className="text-muted-foreground">Business Name</Label><p className="font-medium">{selectedProfile.business_name}</p></div><div><Label className="text-muted-foreground">Type</Label><p className="font-medium capitalize">{selectedProfile.business_type?.replace("_", " ")}</p></div><div><Label className="text-muted-foreground">GST Number</Label><p className="font-medium">{selectedProfile.gst_number || "N/A"}</p></div><div><Label className="text-muted-foreground">Drug License</Label><p className="font-medium">{selectedProfile.drug_license_number || "N/A"}</p></div><div><Label className="text-muted-foreground">Contact Person</Label><p className="font-medium">{selectedProfile.contact_person}</p></div><div><Label className="text-muted-foreground">Phone</Label><p className="font-medium">{selectedProfile.phone}</p></div><div className="col-span-2"><Label className="text-muted-foreground">Address</Label><p className="font-medium">{selectedProfile.business_address}, {selectedProfile.business_city},{selectedProfile.business_state} - {selectedProfile.business_pincode}</p></div></div><div className="grid grid-cols-2 gap-4 pt-4 border-t"><div><Label>Discount Percentage</Label><Input type="number" value={selectedProfile.discount_percentage} onChange={(e) => setSelectedProfile({ ...selectedProfile, discount_percentage: parseFloat(e.target.value) })}/></div><div><Label>Credit Limit</Label><Input type="number" value={selectedProfile.credit_limit} onChange={(e) => setSelectedProfile({ ...selectedProfile, credit_limit: parseFloat(e.target.value) })}/></div></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setSelectedProfile(null)}>Close</Button><Button onClick={() => updateProfile.mutate({ id: selectedProfile.id, updates: { discount_percentage: selectedProfile.discount_percentage, credit_limit: selectedProfile.credit_limit, } })}>Save Changes</Button></div></div>)}</DialogContent></Dialog>
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Quote Request Details</DialogTitle></DialogHeader>{selectedQuote && (<div className="space-y-4"><div><Label className="text-muted-foreground">Requested Items</Label><div className="mt-2 space-y-2">{(selectedQuote.items as any[])?.map((item: any, idx: number) => (<div key={idx} className="flex justify-between p-2 bg-muted/50 rounded"><span>{item.name}</span><span className="font-medium">Qty: {item.quantity}</span></div>))}</div></div>{selectedQuote.notes && (<div><Label className="text-muted-foreground">Customer Notes</Label><p className="mt-1">{selectedQuote.notes}</p></div>)}{selectedQuote.status === "pending" && (<div className="pt-4 border-t space-y-4"><div><Label>Quote Amount (₹)</Label><Input type="number" value={quoteResponse.quoted_amount} onChange={(e) => setQuoteResponse({ ...quoteResponse, quoted_amount: e.target.value })} placeholder="Enter total quoted amount"/></div><div className="flex gap-2"><Button onClick={() => respondToQuote.mutate({ id: selectedQuote.id, status: "quoted", response: quoteResponse })} disabled={!quoteResponse.quoted_amount}>Send Quote</Button><Button variant="destructive" onClick={() => respondToQuote.mutate({ id: selectedQuote.id, status: "rejected" })}>Reject</Button></div></div>)}</div>)}</DialogContent></Dialog>
    </div>
  );
};

export default AdminWholesale;
