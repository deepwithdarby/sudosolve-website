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
    return { solvedImageUrl: null, error: "Please select an image file." };
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

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        return {
            solvedImageUrl: null,
            error: `Failed to solve puzzle. The server responded with status ${response.status}. Please try a clearer image.`,
        };
    }

    const blob = await response.blob();

    if (blob.type.startsWith("image/")) {
        const buffer = await blob.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = blob.type;
        const dataUrl = `data:${mimeType};base64,${base64}`;
        return { solvedImageUrl: dataUrl, error: null };
    } else {
        const errorText = await blob.text();
        console.error("API returned non-image data:", errorText);
        try {
            const errorJson = JSON.parse(errorText);
            return { solvedImageUrl: null, error: errorJson.error || "The solver could not process this image." };
        } catch {
            return { solvedImageUrl: null, error: "Received an unexpected response from the solver." };
        }
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return {
      solvedImageUrl: null,
      error: "Failed to connect to the solver service. Please check your network and try again.",
    };
  }
}
