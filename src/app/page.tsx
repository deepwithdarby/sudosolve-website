import { SudokuSolverForm } from "@/components/sudoku-solver-form";
import { Puzzle } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Puzzle className="w-12 h-12 text-primary-foreground/90" />
        <h1 className="text-6xl font-headline tracking-tight text-center text-primary-foreground drop-shadow-lg">
          SudoSolve
        </h1>
      </div>
      <p className="text-center text-primary-foreground/80 max-w-lg mb-8 px-4 font-medium drop-shadow-sm">
        Stuck on a Sudoku? Upload a photo of your puzzle, and let our AI solver handle the rest. Get the solution in seconds!
      </p>
      <SudokuSolverForm />
    </main>
  );
}
