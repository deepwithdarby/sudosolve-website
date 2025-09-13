import { SudokuSolverForm } from "@/components/sudoku-solver-form";
import { Puzzle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <Card className="mb-6 bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl shadow-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Puzzle className="w-12 h-12 text-primary-foreground/90" />
            <h1 className="text-6xl font-headline tracking-tight text-center text-primary-foreground drop-shadow-lg">
              SudoSolve
            </h1>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8 max-w-lg bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl shadow-primary/20">
        <CardContent className="p-6">
          <p className="text-center text-primary-foreground/80 font-medium drop-shadow-sm">
            Stuck on a Sudoku? Upload a photo of your puzzle, and let our AI solver handle the rest. Get the solution in seconds!
          </p>
        </CardContent>
      </Card>
      <SudokuSolverForm />
    </main>
  );
}
