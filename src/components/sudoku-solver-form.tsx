
"use client";

import { useEffect, useState, useRef, useActionState } from "react";
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
      className="w-full text-lg py-6"
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
  const [state, formAction] = useActionState(solveSudoku, initialState);
  const { pending } = useFormStatus();

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
      // Clear previous solved state when a new file is chosen
      if (state.solvedImageUrl || state.error) {
        formRef.current?.reset();
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
    if (state.solvedImageUrl && file) {
        // Clear file input after a successful solve to transition to the "solved" state
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  }, [state.solvedImageUrl, file]);


  const currentError = localError || (state.error && !pending ? state.error : null);
  const isSolved = state.solvedImageUrl && !file && !pending;


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
            {pending && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-md transition-opacity duration-300">
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
    <Card className="w-full max-w-lg bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl shadow-primary/10">
      <CardContent className="p-6">
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="sudoku-image"
              className="relative flex flex-col items-center justify-center w-full h-80 rounded-lg border-2 border-dashed border-primary/30 cursor-pointer bg-black/10 hover:border-primary/50 hover:bg-black/20 transition-all duration-300"
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
              disabled={pending}
            />
             {previewUrl && !pending && (
                <Button variant="ghost" size="icon" type="button" aria-label="Clear preview" className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white hover:text-white rounded-full h-8 w-8 z-10" onClick={handleReset}>
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
                <Button type="button" variant="outline" size="lg" onClick={handleDownload}>
                    <Download className="mr-2 h-5 w-5" />
                    Download
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={handleReset}>
                    <Trash2 className="mr-2 h-5 w-5" />
                    Clear
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
