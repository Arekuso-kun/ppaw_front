import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Convert = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTargetFormat("");
      setStatusMessage(null);
    }
  };

  const handleFormatChange = (event: SelectChangeEvent) => {
    setTargetFormat(event.target.value as string);
  };

  const saveUsageLog = async (file: File) => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) throw new Error("Utilizatorul nu este autentificat.");

      const user = JSON.parse(userString);

      const userId = user.id || user.userid || 1;

      const sourceExtension = file.name.split(".").pop()?.toUpperCase() || "FILE";
      const conversionType = `${sourceExtension}_TO_${targetFormat}`;

      const payload = {
        userid: userId,
        conversiontype: conversionType,
        status: "success",
        filesize: file.size,
      };

      const response = await fetch(`${API_BASE_URL}/usage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Eroare la salvarea log-ului în baza de date.");
      }

      setStatusMessage({ type: "success", text: `Conversie finalizată cu succes!` });
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "A apărut o eroare de conexiune.",
      });
    }
    setIsConverting(false);
  };

  const startConversion = () => {
    if (!selectedFile || !targetFormat) return;

    setIsConverting(true);
    setStatusMessage(null);

    setTimeout(() => {
      saveUsageLog(selectedFile);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <Typography variant="h4" className="mb-6 font-bold text-gray-700">
            Convertor Imagini
          </Typography>

          <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

          <div
            onClick={!isConverting ? handleUploadClick : undefined}
            className={`border-2 border-dashed rounded-lg p-10 transition cursor-pointer flex flex-col items-center justify-center
              ${
                isConverting
                  ? "bg-gray-50 border-gray-300 cursor-not-allowed"
                  : "border-indigo-300 bg-indigo-50 hover:bg-indigo-100"
              }
            `}
          >
            <CloudUploadIcon className={`text-6xl mb-4 ${isConverting ? "text-gray-400" : "text-indigo-400"}`} />

            {selectedFile ? (
              <Box>
                <Typography variant="h6" className="text-gray-800 font-bold">
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h6" className="text-indigo-900">
                  Trage imaginea aici
                </Typography>
                <Typography variant="body2" className="text-indigo-600 mb-4">
                  sau apasă pentru a încărca
                </Typography>
              </>
            )}

            {!selectedFile && (
              <Button variant="contained" className="bg-indigo-600 text-transform-none mt-4">
                Alege Imagine
              </Button>
            )}
          </div>

          {selectedFile && !isConverting && !statusMessage && (
            <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="target-format-label">Alege formatul de conversie</InputLabel>
                <Select
                  labelId="target-format-label"
                  id="target-format"
                  value={targetFormat}
                  label="Alege formatul de conversie"
                  onChange={handleFormatChange}
                >
                  {["JPG", "PNG", "GIF", "WEBP", "BMP", "TIFF"]
                    .filter((format) => format !== selectedFile?.name.split(".").pop()?.toUpperCase())
                    .map((format) => (
                      <MenuItem key={format} value={format}>
                        {format}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Button
                onClick={startConversion}
                variant="contained"
                size="large"
                fullWidth
                disabled={!targetFormat}
                className={`mt-2 ${!targetFormat ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
              >
                Start Conversie
              </Button>
            </Box>
          )}

          {isConverting && <div className="mt-6 text-center text-indigo-600 font-medium">Se procesează imaginea…</div>}

          {statusMessage && (
            <div className="mt-6">
              <Alert severity={statusMessage.type}>{statusMessage.text}</Alert>
              {statusMessage.type === "success" && (
                <Button
                  onClick={() => {
                    setSelectedFile(null);
                    setTargetFormat("");
                    setStatusMessage(null);
                  }}
                  variant="outlined"
                  size="small"
                  className="mt-2"
                >
                  Convertește altă imagine
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Convert;
