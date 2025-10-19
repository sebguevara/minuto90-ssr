'use client'

import Link from 'next/link';
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry';
import { Facebook, Youtube, Instagram, Twitter } from 'lucide-react';
import { FooterYear } from './FooterYear'

export const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground mt-auto w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-evenly md:items-center border-t border-border pt-8 text-sm gap-4">
          <div className='hidden md:flex flex-col justify-center items-center mx-8 w-max pb-4'>
            <div className="flex items-center mb-4 relative w-40 h-24">
              <ImageWithRetry src="/logo/minuto90.png" alt="Minuto90 Logo" fill sizes="120px" className="object-contain" />
            </div>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 content-center'>
          <div>
            <h3 className="font-semibold mb-3">Información</h3>
            <ul className="space-y-2">
              <li><Link href="/sobre-nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">Preguntas Frecuentes (FAQ)</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/politicas-de-privacidad" className="hover:text-primary transition-colors">Políticas de Privacidad</Link></li>
              <li><Link href="/terminos-de-servicio" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
            </ul>
          </div>

          {/* <div>
            <h3 className="font-semibold mb-3">Deportes</h3>
            <div className='grid grid-cols-3 gap-4'>
              <ul className="space-y-2">
                <li><Link href="/futbol" className="hover:text-primary transition-colors">Fútbol</Link></li>
                <li><Link href="/basquetball" className="hover:text-primary transition-colors">Basquet</Link></li>
                <li><Link href="/formula-1" className="hover:text-primary transition-colors">Formula 1</Link></li>
                <li><Link href="/volleyball" className="hover:text-primary transition-colors">Volleyball</Link></li>
              </ul>
              <ul className="space-y-2">
                <li><Link href="/handball" className="hover:text-primary transition-colors">Handball</Link></li>
                <li><Link href="/hockey" className="hover:text-primary transition-colors">Hockey</Link></li>
                <li><Link href="/rugby" className="hover:text-primary transition-colors">Rugby</Link></li>
                <li><Link href="/baseball" className="hover:text-primary transition-colors">Baseball</Link></li>
              </ul>
              <ul className="space-y-2">
                <li><Link href="/nba" className="hover:text-primary transition-colors">NBA</Link></li>
                <li><Link href="/nfl" className="hover:text-primary transition-colors">NFL</Link></li>
                <li><Link href="/afl" className="hover:text-primary transition-colors">AFL</Link></li>
                <li><Link href="/mma" className="hover:text-primary transition-colors">MMA</Link></li>
              </ul>
            </div>
          </div> */}
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-12 border-t border-border pt-6">
          © <FooterYear /> Minuto90. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};