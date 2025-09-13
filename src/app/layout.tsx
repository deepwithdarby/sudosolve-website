import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'SudoSolve',
  description: 'Upload a Sudoku puzzle and get it solved instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <svg style={{ position: 'absolute', width: 0, height: 0 }} >
          <defs>
            <filter id="melt-filter">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.02" 
                numOctaves="1" 
                result="turbulence"
                seed="0"
              >
                 <animate 
                    attributeName="baseFrequency" 
                    dur="20s" 
                    values="0.02;0.03;0.02" 
                    repeatCount="indefinite"
                  />
              </feTurbulence>
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="turbulence" 
                scale="5" 
                xChannelSelector="R" 
                yChannelSelector="G"
              >
                <animate
                  attributeName="scale"
                  dur="20s"
                  values="5;15;5"
                  repeatCount="indefinite"
                />
              </feDisplacementMap>
            </filter>
          </defs>
        </svg>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
