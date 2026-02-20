'use client'; // Necesario porque usamos interactividad del cliente (hooks y callbacks)

import Image from "next/image";
import Script from "next/script";
import { useRef } from "react";

export default function Home() {
  // Referencia al contenedor HTML donde Google dibujará el botón
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Función que se ejecuta cuando el usuario inicia sesión con éxito
  const handleCredentialResponse = (response: any) => {
    console.log("Token JWT de Google:", response.credential);
    // Aquí es donde enviarías este token a tu backend (ej. Node.js o Java) para validar la sesión
  };

  // Función para inicializar el botón una vez que el script de Google haya cargado
  const initializeGoogleSignIn = () => {
    // Verificamos que el objeto global de Google exista
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: "1026566079795-m51j9o7849nbnga5vrhi2kbhbblfiplg.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      
      (window as any).google.accounts.id.renderButton(
        googleButtonRef.current,
        { theme: "outline", size: "large", type: "standard" }
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
      {/* 1. Usamos next/script para cargar el SDK de manera óptima */}
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={initializeGoogleSignIn}
      />

      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        
        {/* 2. Este es el contenedor donde se inyectará el botón de Google */}
        <div ref={googleButtonRef} className="my-8"></div>
        
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}