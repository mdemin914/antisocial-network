import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antisocial Network",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description || ""} />
        <title>{metadata.title}</title>
      </head>
      <body>
        <main>
          <header>
            <a href="/">
              <h1>{metadata.title}</h1>
            </a>
            <nav>
              <a href="/idea">Ideas</a>
              <a href="/doc">Docs</a>
              <a href="/agent">Agents</a>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
