import { SudokuSolverForm } from "@/components/sudoku-solver-form";
import { Puzzle } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Puzzle className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
          SudoSolve
        </h1>
      </div>
      <p className="text-center text-muted-foreground max-w-lg mb-8 px-4">
        Stuck on a Sudoku? Upload a photo of your puzzle, and let our AI solver handle the rest. Get the solution in seconds!
      </p>
      <SudokuSolverForm />
    </main>
  );
}
