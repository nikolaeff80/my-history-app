import './globals.css';

export const metadata = {
  title: 'History Learning App',
  description: 'Интерактивное изучение истории',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}