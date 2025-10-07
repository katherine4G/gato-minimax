// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Juego del Gato",
  description: "Juego del Gato con Mini-Max",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="body">
        <main>{children}</main>
      </body>
    </html>
  );
}
