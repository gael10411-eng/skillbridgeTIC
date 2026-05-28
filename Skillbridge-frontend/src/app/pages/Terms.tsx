import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, ShieldCheck } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const sections = [
  {
    title: '1. Uso de la plataforma',
    content:
      'SkillBridge es una plataforma académica colaborativa para gestionar proyectos, mentorías, cursos y certificaciones. Al crear una cuenta, aceptas utilizarla de forma responsable, respetuosa y conforme a fines educativos o profesionales.'
  },
  {
    title: '2. Registro y seguridad de la cuenta',
    content:
      'Debes proporcionar información veraz y mantener la confidencialidad de tus credenciales. Cualquier actividad realizada desde tu cuenta se considera responsabilidad del usuario registrado.'
  },
  {
    title: '3. Contenido y proyectos',
    content:
      'Los proyectos, descripciones, imágenes, entregables y materiales que subas deben ser propios o contar con autorización de uso. No se permite publicar contenido ilegal, ofensivo, discriminatorio o que vulnere derechos de terceros.'
  },
  {
    title: '4. Mentorías y comunicación',
    content:
      'Las mentorías deben realizarse con respeto, puntualidad y propósito académico. La plataforma puede registrar información básica de solicitudes, fechas, estado y retroalimentación para dar seguimiento al progreso.'
  },
  {
    title: '5. Certificaciones y progreso',
    content:
      'Las certificaciones, avances y estadísticas reflejan la información disponible en la plataforma. SkillBridge puede actualizar requisitos, niveles o criterios de validación para mantener la calidad académica.'
  },
  {
    title: '6. Datos personales',
    content:
      'La plataforma almacena datos como nombre, correo, rol, avatar, proyectos, mentorías y certificaciones para operar la experiencia del usuario. Estos datos se usan para identificación, seguimiento académico y funcionamiento de los servicios.'
  },
  {
    title: '7. Suspensión o cancelación',
    content:
      'SkillBridge puede suspender cuentas que incumplan estos términos, afecten la seguridad del sistema o hagan uso indebido de la plataforma.'
  },
  {
    title: '8. Cambios en los términos',
    content:
      'Estos términos pueden actualizarse para reflejar cambios en la plataforma, la ley o las políticas internas. La fecha de última actualización indicará la versión vigente.'
  }
];

export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SkillBridge
            </span>
          </Link>

          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones</h1>
              <p className="text-gray-600">Última actualización: 27 de mayo de 2026</p>
            </div>
          </div>

          <p className="text-gray-700 max-w-3xl">
            Estos términos regulan el acceso y uso de SkillBridge. Al registrarte o utilizar la plataforma, aceptas estas condiciones.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
            <CardDescription>
              Usa la plataforma con fines académicos, protege tu cuenta, respeta a otros usuarios y publica únicamente contenido autorizado.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
            <CardDescription>
              Para dudas sobre estos términos, contacta al equipo administrador de SkillBridge desde los canales oficiales de la plataforma.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
