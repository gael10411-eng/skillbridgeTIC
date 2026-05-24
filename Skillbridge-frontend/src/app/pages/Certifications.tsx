import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Award, Download, Share2, CheckCircle2, Clock, Lock, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';

export function Certifications() {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);

  const earnedCertifications = [
    {
      id: 1,
      name: 'Desarrollador Web Full Stack',
      issuer: 'TIC Academy',
      date: '2026-03-15',
      credentialId: 'TICFS-2026-001234',
      skills: ['React', 'Node.js', 'MongoDB', 'RESTful APIs'],
      verificationUrl: 'https://verify.ticacademy.com/TICFS-2026-001234',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Fundamentos de IoT',
      issuer: 'TIC Academy',
      date: '2026-02-20',
      credentialId: 'TICIOT-2026-005678',
      skills: ['Arduino', 'Sensores', 'MQTT', 'Edge Computing'],
      verificationUrl: 'https://verify.ticacademy.com/TICIOT-2026-005678',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Gestión de Proyectos Ágiles',
      issuer: 'TIC Academy',
      date: '2026-01-10',
      credentialId: 'TICPM-2026-009012',
      skills: ['Scrum', 'Kanban', 'Sprint Planning', 'Retrospectives'],
      verificationUrl: 'https://verify.ticacademy.com/TICPM-2026-009012',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      name: 'Desarrollo de APIs REST',
      issuer: 'TIC Academy',
      date: '2025-12-05',
      credentialId: 'TICAPI-2025-003456',
      skills: ['REST', 'HTTP Methods', 'Authentication', 'Swagger'],
      verificationUrl: 'https://verify.ticacademy.com/TICAPI-2025-003456',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop',
    },
    {
      id: 5,
      name: 'Seguridad en Aplicaciones Web',
      issuer: 'TIC Academy',
      date: '2025-11-18',
      credentialId: 'TICSEC-2025-007890',
      skills: ['OWASP', 'SQL Injection', 'XSS', 'CSRF', 'JWT'],
      verificationUrl: 'https://verify.ticacademy.com/TICSEC-2025-007890',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    },
  ];

  const availableCertifications = [
    {
      id: 101,
      name: 'Machine Learning Fundamentals',
      description: 'Aprende los fundamentos del aprendizaje automático y sus aplicaciones',
      duration: '8 semanas',
      level: 'Intermedio',
      requirements: ['Python básico', 'Matemáticas aplicadas'],
      skills: ['Python', 'scikit-learn', 'TensorFlow', 'Data Analysis'],
      progress: 45,
      status: 'in-progress',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    },
    {
      id: 102,
      name: 'Cloud Architecture AWS',
      description: 'Domina el diseño de arquitecturas cloud en Amazon Web Services',
      duration: '10 semanas',
      level: 'Avanzado',
      requirements: ['Experiencia en DevOps', 'Linux básico'],
      skills: ['AWS', 'EC2', 'S3', 'Lambda', 'CloudFormation'],
      progress: 20,
      status: 'in-progress',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    },
    {
      id: 103,
      name: 'Blockchain Developer',
      description: 'Conviértete en desarrollador blockchain con Ethereum y Solidity',
      duration: '12 semanas',
      level: 'Avanzado',
      requirements: ['JavaScript', 'Conceptos de criptografía'],
      skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js'],
      progress: 0,
      status: 'locked',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
    },
    {
      id: 104,
      name: 'UX/UI Design Avanzado',
      description: 'Crea experiencias de usuario excepcionales con metodologías modernas',
      duration: '6 semanas',
      level: 'Intermedio',
      requirements: ['Diseño básico'],
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      progress: 0,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    },
  ];

  const handleDownloadCertificate = (cert: typeof earnedCertifications[0]) => {
    toast.success(`Descargando certificado: ${cert.name}`);
  };

  const handleShareCertificate = (cert: typeof earnedCertifications[0]) => {
    toast.success('Enlace de verificación copiado al portapapeles');
  };

  const handleStartCertification = (cert: typeof availableCertifications[0]) => {
    if (cert.status === 'locked') {
      toast.error('Completa los requisitos previos para desbloquear esta certificación');
    } else {
      toast.success(`Iniciando programa: ${cert.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Certificaciones</h1>
        <p className="text-gray-600 mt-1">Valida tus competencias técnicas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Certificados Obtenidos
            </CardTitle>
            <Award className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{earnedCertifications.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Progreso
            </CardTitle>
            <Clock className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {availableCertifications.filter(c => c.status === 'in-progress').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Programas activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Competencias
            </CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {[...new Set(earnedCertifications.flatMap(c => c.skills))].length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Habilidades validadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Nivel Global
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">68%</div>
            <p className="text-xs text-gray-500 mt-1">+12% este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="earned" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="earned">Mis Certificados</TabsTrigger>
          <TabsTrigger value="available">Disponibles</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedCertifications.map((cert) => (
              <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCert(cert.id)}>
                <div className="h-32 bg-gradient-to-br from-amber-500 to-orange-600 relative overflow-hidden">
                  <img src={cert.image} alt={cert.name} className="w-full h-full object-cover opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{cert.name}</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  </div>
                  <CardDescription>{cert.issuer}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Emitido: {new Date(cert.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Competencias Validadas</div>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                      {cert.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{cert.skills.length - 3}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCertificate(cert);
                    }}>
                      <Download className="mr-2 h-3 w-3" />
                      Descargar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                      e.stopPropagation();
                      handleShareCertificate(cert);
                    }}>
                      <Share2 className="mr-2 h-3 w-3" />
                      Compartir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableCertifications.map((cert) => (
              <Card key={cert.id} className={`hover:shadow-lg transition-shadow ${cert.status === 'locked' ? 'opacity-60' : ''}`}>
                <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                  <img src={cert.image} alt={cert.name} className="w-full h-full object-cover opacity-30" />
                  {cert.status === 'locked' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Lock className="h-12 w-12 text-white" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-900">
                      {cert.level}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{cert.name}</CardTitle>
                      <CardDescription className="mt-2">{cert.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cert.status === 'in-progress' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-medium text-gray-900">{cert.progress}%</span>
                      </div>
                      <Progress value={cert.progress} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Duración</div>
                      <div className="font-medium text-gray-900">{cert.duration}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Nivel</div>
                      <div className="font-medium text-gray-900">{cert.level}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Requisitos</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cert.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Competencias a Adquirir</div>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant={cert.status === 'locked' ? 'outline' : 'default'}
                    disabled={cert.status === 'locked'}
                    onClick={() => handleStartCertification(cert)}
                  >
                    {cert.status === 'locked' ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Bloqueado
                      </>
                    ) : cert.status === 'in-progress' ? (
                      'Continuar Programa'
                    ) : (
                      'Comenzar Programa'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Certificate Detail Dialog */}
      <Dialog open={selectedCert !== null} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCert && (() => {
            const cert = earnedCertifications.find(c => c.id === selectedCert)!;
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-2xl">{cert.name}</DialogTitle>
                      <DialogDescription className="mt-1">
                        Emitido por {cert.issuer} • {new Date(cert.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <div className="text-center space-y-2">
                      <Award className="h-20 w-20 text-amber-600 mx-auto" />
                      <h3 className="text-xl font-bold text-gray-900">{cert.name}</h3>
                      <p className="text-gray-600">Este certificado valida que has completado exitosamente el programa y has demostrado competencia en las siguientes áreas:</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Competencias Validadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ID de Credencial</span>
                      <span className="font-mono font-medium">{cert.credentialId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fecha de Emisión</span>
                      <span className="font-medium">{new Date(cert.date).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Verificación</span>
                      <a href={cert.verificationUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Verificar certificado
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => handleDownloadCertificate(cert)}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleShareCertificate(cert)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
