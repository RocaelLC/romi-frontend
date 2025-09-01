
export const metadata = { title: "ROMI — Presentación" };
import { Target, Handshake, Heart, Lightbulb, Shield, Users, Globe, Zap } from "lucide-react";

export default function Page() {
    return (
        <main className="max-w-6xl mx-auto px-4 py-14">
            <div className="container">
                <h1 className="text-3xl font-bold text-[#023E8A] text-center">Transformando la Medicina del Futuro</h1>
                <p className="mt-2 text-zinc-600 text-center text-2xl">
                    Somos una plataforma integral que conecta profesionales de la salud con tecnología
                    avanzada para mejorar la atención médica en todo el mundo.
                </p>
            </div>

            <div className="text-left mt-18">
                <h1 className="font-semibold text-[#023E8E] text-4xl ">¿Quiénes somos?</h1>
            </div>
            <section className="mt-10 grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border p-6">
                    <p className="text-base text-zinc-600 mt-2">
                        HubROMI nació de la visión de democratizar el acceso a la salud a través de la tecnología.
                        Somos un equipo multidisciplinario de médicos, ingenieros y especialistas en salud digital.
                    </p>
                    <p className="mt-4">
                        Nuestra plataforma integra inteligencia artificial, telemedicina, educación médica continua
                        y herramientas de gestión clínica en un ecosistema completo que empodera a los profesionales de la salud.
                    </p>
                    <p className="mt-4">
                        Con presencia en más de 15 países y una comunidad de más de 10,000 profesionales de la salud médicos,
                        continuamos innovando para hacer que la medicina sea más accesible, eficiente y efectiva.
                    </p>
                </div>

               
                <div className="rounded-2xl border p-6 flex items-center justify-center">
                    <img
                        src="images/doctor.jpg"
                        alt="Doctor escribiendo"
                        className="rounded-xl shadow-lg object-cover w-full h-80 md:h-[400px]"
                    />
                </div>
            </section>



            <h1 className="text-3xl font-bold text-[#023E8A] text-center m-8">Nuestra Misión y Visión</h1>
            <section className="mt-10 grid md:grid-cols-2 gap-6 ">
                <div className="rounded-2xl border p-6">
                    <Handshake className="mx-auto w-15 h-15 text-blue-600" />
                    <h2 className="font-semibold text-center">Misión</h2>
                    <p className="text-sm text-zinc-600 mt-2">Democratizar el acceso a la atención médica de calidad
                        mediante tecnología innovadora, conectando profesionales de la salud con herramientas
                        avanzadas que mejoran los resultados clínicos y la experiencia del paciente.
                    </p>
                </div>
                <div className="rounded-2xl border p-6 text-center space-y-3">
                    <Target className="mx-auto w-15 h-15 text-blue-600" />
                    <h2 className="font-semibold text-xl">Visión</h2>
                    <p className="text-sm text-zinc-600 mt-2">
                        Ser la plataforma líder mundial en salud digital, transformando la
                        medicina a través de la inteligencia artificial y la telemedicina,
                        creando un futuro donde la atención médica de excelencia sea accesible
                        para todos.
                    </p>
                </div>
            </section>

            <h1 className="text-center text-3xl font-bold text-[#023E8A] m-12">Nuestros Valores</h1>

            <section className="mt-10 grid md:grid-cols-3 gap-6">
                <div className="rounded-3xl border p-6 shadow-inner mt-6 text-center">
                    <Heart className="mx-auto w-15 h-15 text-blue-600" />
                    <h2 className="font-semibold text-xl mt-7">Compromiso con la Salud</h2>
                    <p className="text-sm text-zinc-600 mt-2">
                        Dedicados a mejorar la calidad de vida de las personas a través de la innovación médica.
                    </p>
                </div>
                <div className="rounded-3xl border p-6 shadow-inner mt-6 text-center">
                    <Lightbulb className="mx-auto w-15 h-15 text-blue-600" />
                    <h2 className="font-semibold text-xl mt-7">Innovación Constante</h2>
                    <p className="text-sm text-zinc-600 mt-2">
                        Desarrollamos soluciones tecnológicas avanzadas para los desafíos médicos actuales.
                    </p>
                </div>
                <div className="rounded-3xl border p-6 shadow-inner mt-6 text-center">
                    <Shield className="mx-auto w-15 h-15 text-blue-600" />
                    <h2 className="font-semibold text-xl mt-7">Seguridad y Privacidad</h2>
                    <p className="text-sm text-zinc-600 mt-2">
                        Protegemos la información médica con los más altos estándares de seguridad.
                    </p>
                </div>
                <div className="rounded-2xl border p-6 shadow-inner mt-6 text-center">
                    <Users className="mx-auto w-15 h-15 text-blue-600" />
                    <h2 className="font-semibold text-xl mt-7">Colaboración</h2>
                    <p className="text-sm text-zinc-600 mt-2">
                        Fomentamos el trabajo en equipo entre profesionales de la salud.
                    </p>
                </div>
                <div className="rounded-2xl border p-6 shadow-inner mt-6 text-center">
                    <Globe className="mx-auto w-15 h-15 text-blue-600" />
                    <h2 className="font-semibold text-xl mt-7">Accesibilidad Global</h2>
                    <p className="text-sm text-zinc-600 mt-2">
                        Hacemos que la atención médica de calidad sea accesible en todo el mundo.
                    </p>
                </div>
                <div className="rounded-2xl border p-6 shadow-inner mt-6 text-center">
                    <Zap className="mx-auto w-15 h-15 text-blue-600" />
                    <h2 className="font-semibold text-xl mt-7">Eficiencia</h2>
                    <p className="text-sm text-zinc-600 mt-2">
                        Optimizamos los procesos médicos para brindar atención más
                    </p>
                </div>



            </section>
        </main >
    );
}
