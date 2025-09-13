
"use client";

import { useEffect, useState, useRef } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { solveSudoku } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, WandSparkles, X, AlertCircle, Download, Trash2 } from "lucide-react";

const initialState: { solvedImageUrl: string | null; error: string | null } = {
  solvedImageUrl: null,
  error: null,
};

function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={!hasFile || pending}
      className="w-full text-lg py-7"
      size="lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Solving...
        </>
      ) : (
        <>
          <WandSparkles className="mr-2 h-6 w-6" />
          Solve Puzzle
        </>
      )}
    </Button>
  );
}

export function SudokuSolverForm() {
  const [state, formAction, isPending] = useActionState(solveSudoku, initialState);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4.5 * 1024 * 1024) { // Limit file size to ~4.5MB
        setLocalError("File is too large. Please upload an image under 4.5MB.");
        return;
      }
      setLocalError(null);
      setFile(selectedFile);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(selectedFile));
      
      // Reset the form state when a new file is selected.
      if (state.solvedImageUrl || state.error) {
        const emptyFormData = new FormData();
        formAction(emptyFormData);
      }
    }
  };
  
  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);
    setLocalError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    if (formRef.current) {
        formRef.current.reset();
    }
    const emptyFormData = new FormData();
    // This is the key change: we create a new FormData with a 'reset' flag
    // to signal the server action to clear its state.
    emptyFormData.append('image', new File([], ''));
    formAction(emptyFormData);
  };

  const handleDownload = () => {
    if (!state.solvedImageUrl) return;
    const link = document.createElement("a");
    link.href = state.solvedImageUrl;
    link.download = "solved-sudoku.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  useEffect(() => {
    // This effect is to clear the file input after a successful solve.
    if (state.solvedImageUrl && file) {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  }, [state.solvedImageUrl, file]);


  const currentError = localError || (state.error && !isPending ? state.error : null);
  const isSolved = state.solvedImageUrl && !isPending;


  const DisplayContent = () => {
    const imageToDisplay = isSolved ? state.solvedImageUrl : previewUrl;

    if (imageToDisplay) {
      return (
        <div className="relative h-full w-full">
            <Image
            src={imageToDisplay}
            alt={isSolved ? "Solved Sudoku" : "Sudoku preview"}
            fill
            className="rounded-md object-contain"
            />
            {isPending && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-md transition-opacity duration-300">
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    <p className="text-white/90 mt-4 text-lg font-medium">Solving puzzle...</p>
                </div>
            )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground p-4">
        <UploadCloud className="w-16 h-16 text-primary/70" />
        <span className="text-center font-medium">
          Drag & drop a Sudoku image here, or click to select a file
        </span>
        <span className="text-xs">PNG, JPG, or WEBP up to 4.5MB</span>
      </div>
    );
  };


  return (
    <Card className="w-full max-w-lg bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl shadow-primary/20 melt-card">
      <CardContent className="p-6">
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="sudoku-image"
              className="relative flex flex-col items-center justify-center w-full h-80 rounded-lg border-2 border-dashed border-primary/30 cursor-pointer bg-black/5 hover:border-primary/50 hover:bg-black/10 transition-all duration-300"
            >
              <DisplayContent />
            </label>
            <input
              ref={fileInputRef}
              id="sudoku-image"
              name="image"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="sr-only"
              disabled={isPending}
            />
             {previewUrl && !isSolved && !isPending && (
                <Button variant="ghost" size="icon" type="button" aria-label="Clear preview" className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white hover:text-white rounded-full h-8 w-8 z-10" onClick={handleReset}>
                    <X className="h-4 w-4"/>
                </Button>
            )}
          </div>
          
          {currentError && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{currentError}</AlertDescription>
            </Alert>
          )}

          {isSolved ? (
            <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" size="lg" className="py-7 text-base" onClick={handleDownload}>
                    <Download className="mr-2 h-5 w-5" />
                    Download
                </Button>
                <Button type="button" variant="secondary" size="lg" className="py-7 text-base" onClick={handleReset}>
                    <Trash2 className="mr-2 h-5 w-5" />
                    New Scan
                </Button>
            </div>
          ) : (
            <SubmitButton hasFile={!!file} />
          )}

        </form>
      </CardContent>
    </Card>
  );
}
