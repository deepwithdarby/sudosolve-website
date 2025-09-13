import { SudokuSolverForm } from "@/components/sudoku-solver-form";
import { Puzzle, UploadCloud, WandSparkles, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <Card className="mb-6 bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl shadow-primary/20 melt-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Puzzle className="w-12 h-12 text-primary-foreground/90" />
            <h1 className="text-6xl font-headline tracking-tight text-center text-primary-foreground drop-shadow-lg">
              SudoSolve
            </h1>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8 max-w-lg bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl shadow-primary/20 melt-card">
        <CardContent className="p-6">
          <p className="text-center text-primary-foreground/80 font-medium drop-shadow-sm">
            Stuck on a Sudoku? Upload a photo of your puzzle, and let our AI solver handle the rest. Get the solution in seconds!
          </p>
        </CardContent>
      </Card>
      <SudokuSolverForm />
      <Card className="mt-8 w-full max-w-lg bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl shadow-primary/20 melt-card">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary-foreground/90 drop-shadow-lg text-center">
            Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 text-primary-foreground/80 font-medium drop-shadow-sm">
            <li className="flex items-start gap-4">
              <UploadCloud className="w-6 h-6 text-primary-foreground/90 mt-1 flex-shrink-0" />
              <span>
                <strong>Upload & Go:</strong> Simply upload an image of your Sudoku puzzle to get started.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <WandSparkles className="w-6 h-6 text-primary-foreground/90 mt-1 flex-shrink-0" />
              <span>
                <strong>AI-Powered Solution:</strong> Our smart solver uses advanced OCR to read the board and find the solution instantly.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <Download className="w-6 h-6 text-primary-foreground/90 mt-1 flex-shrink-0" />
              <span>
                <strong>Download & Save:</strong> Easily download the solved puzzle as a PNG image to your device.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
