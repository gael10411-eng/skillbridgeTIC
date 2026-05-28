import { useEffect, useMemo, useState } from 'react';
import { Award, CheckCircle2, Clock, Download, Lock, Share2, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import api from '../../services/api';

interface Certification {
  id: number;
  nombre: string;
  descripcion?: string;
  nivel?: 'Basico' | 'Intermedio' | 'Avanzado';
  duracion?: string;
  imagen?: string;
  estado?: 'disponible' | 'bloqueado' | 'en_progreso';
  progreso?: number;
  skills?: string[];
}

interface EarnedCertification {
  id: number;
  fecha_obtenida?: string;
  credential_id?: string;
  verification_url?: string;
  certification: Certification;
}

const statusLabels: Record<string, string> = {
  disponible: 'Comenzar Programa',
  bloqueado: 'Bloqueado',
  en_progreso: 'Continuar Programa'
};

export function Certifications() {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [earnedCertifications, setEarnedCertifications] = useState<EarnedCertification[]>([]);
  const [selectedCert, setSelectedCert] = useState<EarnedCertification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const [availableResponse, earnedResponse] = await Promise.all([
          api.get('/certifications'),
          user?.id
            ? api.get(`/certifications/earned/${user.id}`)
            : Promise.resolve({ data: [] })
        ]);

        setCertifications(availableResponse.data || []);
        setEarnedCertifications(earnedResponse.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Error cargando certificaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [user?.id]);

  const activeCertifications = certifications.filter((cert) => cert.estado === 'en_progreso');

  const uniqueSkills = useMemo(() => {
    return new Set(
      earnedCertifications.flatMap((item) => item.certification?.skills || [])
    ).size;
  }, [earnedCertifications]);

  const globalProgress = certifications.length
    ? Math.round(
        certifications.reduce((total, cert) => total + (cert.progreso || 0), 0) /
          certifications.length
      )
    : 0;

  const handleDownloadCertificate = (cert: EarnedCertification) => {
    toast.success(`Certificado listo: ${cert.certification.nombre}`);
  };

  const handleShareCertificate = async (cert: EarnedCertification) => {
    try {
      if (cert.verification_url) {
        await navigator.clipboard.writeText(cert.verification_url);
      }
      toast.success('Enlace de verificación copiado al portapapeles');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo copiar el enlace');
    }
  };

  const handleStartCertification = (cert: Certification) => {
    if (cert.estado === 'bloqueado') {
      toast.error('Esta certificación está bloqueada');
      return;
    }

    toast.success(`Programa seleccionado: ${cert.nombre}`);
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Cargando certificaciones...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Certificaciones</h1>
        <p className="text-gray-600 mt-1">Valida tus competencias técnicas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certificados Obtenidos</CardTitle>
            <Award className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{earnedCertifications.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Progreso</CardTitle>
            <Clock className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{activeCertifications.length}</div>
            <p className="text-xs text-gray-500 mt-1">Programas activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Competencias</CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{uniqueSkills}</div>
            <p className="text-xs text-gray-500 mt-1">Habilidades validadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nivel Global</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{globalProgress}%</div>
            <p className="text-xs text-gray-500 mt-1">Promedio de programas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earned" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="earned">Mis Certificados</TabsTrigger>
          <TabsTrigger value="available">Disponibles</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-6">
          {earnedCertifications.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">
                Aún no tienes certificaciones obtenidas.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedCertifications.map((earned) => (
                <Card
                  key={earned.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCert(earned)}
                >
                  <div className="h-32 bg-gradient-to-br from-amber-500 to-orange-600 relative overflow-hidden">
                    {earned.certification.imagen && (
                      <img
                        src={earned.certification.imagen}
                        alt={earned.certification.nombre}
                        className="w-full h-full object-cover opacity-30"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">{earned.certification.nombre}</CardTitle>
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    </div>
                    <CardDescription>SkillBridge</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Emitido: {earned.fecha_obtenida ? new Date(earned.fecha_obtenida).toLocaleDateString('es-ES') : 'Sin fecha'}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(earned.certification.skills || []).slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadCertificate(earned);
                      }}>
                        <Download className="mr-2 h-3 w-3" />
                        Descargar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                        e.stopPropagation();
                        handleShareCertificate(earned);
                      }}>
                        <Share2 className="mr-2 h-3 w-3" />
                        Compartir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.id} className={`hover:shadow-lg transition-shadow ${cert.estado === 'bloqueado' ? 'opacity-60' : ''}`}>
                <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                  {cert.imagen && (
                    <img src={cert.imagen} alt={cert.nombre} className="w-full h-full object-cover opacity-30" />
                  )}
                  {cert.estado === 'bloqueado' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Lock className="h-12 w-12 text-white" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-900">{cert.nivel || 'Basico'}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{cert.nombre}</CardTitle>
                  <CardDescription className="mt-2">{cert.descripcion || 'Programa de certificación TIC'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cert.estado === 'en_progreso' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-medium text-gray-900">{cert.progreso || 0}%</span>
                      </div>
                      <Progress value={cert.progreso || 0} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Duración</div>
                      <div className="font-medium text-gray-900">{cert.duracion || 'Por definir'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Nivel</div>
                      <div className="font-medium text-gray-900">{cert.nivel || 'Basico'}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(cert.skills || []).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={cert.estado === 'bloqueado' ? 'outline' : 'default'}
                    disabled={cert.estado === 'bloqueado'}
                    onClick={() => handleStartCertification(cert)}
                  >
                    {cert.estado === 'bloqueado' && <Lock className="mr-2 h-4 w-4" />}
                    {statusLabels[cert.estado || 'disponible']}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={selectedCert !== null} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCert && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCert.certification.nombre}</DialogTitle>
                <DialogDescription>
                  Emitido por SkillBridge
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 text-center space-y-2">
                  <Award className="h-20 w-20 text-amber-600 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900">{selectedCert.certification.nombre}</h3>
                  <p className="text-gray-600">{selectedCert.certification.descripcion}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ID de Credencial</span>
                    <span className="font-mono font-medium">{selectedCert.credential_id || 'Sin credencial'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fecha de Emisión</span>
                    <span className="font-medium">
                      {selectedCert.fecha_obtenida ? new Date(selectedCert.fecha_obtenida).toLocaleDateString('es-ES') : 'Sin fecha'}
                    </span>
                  </div>
                  {selectedCert.verification_url && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Verificación</span>
                      <a href={selectedCert.verification_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Verificar certificado
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
