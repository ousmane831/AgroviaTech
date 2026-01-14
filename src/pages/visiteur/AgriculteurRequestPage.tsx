import { useNavigate } from 'react-router-dom';
import { useAgriculteurRequest } from '@/hooks/useAgriculteurRequest';
import { useToast } from '@/hooks/use-toast';
import AgriculteurRequestForm from '@/components/agriculteur/AgriculteurRequestForm';

const AgriculteurRequestPage = () => {
  const navigate = useNavigate();
  const { createRequest } = useAgriculteurRequest();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await createRequest(data);
      toast({
        title: "Demande envoyée avec succès",
        description: "Votre demande est en cours de validation par notre équipe",
      });
      navigate('/visitor/dashboard');
    } catch (error: any) {
      throw error; // Le formulaire gérera l'affichage de l'erreur
    }
  };

  return <AgriculteurRequestForm onSubmit={handleSubmit} />;
};

export default AgriculteurRequestPage;
