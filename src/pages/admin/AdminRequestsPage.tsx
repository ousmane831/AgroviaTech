import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAgriculteurRequest } from '@/hooks/useAgriculteurRequest';
import { useToast } from '@/hooks/use-toast';
import { AgriculteurRequest, AgriculteurRequestStatus } from '@/types/auth';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Phone,
  Sprout,
  FileText,
  Calendar,
  Loader2,
  ArrowLeft
} from 'lucide-react';

const AdminRequestsPage = () => {
  const navigate = useNavigate();
  const { requests, loadAllRequests, approveRequest, rejectRequest, isLoading } = useAgriculteurRequest();
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadAllRequests();
  }, []);

  const getStatusBadge = (status: AgriculteurRequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejetée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await approveRequest(requestId);
      toast({
        title: "Demande approuvée",
        description: "L'utilisateur a été promu au rôle d'agriculteur",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await rejectRequest(requestId);
      toast({
        title: "Demande rejetée",
        description: "La demande a été marquée comme rejetée",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const otherRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au dashboard admin
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                Demandes d'agriculteurs
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les demandes de passage au rôle d'agriculteur
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Approuvées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {requests.filter(r => r.status === 'rejected').length}
                </div>
                <div className="text-sm text-gray-600">Rejetées</div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Chargement des demandes...</span>
          </div>
        ) : requests.length === 0 ? (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              Aucune demande d'agriculteur pour le moment.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-8">
            {/* Demandes en attente */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Demandes en attente ({pendingRequests.length})
                </h2>
                <div className="grid gap-4">
                  {pendingRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onApprove={() => handleApprove(request.id)}
                      onReject={() => handleReject(request.id)}
                      actionLoading={actionLoading === request.id}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Autres demandes */}
            {otherRequests.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Demandes traitées ({otherRequests.length})
                </h2>
                <div className="grid gap-4">
                  {otherRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onApprove={undefined}
                      onReject={undefined}
                      actionLoading={false}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour afficher une carte de demande
interface RequestCardProps {
  request: AgriculteurRequest;
  onApprove?: () => void;
  onReject?: () => void;
  actionLoading: boolean;
  formatDate: (date: string) => string;
  getStatusBadge: (status: AgriculteurRequestStatus) => JSX.Element;
}

const RequestCard = ({ 
  request, 
  onApprove, 
  onReject, 
  actionLoading, 
  formatDate, 
  getStatusBadge 
}: RequestCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {request.first_name} {request.last_name}
              </h3>
              {getStatusBadge(request.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(request.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                ID: {request.user_id.slice(0, 8)}...
              </div>
            </div>
          </div>
          
          {onApprove && onReject && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={onApprove}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approuver
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onReject}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeter
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                <strong>Localisation:</strong> {request.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                <strong>Téléphone:</strong> {request.phone}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                <strong>Expérience:</strong> {request.experience}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                <strong>Culture:</strong> {request.culture_type}
              </span>
            </div>
          </div>
        </div>

        {request.justification && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold">Message:</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">{request.justification}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRequestsPage;
