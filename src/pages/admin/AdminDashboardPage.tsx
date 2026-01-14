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
  BarChart3
} from 'lucide-react';
import { useAuthComplete } from '@/hooks/useAuthComplete';
import { User, UserRole } from '@/types/auth';

interface AdminStats {
  totalUsers: number;
  totalFarmers: number;
  totalVisitors: number;
  totalParcels: number;
  activeFarmers: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

const AdminDashboardPage = () => {
  const { user, changeUserRole } = useAuthComplete();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 9,
    totalFarmers: 3,
    totalVisitors: 5,
    totalParcels: 156,
    activeFarmers: 3,
    systemHealth: 'excellent'
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Charger les données mock
    const mockUsers: User[] = [
      {
        id: '1',
        nom: 'Admin',
        prenom: 'Système',
        email: 'admin@agroviatech.com',
        role: 'admin',
        telephone: '+221338654321',
        region: 'Dakar',
        est_actif: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        nom: 'Sow',
        prenom: 'Moussa',
        email: 'moussa.sow@agroviatech.com',
        role: 'farmer',
        telephone: '+221778654321',
        region: 'Saint-Louis',
        adresse: 'Parcelle 15, Saint-Louis',
        est_actif: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        nom: 'Diop',
        prenom: 'Aminata',
        email: 'aminata.diop@agroviatech.com',
        role: 'farmer',
        telephone: '+221778654322',
        region: 'Kaolack',
        adresse: 'Ferme 25, Kaolack',
        est_actif: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        nom: 'Ba',
        prenom: 'Ibrahim',
        email: 'ibrahim.ba@agroviatech.com',
        role: 'farmer',
        telephone: '+221778654323',
        region: 'Fatick',
        adresse: 'Domaine 8, Fatick',
        est_actif: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        nom: 'Visiteur',
        prenom: 'Demo1',
        email: 'visitor1@agroviatech.com',
        role: 'visitor',
        telephone: '+221778654331',
        region: 'Dakar',
        est_actif: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    setUsers(mockUsers);
  }, []);

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

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'visitor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
            <p className="text-gray-600 mt-1">Gestion système et supervision</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <Badge className="bg-purple-100 text-purple-800">
              {user?.prenom} {user?.nom} - Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs offence</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-green-600">+12% ce mois</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agriculteurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFarmers}</p>
                <p className="text-xs text-green-600">Actifs: {stats.activeFarmers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Parcelles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalParcels}</p>
                <p className="text-xs text-blue-600">Surveillance active</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Santé système</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{stats.systemHealth}</p>
                <p className="text-xs text-green-600">Toutes les services actifs</p>
              </div>
              <Activity className={`h-8 w-8 ${getHealthColor(stats.systemHealth).split(' ')[0]}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des utilisateurs */}
      <Card className="mb-8">
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
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Utilisateur</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Rôle</th>
                  <th className="text-left py-3 px-4">Région</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => {
                  const RoleIcon = getRoleIcon(userItem.role);
                  return (
                    <tr key={userItem.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <RoleIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{userItem.prenom} {userItem.nom}</div>
                            <div className="text-xs text-gray-500">{userItem.telephone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{userItem.email}</td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleColor(userItem.role)}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {userItem.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{userItem.region || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge className={userItem.est_actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {userItem.est_actif ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Select
                            value={userItem.role}
                            onValueChange={(value: UserRole) => handleRoleChange(userItem.id, value)}
                          >
                            <SelectTrigger className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="farmer">Agriculteur</SelectItem>
                              <SelectItem value="visitor">Visiteur</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
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

      {/* Actions rapides */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Base de données</h3>
                <p className="text-sm text-gray-600">Sauvegarder et restaurer</p>
                <Button size="sm" className="mt-2">
                  Gérer les sauvegardes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Statistiques</h3>
                <p className="text-sm text-gray-600">Rapports et analytics</p>
                <Button size="sm" className="mt-2">
                  Voir les rapports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Configuration</h3>
                <p className="text-sm text-gray-600">Paramètres système</p>
                <Button size="sm" className="mt-2">
                  Accéder aux réglages
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
