import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Skill Chef - AI-Powered Social Cooking Platform',
  description: 'Pinterest + Instagram meets AI Recipe Assistant, custom meal planners, cooking challenges, and vertical reels.',
  metadataBase: new URL('https://skillchef.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#f8f9fa] text-[#1a1d20] dark:bg-[#0d0d0f] dark:text-[#f8f9fa] min-h-screen selection:bg-brand-500 selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
