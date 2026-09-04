import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  TrendingUp,
  Shield,
  MapPin,
  Database,
  Activity,
  Eye,
  Edit,
  Trash2,
  Crown,
  UserPlus,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useAuthComplete } from '@/hooks/useAuthComplete';
import { User, UserRole } from '@/types/auth';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAgriculteurRequest } from '@/hooks/useAgriculteurRequest';
import { fetchParcelles } from '@/lib/agricultureApi';

interface AdminStats {
  totalUsers: number;
  totalFarmers: number;
  totalVisitors: number;
  totalParcels: number;
  activeFarmers: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

const AdminDashboardPage = () => {
  const { user, changeUserRole, token } = useAuthComplete();
  const {
    requests,
    loadAllRequests,
    approveRequest,
    rejectRequest,
    isLoading,
  } = useAgriculteurRequest();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalFarmers: 0,
    totalVisitors: 0,
    totalParcels: 0,
    activeFarmers: 0,
    systemHealth: 'good'
  });
  const [users, setUsers] = useState<User[]>([]);

  const normalizeApiUser = (item: any): User => ({
    id: String(item.id),
    nom: item.nom || '',
    prenom: item.prenom || '',
    email: item.email || '',
    role: item.role === 'admin' ? 'ADMIN' : item.role === 'farmer' ? 'AGRICULTEUR' : 'VISITEUR',
    account_status: item.account_status || (item.est_actif ? 'approved' : 'pending'),
    telephone: item.telephone || '',
    region: item.region || '',
    adresse: item.adresse || '',
    est_actif: item.est_actif ?? true,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
  });

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) {
        setUsers([]);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/auth/users/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Impossible de charger les utilisateurs');
        }

        const payload = await response.json();
        const list = Array.isArray(payload) ? payload : payload.results ?? [];
        const normalizedUsers = list.map(normalizeApiUser);
        setUsers(normalizedUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        setUsers([]);
      }
    };

    const loadParcelStats = async () => {
      try {
        const parcels = await fetchParcelles();
        setStats((current) => ({
          ...current,
          totalParcels: parcels.length,
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des parcelles:', error);
        setStats((current) => ({
          ...current,
          totalParcels: 0,
        }));
      }
    };

    void loadAllRequests();
    void loadUsers();
    void loadParcelStats();
  }, [token]);

  useEffect(() => {
    const totalUsers = users.length;
    const totalFarmers = users.filter((userItem) => userItem.role === 'AGRICULTEUR').length;
    const totalVisitors = users.filter((userItem) => userItem.role === 'VISITEUR').length;
    const activeFarmers = users.filter((userItem) => userItem.role === 'AGRICULTEUR' && userItem.est_actif).length;

    let systemHealth: AdminStats['systemHealth'] = 'good';
    if (totalUsers === 0) {
      systemHealth = 'good';
    } else if (activeFarmers === 0 && totalFarmers > 0) {
      systemHealth = 'warning';
    } else if (activeFarmers >= totalFarmers && totalFarmers > 0) {
      systemHealth = 'excellent';
    }

    setStats((current) => ({
      ...current,
      totalUsers,
      totalFarmers,
      totalVisitors,
      activeFarmers,
      systemHealth,
    }));
  }, [users]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await changeUserRole(userId, newRole);
      // Mettre à jour l'état local
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole, updated_at: new Date().toISOString() } : u
      ));
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return Crown;
      case 'farmer': return Users;
      case 'visitor': return Eye;
      default: return Users;
    }
  };

  const pendingRequests = requests.filter((request) => request.status === 'pending');
  const approvedRequests = requests.filter((request) => request.status === 'approved');
  const rejectedRequests = requests.filter((request) => request.status === 'rejected');

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'visitor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout
      title="Tableau de bord Admin"
      subtitle="Gestion système et supervision"
    >
  

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="animate-slide-up" style={{ animationDelay: '0s' }}>
          <Card className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs total</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                  <p className="text-xs text-success">+12% ce mois</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Agriculteurs</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalFarmers}</p>
                  <p className="text-xs text-success">Actifs: {stats.activeFarmers}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parcelles</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalParcels}</p>
                  <p className="text-xs text-info">Surveillance active</p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-950 rounded-lg">
                  <MapPin className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Card className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Santé système</p>
                  <p className="text-2xl font-bold text-foreground capitalize">{stats.systemHealth}</p>
                  <p className="text-xs text-success">Toutes les services actifs</p>
                </div>
                <div className={`p-3 rounded-lg ${getHealthColor(stats.systemHealth)}`}>
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gestion des utilisateurs */}
      <Card className="mb-8 glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des utilisateurs
            </CardTitle>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Utilisateur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rôle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Région</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => {
                  const RoleIcon = getRoleIcon(userItem.role);
                  return (
                    <tr key={userItem.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <RoleIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{userItem.prenom} {userItem.nom}</div>
                            <div className="text-xs text-muted-foreground">{userItem.telephone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground">{userItem.email}</td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleColor(userItem.role)}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {userItem.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-foreground">{userItem.region || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge className={userItem.est_actif ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
                          {userItem.est_actif ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Select
                            value={userItem.role}
                            onValueChange={(value: UserRole) => handleRoleChange(userItem.id, value)}
                          >
                            <SelectTrigger className="text-xs h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="farmer">Agriculteur</SelectItem>
                              <SelectItem value="visitor">Visiteur</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" className="h-8">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Demandes d&apos;agriculteurs
            </CardTitle>
            <div className="flex gap-3 text-sm">
              <Badge className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                {pendingRequests.length} En attente
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                {approvedRequests.length} Approuvées
              </Badge>
              <Badge className="bg-red-100 text-red-800">
                <XCircle className="h-3 w-3 mr-1" />
                {rejectedRequests.length} Rejetées
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Chargement des demandes...
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 py-10 text-center text-sm text-muted-foreground">
              Aucune demande d&apos;agriculteur pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="rounded-xl border border-border bg-background/70 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{request.first_name} {request.last_name}</p>
                        {request.status === 'pending' && (
                          <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                        )}
                        {request.status === 'approved' && (
                          <Badge className="bg-green-100 text-green-800">Approuvée</Badge>
                        )}
                        {request.status === 'rejected' && (
                          <Badge className="bg-red-100 text-red-800">Rejetée</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.location} • {request.phone} • {request.culture_type}
                      </p>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => void approveRequest(request.id)}>
                          Approuver
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => void rejectRequest(request.id)}>
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {request.justification}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

     
    </MainLayout>
  );
};

export default AdminDashboardPage;
