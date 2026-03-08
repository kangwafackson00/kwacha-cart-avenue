import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, Package, Users, ShoppingCart } from "lucide-react";

const AdminDashboard = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, products: 0, customers: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    if (!user || !isAdmin) return;
    const load = async () => {
      setLoadingData(true);
      const [productsRes, ordersRes, rolesRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "customer"),
      ]);
      const orders = ordersRes.data || [];
      const revenue = orders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
      setStats({
        revenue,
        products: productsRes.count || 0,
        customers: rolesRes.count || 0,
        orders: orders.length,
      });
      setRecentOrders(orders.slice(0, 5));
      setLoadingData(false);
    };
    load();
  }, [user, isAdmin]);

  if (authLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const formatPrice = (p: number) => `ZMW ${Number(p).toLocaleString("en-ZM")}`;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar activeView={activeView} onNavigate={setActiveView} />
        <div className="flex-1 flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </header>

          <main className="flex-1 p-6">
            {activeView === "overview" && (
              <div className="space-y-6">
                {loadingData ? (
                  <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <StatCard icon={DollarSign} title="Total Revenue" value={formatPrice(stats.revenue)} />
                      <StatCard icon={Package} title="Products" value={stats.products.toString()} />
                      <StatCard icon={Users} title="Customers" value={stats.customers.toString()} />
                      <StatCard icon={ShoppingCart} title="Orders" value={stats.orders.toString()} />
                    </div>
                    <Card>
                      <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
                      <CardContent>
                        {recentOrders.length === 0 ? (
                          <p className="text-muted-foreground">No orders yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {recentOrders.map((o) => (
                              <div key={o.id} className="flex items-center justify-between rounded-md border p-3">
                                <div>
                                  <p className="font-mono text-xs text-muted-foreground">{o.id.slice(0, 8)}</p>
                                  <p className="text-sm">{new Date(o.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatPrice(o.total)}</p>
                                  <p className="text-xs capitalize text-muted-foreground">{o.status}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {activeView === "products" && <AdminProducts />}
            {activeView === "orders" && <AdminOrders />}
            {activeView === "users" && <AdminUsers />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const StatCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-6">
      <div className="rounded-full bg-primary/10 p-3"><Icon className="h-5 w-5 text-primary" /></div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

// --- Admin Products ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", condition: "New", inventory: "", featured: false });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", condition: "New", inventory: "", featured: false });
    setEditing(null);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", price: String(p.price), condition: p.condition, inventory: String(p.inventory), featured: p.featured });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      condition: form.condition,
      inventory: parseInt(form.inventory) || 0,
      featured: form.featured,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product updated" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product created" });
    }
    setDialogOpen(false);
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const formatPrice = (p: number) => `ZMW ${Number(p).toLocaleString("en-ZM")}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="accent" className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price (ZMW)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>Inventory</Label><Input type="number" value={form.inventory} onChange={(e) => setForm({ ...form, inventory: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Condition</Label>
                  <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Used">Used</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                    Featured
                  </label>
                </div>
              </div>
              <Button variant="accent" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : products.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No products yet. Add your first product.</CardContent></Card>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{formatPrice(p.price)}</TableCell>
                  <TableCell>{p.inventory}</TableCell>
                  <TableCell><Badge variant="outline">{p.condition}</Badge></TableCell>
                  <TableCell>{p.featured ? <Badge className="bg-accent text-accent-foreground">Yes</Badge> : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

// --- Admin Orders ---
const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    toast({ title: `Order marked as ${status}` });
    fetchOrders();
  };

  const formatPrice = (p: number) => `ZMW ${Number(p).toLocaleString("en-ZM")}`;

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Orders</h2>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : orders.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No orders yet.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
                    <p className="text-sm">{new Date(o.created_at).toLocaleDateString()}</p>
                    <p className="mt-1 text-lg font-bold">{formatPrice(o.total)}</p>
                    <p className="text-xs text-muted-foreground">{o.order_items?.length || 0} item(s) · {o.payment_method || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Admin Users ---
const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("profiles").select("*, user_roles(role)");
      setUsers(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : users.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No users yet.</CardContent></Card>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role(s)</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                  <TableCell>{u.city || "—"}</TableCell>
                  <TableCell>{u.phone || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {u.user_roles?.map((r: any) => (
                        <Badge key={r.role} variant="outline" className="capitalize">{r.role}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
