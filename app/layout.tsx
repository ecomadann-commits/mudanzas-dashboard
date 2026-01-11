import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mudanzas Express - Dashboard',
  description: 'Panel de atención al cliente WhatsApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}