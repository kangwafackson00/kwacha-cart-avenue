import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Package, Heart, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const CustomerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingData(true);
      const [profileRes, ordersRes, wishlistRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("orders").select("*, order_items(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("wishlists").select("*, products(*)").eq("user_id", user.id),
      ]);
      setProfile(profileRes.data);
      setOrders(ordersRes.data || []);
      setWishlist(wishlistRes.data || []);
      setLoadingData(false);
    };
    load();
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
      city: profile.city,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    await supabase.from("wishlists").delete().eq("id", wishlistId);
    setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
    toast({ title: "Removed from wishlist" });
  };

  if (authLoading) return <MainLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></MainLayout>;
  if (!user) return <Navigate to="/login" replace />;

  const formatPrice = (p: number) => `ZMW ${Number(p).toLocaleString("en-ZM")}`;

  return (
    <MainLayout>
      <div className="marketplace-container py-8">
        <h1 className="mb-6 text-2xl font-bold">My Account</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" />Orders</TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2"><Heart className="h-4 w-4" />Wishlist</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : (
                  <form onSubmit={handleProfileSave} className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input id="full_name" value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email || ""} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={profile?.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+260..." />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={profile?.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="Lusaka" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={profile?.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Street address" />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" variant="accent" disabled={saving}>
                        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : orders.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No orders yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge className={statusColor[order.status] || ""}>{order.status}</Badge>
                            </TableCell>
                            <TableCell>{order.order_items?.length || 0}</TableCell>
                            <TableCell className="text-right font-medium">{formatPrice(order.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader><CardTitle>My Wishlist</CardTitle></CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : wishlist.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Your wishlist is empty.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-square bg-muted">
                          {item.products?.images?.[0] && (
                            <img src={item.products.images[0]} alt={item.products.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{item.products?.name}</h3>
                          <p className="text-sm font-bold text-primary">{formatPrice(item.products?.price || 0)}</p>
                          <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => removeFromWishlist(item.id)}>
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CustomerDashboard;
