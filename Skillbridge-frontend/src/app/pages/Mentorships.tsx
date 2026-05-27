import { useEffect, useState } from 'react';

import {
  Calendar,
  MessageSquare,
  Video,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Trash2,
  Edit
} from 'lucide-react';

import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/ui/card';

import { Button } from '../components/ui/button';

import { Input } from '../components/ui/input';

import { Label } from '../components/ui/label';

import { Textarea } from '../components/ui/textarea';

import { Badge } from '../components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../components/ui/tabs';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../components/ui/avatar';

import * as mentorshipService from '../services/mentorshipService';

interface Mentor {
  id: number;
  nombre: string;
  titulo: string;
  avatar?: string;
  rating: number;
  reviews: number;
  availability: string;
  sessions: number;
  bio: string;
}

interface MentorshipSession {
  id: number;
  mentor_id: number;
  tema: string;
  fecha: string;
  hora: string;
  duracion?: string;
  estado: string;
  tipo?: string;
  notas?: string;
  feedback?: string;
  rating?: number;
  mentor?: Mentor;
}

export function Mentorships() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);

  // FORM STATES
  const [mentorId, setMentorId] = useState('');
  const [tema, setTema] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [duracion, setDuracion] = useState('60');
  const [tipo, setTipo] = useState('virtual');

  // FETCH DATA
  useEffect(() => {
    fetchMentors();
    fetchSessions();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoadingMentors(true);
      const data = await mentorshipService.getAllMentors();
      setMentors(data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando mentores');
    } finally {
      setLoadingMentors(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const data = await mentorshipService.getAllMentorships();
      setSessions(data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando mentorías');
    } finally {
      setLoadingSessions(false);
    }
  };

  // LIMPIAR FORMULARIO
  const clearForm = () => {
    setMentorId('');
    setTema('');
    setDescripcion('');
    setFecha('');
    setHora('');
    setDuracion('60');
    setTipo('virtual');
    setEditingSessionId(null);
  };

  // CREATE MENTORSHIP
  const handleRequestMentorship = async () => {
    try {
      if (!mentorId || !tema || !fecha || !hora) {
        toast.error('Completa todos los campos requeridos');
        return;
      }

      // NOTA: student_id debe venir del usuario autenticado
      const studentIdFromAuth = 1;

      const newSession = await mentorshipService.createMentorship({
        mentor_id: parseInt(mentorId),
        student_id: studentIdFromAuth,
        tema,
        descripcion,
        fecha,
        hora,
        duracion: parseInt(duracion),
        tipo: tipo as any
      });

      toast.success('Solicitud enviada exitosamente');
      setSessions([newSession, ...sessions]);
      clearForm();
      setIsRequestDialogOpen(false);

    } catch (error) {
      console.error(error);
      toast.error('Error enviando solicitud');
    }
  };

  // UPDATE MENTORSHIP
  const handleUpdateSession = async (sessionId: number) => {
    try {
      if (!tema || !fecha || !hora) {
        toast.error('Completa todos los campos requeridos');
        return;
      }

      const updatedSession = await mentorshipService.updateMentorship(sessionId, {
        tema,
        descripcion,
        fecha,
        hora,
        duracion: parseInt(duracion),
        tipo: tipo as any
      });

      setSessions(sessions.map(s => s.id === sessionId ? updatedSession : s));
      toast.success('Mentoría actualizada exitosamente');
      clearForm();
      setIsRequestDialogOpen(false);

    } catch (error) {
      console.error(error);
      toast.error('Error actualizando mentoría');
    }
  };

  // DELETE MENTORSHIP
  const handleDeleteSession = async (sessionId: number) => {
    try {
      if (!window.confirm('¿Estás seguro de que quieres eliminar esta mentoría?')) {
        return;
      }

      await mentorshipService.deleteMentorship(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Mentoría eliminada exitosamente');

    } catch (error) {
      console.error(error);
      toast.error('Error eliminando mentoría');
    }
  };

  // ABRIR DIÁLOGO PARA EDITAR
  const handleEditClick = (session: MentorshipSession) => {
    setMentorId(session.mentor_id.toString());
    setTema(session.tema);
    setFecha(session.fecha);
    setHora(session.hora);
    setDuracion(session.duracion || '60');
    setTipo(session.tipo || 'virtual');
    setEditingSessionId(session.id);
    setIsRequestDialogOpen(true);
  };

  // CERRAR DIÁLOGO
  const handleCloseDialog = () => {
    setIsRequestDialogOpen(false);
    clearForm();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mentorías
          </h1>
          <p className="text-gray-600 mt-1">
            Conecta con expertos y mejora tus habilidades
          </p>
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
              <DialogTitle>
                {editingSessionId ? 'Editar Mentoría' : 'Solicitar Mentoría'}
              </DialogTitle>
              <DialogDescription>
                Completa el formulario
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* MENTOR */}
              <div className="space-y-2">
                <Label>Mentor *</Label>
                <Select value={mentorId} onValueChange={setMentorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id.toString()}>
                        {mentor.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* TEMA */}
              <div className="space-y-2">
                <Label>Tema *</Label>
                <Input
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Tema a discutir"
                />
              </div>

              {/* DESCRIPCION */}
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe lo que quieres aprender"
                />
              </div>

              {/* FECHA Y HORA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha *</Label>
                  <Input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hora *</Label>
                  <Input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                  />
                </div>
              </div>

              {/* DURACION Y TIPO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duración</Label>
                  <Select value={duracion} onValueChange={setDuracion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                      <SelectItem value="90">90 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>

              <Button
                onClick={() =>
                  editingSessionId
                    ? handleUpdateSession(editingSessionId)
                    : handleRequestMentorship()
                }
              >
                {editingSessionId ? 'Actualizar' : 'Enviar'} Solicitud
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABS */}
      <Tabs defaultValue="mentors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="mentors">
            Mentores
          </TabsTrigger>

          <TabsTrigger value="sessions">
            Mis Mentorías
          </TabsTrigger>
        </TabsList>

        {/* MENTORS */}
        <TabsContent value="mentors">
          {loadingMentors ? (
            <p>Cargando mentores...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback>
                          {mentor.nombre.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <CardTitle>
                          {mentor.nombre}
                        </CardTitle>

                        <CardDescription>
                          {mentor.titulo}
                        </CardDescription>

                        <div className="flex items-center gap-2 mt-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            {mentor.rating}
                          </span>

                          <Badge>
                            {mentor.availability}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {mentor.bio}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {mentor.sessions} sesiones
                      </span>

                      <Button
                        size="sm"
                        onClick={() => {
                          setMentorId(mentor.id.toString());
                          setIsRequestDialogOpen(true);
                        }}
                      >
                        Solicitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SESSIONS */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>
                Mis Mentorías
              </CardTitle>

              <CardDescription>
                Sesiones programadas y completadas
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loadingSessions ? (
                <p>Cargando sesiones...</p>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">No tienes mentorías aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {session.tema}
                          </h4>

                          <p className="text-sm text-gray-500">
                            {new Date(session.fecha).toLocaleDateString('es-ES')}
                            {' • '}
                            {session.hora}
                          </p>

                          {session.mentor && (
                            <p className="text-sm text-gray-600 mt-1">
                              Con: {session.mentor.nombre}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge>
                            {session.estado}
                          </Badge>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(session)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {session.notas && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm">
                            Notas: {session.notas}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}