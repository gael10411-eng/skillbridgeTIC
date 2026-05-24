import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Calendar, MessageSquare, Video, Star, Clock, CheckCircle2, AlertCircle, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export function Mentorships() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);

  const mentors = [
    {
      id: 1,
      name: 'Dr. Carlos Ruiz',
      title: 'Arquitecto de Software Senior',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosM',
      rating: 4.9,
      reviews: 127,
      expertise: ['Arquitectura de Software', 'Cloud Computing', 'Microservicios', 'DevOps'],
      availability: 'Disponible',
      sessions: 156,
      bio: 'Más de 15 años de experiencia en desarrollo de software empresarial y arquitectura cloud.',
    },
    {
      id: 2,
      name: 'Ing. María López',
      title: 'Desarrolladora Full Stack',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaM',
      rating: 4.8,
      reviews: 98,
      expertise: ['React', 'Node.js', 'Desarrollo Backend', 'APIs'],
      availability: 'Disponible',
      sessions: 124,
      bio: 'Especialista en desarrollo web moderno con enfoque en aplicaciones escalables.',
    },
    {
      id: 3,
      name: 'Dr. Roberto Silva',
      title: 'Científico de Datos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RobertoM',
      rating: 5.0,
      reviews: 83,
      expertise: ['Machine Learning', 'Python', 'Data Analysis', 'AI'],
      availability: 'Limitado',
      sessions: 95,
      bio: 'PhD en Inteligencia Artificial con enfoque en machine learning aplicado.',
    },
    {
      id: 4,
      name: 'Ing. Laura Sánchez',
      title: 'Especialista en Blockchain',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LauraM',
      rating: 4.7,
      reviews: 64,
      expertise: ['Blockchain', 'Smart Contracts', 'Ethereum', 'Web3'],
      availability: 'Disponible',
      sessions: 78,
      bio: 'Experta en tecnología blockchain y desarrollo de contratos inteligentes.',
    },
  ];

  const myMentorships = [
    {
      id: 1,
      mentor: mentors[0],
      topic: 'Arquitectura de Microservicios',
      date: '2026-04-18',
      time: '10:00 AM',
      duration: '60 min',
      status: 'confirmed',
      type: 'video',
      notes: 'Revisar arquitectura del proyecto IoT',
    },
    {
      id: 2,
      mentor: mentors[1],
      topic: 'Optimización de APIs REST',
      date: '2026-04-20',
      time: '2:00 PM',
      duration: '45 min',
      status: 'pending',
      type: 'video',
      notes: 'Discutir mejores prácticas para APIs',
    },
    {
      id: 3,
      mentor: mentors[0],
      topic: 'DevOps y CI/CD',
      date: '2026-04-12',
      time: '3:00 PM',
      duration: '60 min',
      status: 'completed',
      type: 'video',
      notes: 'Implementación de pipeline CI/CD',
      feedback: 'Excelente sesión, muy útil para entender el flujo de trabajo.',
      rating: 5,
    },
  ];

  const handleRequestMentorship = () => {
    toast.success('Solicitud de mentoría enviada');
    setIsRequestDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentorías</h1>
          <p className="text-gray-600 mt-1">Conecta con expertos y mejora tus habilidades</p>
        </div>
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Solicitar Mentoría
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Solicitar Mentoría</DialogTitle>
              <DialogDescription>
                Completa el formulario para solicitar una sesión de mentoría
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="mentor-select">Seleccionar Mentor</Label>
                <Select>
                  <SelectTrigger id="mentor-select">
                    <SelectValue placeholder="Elige un mentor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id.toString()}>
                        {mentor.name} - {mentor.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Tema de la Mentoría</Label>
                <Input id="topic" placeholder="Ej: Arquitectura de Software" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Describe lo que te gustaría aprender o discutir..." rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha Preferida</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora Preferida</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración</Label>
                <Select>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Seleccionar duración..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRequestMentorship}>Enviar Solicitud</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="mentors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="mentors">Buscar Mentores</TabsTrigger>
          <TabsTrigger value="sessions">Mis Mentorías</TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Buscar por nombre o especialidad..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="web">Desarrollo Web</SelectItem>
                    <SelectItem value="mobile">Desarrollo Móvil</SelectItem>
                    <SelectItem value="data">Ciencia de Datos</SelectItem>
                    <SelectItem value="cloud">Cloud Computing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{mentor.name}</CardTitle>
                      <CardDescription className="mt-1">{mentor.title}</CardDescription>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-sm">{mentor.rating}</span>
                          <span className="text-xs text-gray-500">({mentor.reviews})</span>
                        </div>
                        <Badge variant={mentor.availability === 'Disponible' ? 'default' : 'secondary'}>
                          {mentor.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{mentor.bio}</p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Áreas de Especialidad</div>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {mentor.sessions} sesiones completadas
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedMentor(mentor.id)}>
                        Ver Perfil
                      </Button>
                      <Button size="sm" onClick={() => setIsRequestDialogOpen(true)}>
                        Solicitar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Sesiones Próximas</CardTitle>
              <CardDescription>Tus mentorías programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myMentorships.filter(m => m.status !== 'completed').map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
                        <AvatarFallback>{session.mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{session.topic}</h4>
                            <p className="text-sm text-gray-600">con {session.mentor.name}</p>
                          </div>
                          <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'}>
                            {session.status === 'confirmed' ? (
                              <><CheckCircle2 className="mr-1 h-3 w-3" /> Confirmada</>
                            ) : (
                              <><AlertCircle className="mr-1 h-3 w-3" /> Pendiente</>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(session.date).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{session.time} • {session.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            <span>Videollamada</span>
                          </div>
                        </div>

                        {session.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-900"><strong>Notas:</strong> {session.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Enviar Mensaje
                          </Button>
                          {session.status === 'confirmed' && (
                            <Button size="sm">
                              <Video className="mr-2 h-4 w-4" />
                              Unirse a la Sesión
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completed Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Sesiones</CardTitle>
              <CardDescription>Mentorías completadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myMentorships.filter(m => m.status === 'completed').map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
                        <AvatarFallback>{session.mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{session.topic}</h4>
                            <p className="text-sm text-gray-600">con {session.mentor.name}</p>
                          </div>
                          <Badge variant="secondary">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Completada
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{new Date(session.date).toLocaleDateString('es-ES')}</span>
                          <span>•</span>
                          <span>{session.duration}</span>
                        </div>

                        {session.feedback && (
                          <div className="mt-3 p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(session.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-sm font-medium">Tu valoración</span>
                            </div>
                            <p className="text-sm text-gray-700">{session.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mentor Profile Dialog */}
      <Dialog open={selectedMentor !== null} onOpenChange={() => setSelectedMentor(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMentor && (() => {
            const mentor = mentors.find(m => m.id === selectedMentor)!;
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <DialogTitle className="text-2xl">{mentor.name}</DialogTitle>
                      <DialogDescription className="mt-1 text-base">{mentor.title}</DialogDescription>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{mentor.rating}</span>
                          <span className="text-sm text-gray-500">({mentor.reviews} reseñas)</span>
                        </div>
                        <Badge variant={mentor.availability === 'Disponible' ? 'default' : 'secondary'}>
                          {mentor.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2">Acerca de</h3>
                    <p className="text-gray-700">{mentor.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Áreas de Especialidad</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-sm">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{mentor.sessions}</div>
                      <div className="text-sm text-gray-600">Sesiones Completadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{mentor.reviews}</div>
                      <div className="text-sm text-gray-600">Reseñas</div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1" onClick={() => {
                      setSelectedMentor(null);
                      setIsRequestDialogOpen(true);
                    }}>
                      Solicitar Mentoría
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Enviar Mensaje
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
