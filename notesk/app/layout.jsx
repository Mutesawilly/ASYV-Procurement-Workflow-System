import React from 'react';
import { ThemeProvider } from "next-themes";
import "./globals.css";

// --- START: Added Metadata ---
export const metadata = {
// Essential Meta Tags
  title: 'ASYV - Procurement Workflow Management System', // Primary title that appears in the browser tab
  description: 'Boost efficiency and compliance at ASYV. Our procurement workflow software eliminates manual paperwork, speeds up approval cycles, and reduces costs through better spend control and automated vendor management.', // SEO description
};

function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;