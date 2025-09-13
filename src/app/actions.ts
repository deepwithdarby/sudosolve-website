
"use server";

interface FormState {
  solvedImageUrl: string | null;
  error: string | null;
}

export async function solveSudoku(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    // This is part of the reset flow, don't treat it as an error.
    if (!prevState.solvedImageUrl && !prevState.error) {
       return { solvedImageUrl: null, error: "Please select an image file." };
    }
    return { solvedImageUrl: null, error: null };
  }

  if (!file.type.startsWith("image/")) {
    return {
      solvedImageUrl: null,
      error: "Invalid file type. Please upload an image.",
    };
  }

  const apiFormData = new FormData();
  apiFormData.append("file", file);

  try {
    const response = await fetch(
      "https://satyaprakashmohanty13-sudoku-solver-ocr.hf.space/solve",
      {
        method: "POST",
        body: apiFormData,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
        console.error("API Error:", responseData);
        return {
            solvedImageUrl: null,
            error: responseData.message || `Failed to solve puzzle. The server responded with status ${response.status}.`,
        };
    }
    
    if (responseData.image) {
        const dataUrl = `data:image/png;base64,${responseData.image}`;
        return { solvedImageUrl: dataUrl, error: null };
    } else {
        return { solvedImageUrl: null, error: responseData.message || "The solver could not process this image." };
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    return {
      solvedImageUrl: null,
      error: "Failed to connect to the solver service. Please check your network and try again.",
    };
  }
}
