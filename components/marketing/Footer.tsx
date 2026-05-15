import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold mb-3">
              <BrainCircuit className="h-5 w-5 text-blue-500" />
              ResumeAI
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered resume building and job matching for the modern job seeker.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Product</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 ResumeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
