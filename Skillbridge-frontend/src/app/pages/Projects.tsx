import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Plus, Search, Users, Upload, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const projects = [
    {
      id: 1,
      name: 'Sistema de Gestión IoT',
      description: 'Desarrollo de una plataforma para gestión de dispositivos IoT en tiempo real',
      team: 'Equipo Alpha',
      leader: 'Ana García',
      members: [
        { id: 1, name: 'Ana García', role: 'Líder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana' },
        { id: 2, name: 'Carlos Ruiz', role: 'Desarrollador', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos' },
        { id: 3, name: 'María López', role: 'Diseñadora', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
        { id: 4, name: 'Juan Pérez', role: 'Tester', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan' },
      ],
      progress: 75,
      status: 'En progreso',
      category: 'IoT',
      deadline: '2026-05-01',
      tasks: 24,
      completedTasks: 18,
      files: 12,
    },
    {
      id: 2,
      name: 'App Móvil de Aprendizaje',
      description: 'Aplicación móvil educativa con gamificación para estudiantes de TIC',
      team: 'Equipo Beta',
      leader: 'Carlos Ruiz',
      members: [
        { id: 5, name: 'Laura Sánchez', role: 'Líder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura' },
        { id: 6, name: 'Pedro Gómez', role: 'Desarrollador', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro' },
        { id: 7, name: 'Sofia Torres', role: 'UX Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
      ],
      progress: 45,
      status: 'En progreso',
      category: 'Mobile',
      deadline: '2026-06-15',
      tasks: 30,
      completedTasks: 14,
      files: 8,
    },
    {
      id: 3,
      name: 'Dashboard Analytics',
      description: 'Panel de control para análisis de datos en tiempo real con visualizaciones interactivas',
      team: 'Equipo Gamma',
      leader: 'María López',
      members: [
        { id: 8, name: 'Diego Martínez', role: 'Líder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego' },
        { id: 9, name: 'Carmen Díaz', role: 'Data Analyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen' },
        { id: 10, name: 'Roberto Silva', role: 'Frontend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto' },
        { id: 11, name: 'Elena Vargas', role: 'Backend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
        { id: 12, name: 'Miguel Ángel', role: 'DevOps', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel' },
      ],
      progress: 90,
      status: 'Revisión',
      category: 'Web',
      deadline: '2026-04-25',
      tasks: 20,
      completedTasks: 18,
      files: 15,
    },
    {
      id: 4,
      name: 'Sistema de Blockchain',
      description: 'Implementación de una red blockchain para certificación académica',
      team: 'Equipo Delta',
      leader: 'Juan Pérez',
      members: [
        { id: 13, name: 'Fernanda Cruz', role: 'Líder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda' },
        { id: 14, name: 'Andrés Morales', role: 'Blockchain Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andres' },
        { id: 15, name: 'Patricia Reyes', role: 'Smart Contracts', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia' },
      ],
      progress: 30,
      status: 'En progreso',
      category: 'Blockchain',
      deadline: '2026-07-30',
      tasks: 35,
      completedTasks: 10,
      files: 5,
    },
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    toast.success('Proyecto creado exitosamente');
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proyectos Colaborativos</h1>
          <p className="text-gray-600 mt-1">Gestiona y colabora en proyectos de TIC</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
              <DialogDescription>
                Completa la información para crear un proyecto colaborativo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Nombre del Proyecto</Label>
                <Input id="project-name" placeholder="Ej: Sistema de Gestión Universitaria" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-desc">Descripción</Label>
                <Textarea id="project-desc" placeholder="Describe el proyecto..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Desarrollo Web</SelectItem>
                      <SelectItem value="mobile">Desarrollo Móvil</SelectItem>
                      <SelectItem value="iot">Internet de las Cosas</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                      <SelectItem value="ai">Inteligencia Artificial</SelectItem>
                      <SelectItem value="data">Ciencia de Datos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Fecha Límite</Label>
                  <Input id="deadline" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-name">Nombre del Equipo</Label>
                <Input id="team-name" placeholder="Ej: Equipo Innovadores" />
              </div>
              <div className="space-y-2">
                <Label>Miembros del Equipo</Label>
                <Input placeholder="Buscar usuarios..." />
                <p className="text-xs text-gray-500">Podrás agregar miembros después de crear el proyecto</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProject}>Crear Proyecto</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar proyectos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="progress">En progreso</SelectItem>
                <SelectItem value="review">En revisión</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{project.category}</Badge>
                    <Badge variant={project.status === 'Revisión' ? 'secondary' : 'default'}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription className="mt-2">{project.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progreso del Proyecto</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{project.completedTasks}/{project.tasks} tareas</span>
                  <span>•</span>
                  <span>{project.files} archivos</span>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Equipo: {project.team}</span>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((member) => (
                      <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {project.members.length > 4 && (
                    <span className="text-xs text-gray-500">+{project.members.length - 4} más</span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Vence: {new Date(project.deadline).toLocaleDateString('es-ES')}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProject(project.id)}
                >
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (() => {
            const project = projects.find(p => p.id === selectedProject)!;
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl">{project.name}</DialogTitle>
                      <DialogDescription className="mt-2">{project.description}</DialogDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <Badge>{project.status}</Badge>
                    </div>
                  </div>
                </DialogHeader>
                
                <Tabs defaultValue="overview" className="mt-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">General</TabsTrigger>
                    <TabsTrigger value="team">Equipo</TabsTrigger>
                    <TabsTrigger value="tasks">Tareas</TabsTrigger>
                    <TabsTrigger value="files">Archivos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Progreso del Proyecto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Completado</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-3" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{project.completedTasks}</div>
                            <div className="text-xs text-gray-600">Tareas Completadas</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{project.tasks - project.completedTasks}</div>
                            <div className="text-xs text-gray-600">Tareas Pendientes</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{project.files}</div>
                            <div className="text-xs text-gray-600">Archivos Subidos</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="team" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {project.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.role}</div>
                          </div>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Miembro
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {[
                        { id: 1, title: 'Diseño de base de datos', status: 'completed', assignee: 'Carlos Ruiz' },
                        { id: 2, title: 'Implementar API REST', status: 'progress', assignee: 'Ana García' },
                        { id: 3, title: 'Crear interfaz de usuario', status: 'progress', assignee: 'María López' },
                        { id: 4, title: 'Pruebas unitarias', status: 'pending', assignee: 'Juan Pérez' },
                        { id: 5, title: 'Documentación técnica', status: 'pending', assignee: 'Ana García' },
                      ].map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : task.status === 'progress' ? (
                            <Clock className="h-5 w-5 text-blue-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <div className="flex-1">
                            <div className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-500">Asignado a: {task.assignee}</div>
                          </div>
                          <Badge variant={task.status === 'completed' ? 'secondary' : task.status === 'progress' ? 'default' : 'outline'}>
                            {task.status === 'completed' ? 'Completada' : task.status === 'progress' ? 'En progreso' : 'Pendiente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {[
                        { id: 1, name: 'Diseño_arquitectura.pdf', size: '2.4 MB', date: '2026-04-10', uploader: 'Carlos Ruiz' },
                        { id: 2, name: 'Reporte_avance_marzo.docx', size: '1.8 MB', date: '2026-04-05', uploader: 'Ana García' },
                        { id: 3, name: 'Mockups_interfaz.fig', size: '5.2 MB', date: '2026-04-01', uploader: 'María López' },
                        { id: 4, name: 'Código_fuente_v1.zip', size: '12.3 MB', date: '2026-03-28', uploader: 'Juan Pérez' },
                      ].map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">{file.size} • {file.uploader} • {file.date}</div>
                          </div>
                          <Button variant="outline" size="sm">Descargar</Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Subir Archivo
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
