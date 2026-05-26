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
  Search
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

  const [isRequestDialogOpen, setIsRequestDialogOpen] =
    useState(false);

  const [selectedMentor, setSelectedMentor] =
    useState<number | null>(null);

  const [mentors, setMentors] =
    useState<Mentor[]>([]);

  const [sessions, setSessions] =
    useState<MentorshipSession[]>([]);

  const [loadingMentors, setLoadingMentors] =
    useState(true);

  const [loadingSessions, setLoadingSessions] =
    useState(true);

  // FORM STATES
  const [mentorId, setMentorId] =
    useState('');

  const [tema, setTema] =
    useState('');

  const [descripcion, setDescripcion] =
    useState('');

  const [fecha, setFecha] =
    useState('');

  const [hora, setHora] =
    useState('');

  const [duracion, setDuracion] =
    useState('60');

  // FETCH DATA
  useEffect(() => {

    fetchMentors();

    fetchSessions();

  }, []);

  const fetchMentors = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/mentors`
      );

      const data = await response.json();

      setMentors(data);

    } catch (error) {

      console.error(error);

      toast.error(
        'Error cargando mentores'
      );

    } finally {

      setLoadingMentors(false);
    }
  };

  const fetchSessions = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/mentorships`
      );

      const data = await response.json();

      setSessions(data);

    } catch (error) {

      console.error(error);

      toast.error(
        'Error cargando mentorías'
      );

    } finally {

      setLoadingSessions(false);
    }
  };

  // CREATE MENTORSHIP
  const handleRequestMentorship = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/mentorships`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            mentor_id: mentorId,

            tema,

            descripcion,

            fecha,

            hora,

            duracion
          })
        }
      );

      if (!response.ok) {

        throw new Error();
      }

      toast.success(
        'Solicitud enviada'
      );

      setIsRequestDialogOpen(false);

      fetchSessions();

    } catch (error) {

      console.error(error);

      toast.error(
        'Error enviando solicitud'
      );
    }
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

        <Dialog
          open={isRequestDialogOpen}
          onOpenChange={setIsRequestDialogOpen}
        >

          <DialogTrigger asChild>

            <Button>

              <Plus className="mr-2 h-4 w-4" />

              Solicitar Mentoría

            </Button>

          </DialogTrigger>

          <DialogContent className="max-w-2xl">

            <DialogHeader>

              <DialogTitle>
                Solicitar Mentoría
              </DialogTitle>

              <DialogDescription>
                Completa el formulario
              </DialogDescription>

            </DialogHeader>

            <div className="space-y-4 py-4">

              {/* MENTOR */}
              <div className="space-y-2">

                <Label>
                  Mentor
                </Label>

                <Select
                  value={mentorId}
                  onValueChange={setMentorId}
                >

                  <SelectTrigger>

                    <SelectValue placeholder="Selecciona mentor" />

                  </SelectTrigger>

                  <SelectContent>

                    {mentors.map((mentor) => (

                      <SelectItem
                        key={mentor.id}
                        value={mentor.id.toString()}
                      >

                        {mentor.nombre}

                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* TEMA */}
              <div className="space-y-2">

                <Label>
                  Tema
                </Label>

                <Input
                  value={tema}
                  onChange={(e) =>
                    setTema(e.target.value)
                  }
                />
              </div>

              {/* DESCRIPCION */}
              <div className="space-y-2">

                <Label>
                  Descripción
                </Label>

                <Textarea
                  rows={4}
                  value={descripcion}
                  onChange={(e) =>
                    setDescripcion(e.target.value)
                  }
                />
              </div>

              {/* FECHA */}
              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">

                  <Label>
                    Fecha
                  </Label>

                  <Input
                    type="date"
                    value={fecha}
                    onChange={(e) =>
                      setFecha(e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">

                  <Label>
                    Hora
                  </Label>

                  <Input
                    type="time"
                    value={hora}
                    onChange={(e) =>
                      setHora(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* DURACION */}
              <div className="space-y-2">

                <Label>
                  Duración
                </Label>

                <Select
                  value={duracion}
                  onValueChange={setDuracion}
                >

                  <SelectTrigger>

                    <SelectValue />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="30">
                      30 min
                    </SelectItem>

                    <SelectItem value="45">
                      45 min
                    </SelectItem>

                    <SelectItem value="60">
                      60 min
                    </SelectItem>

                    <SelectItem value="90">
                      90 min
                    </SelectItem>

                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() =>
                  setIsRequestDialogOpen(false)
                }
              >
                Cancelar
              </Button>

              <Button
                onClick={handleRequestMentorship}
              >
                Enviar Solicitud
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABS */}
      <Tabs
        defaultValue="mentors"
        className="space-y-6"
      >

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

            <p>
              Cargando mentores...
            </p>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {mentors.map((mentor) => (

                <Card
                  key={mentor.id}
                  className="hover:shadow-lg transition-shadow"
                >

                  <CardHeader>

                    <div className="flex items-start gap-4">

                      <Avatar className="h-16 w-16">

                        <AvatarImage
                          src={mentor.avatar}
                        />

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
                        onClick={() =>
                          setIsRequestDialogOpen(true)
                        }
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
                Sesiones programadas
              </CardDescription>

            </CardHeader>

            <CardContent>

              {loadingSessions ? (

                <p>
                  Cargando sesiones...
                </p>

              ) : sessions.length === 0 ? (

                <p className="text-gray-500">
                  No tienes mentorías aún.
                </p>

              ) : (

                <div className="space-y-4">

                  {sessions.map((session) => (

                    <div
                      key={session.id}
                      className="p-4 border rounded-lg"
                    >

                      <div className="flex justify-between">

                        <div>

                          <h4 className="font-semibold">
                            {session.tema}
                          </h4>

                          <p className="text-sm text-gray-500">

                            {new Date(
                              session.fecha
                            ).toLocaleDateString('es-ES')}

                            {' • '}

                            {session.hora}

                          </p>

                        </div>

                        <Badge>

                          {session.estado}

                        </Badge>
                      </div>

                      {session.notas && (

                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">

                          <p className="text-sm">

                            {session.notas}

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