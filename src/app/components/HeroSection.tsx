import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";

export default function HeroSection() {
    return (
        <section className="relative h-screen w-full">
            {/* Background clipped separately so cards can overflow */}
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    src="/images/slide1.jpg"
                    alt="Hero background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/45" />
            </div>

            <div className="relative z-10 flex h-full flex-col">
                <Header />

                <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center text-white">
                    <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                        Planifica tu viaje en un solo lugar
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/dashboard">
                            <button className="rounded-full px-8 py-3 text-sm bg-cyan-500 font-medium text-white transition duration-300 ease-in-out hover:opacity-80" >
                                Crear viaje
                            </button>
                        </Link>
                        <button className="w-fit rounded-full border-[1px] border-[#ffffff8f] px-8 py-3 text-sm font-thin transition duration-300 ease-in-out hover:bg-white hover:text-black">
                            Ver cómo funciona
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats cards — mitad sobre hero, mitad sobre la siguiente sección */}
            <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 px-6 md:px-16">
                <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-10 md:grid-cols-4 md:gap-16">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-6 text-center shadow-lg opacity-85">
                            <span className="text-2xl font-bold text-gray-900 md:text-3xl">{value}</span>
                            <span className="mt-1 text-xs text-gray-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const stats = [
    { value: "50%",  label: "Reducción de tiempo"   },
    { value: "4",    label: "Servicios integrados"   },
    { value: "1",    label: "Plataforma"             },
    { value: "180+", label: "Países disponibles"     },
];
