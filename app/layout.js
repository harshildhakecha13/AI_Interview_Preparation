import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import { AuthProvider } from "@/components/AuthProvider";

const font = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "AI Mock Interview",
    template: "%s | AI Mock Interview",
  },
  description:
    "Practice with AI-powered mock interviews and get instant personalized feedback. Ace your next job interview.",
  keywords: ["mock interview", "AI interview", "interview practice", "job interview prep"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
