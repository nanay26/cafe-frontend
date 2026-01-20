import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import SmartChatbot from '@/components/ChatBot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tersenyum Kopi - Order dengan QR Code',
  description: 'Pesan menu kafe dengan scan QR code',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          {children}
          {/* Chatbot akan otomatis melayang di atas keranjang di semua halaman */}
          <SmartChatbot />
        </Providers>
      </body>
    </html>
  );
}