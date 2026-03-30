import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

type UploadState = "idle" | "parsing" | "success" | "error";

export const UploadPage = () => {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [columns, setColumns] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleFile = useCallback((file: File) => {
    setState("parsing");
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          setRowCount(results.data.length);
          setColumns(results.meta.fields || []);
          // Store in sessionStorage for dashboard
          sessionStorage.setItem("csv_data", JSON.stringify(results.data));
          sessionStorage.setItem("csv_columns", JSON.stringify(results.meta.fields));
          setState("success");
        } else {
          setState("error");
        }
      },
      error: () => setState("error"),
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) handleFile(file);
  }, [handleFile]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Upload de Dados</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Importe seu CSV com dados de campanhas, leads e vendas
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6"
      >
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-card p-10 cursor-pointer transition-colors"
        >
          <div className="rounded-2xl gradient-primary p-4 shadow-glow-primary">
            <Upload className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Toque para selecionar ou arraste um arquivo
            </p>
            <p className="text-xs text-muted-foreground mt-1">CSV até 10MB</p>
          </div>
          <input type="file" accept=".csv" className="hidden" onChange={handleInput} />
        </label>
      </motion.div>

      <AnimatePresence mode="wait">
        {state === "parsing" && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Processando {fileName}...</p>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-4">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Importação concluída!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {rowCount.toLocaleString()} linhas · {columns.length} colunas
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                <p className="text-xs font-medium text-foreground">{fileName}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {columns.map((col) => (
                  <span key={col} className="text-[11px] px-2 py-1 rounded-lg bg-secondary text-secondary-foreground font-mono">
                    {col}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-2xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-primary transition-transform active:scale-[0.98]"
            >
              Ver Dashboard →
            </button>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4"
          >
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Erro ao processar</p>
              <p className="text-xs text-muted-foreground mt-0.5">Verifique o formato do arquivo CSV</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {state === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Ou use dados de exemplo</p>
          <button
            onClick={() => {
              sessionStorage.removeItem("csv_data");
              sessionStorage.removeItem("csv_columns");
              navigate("/dashboard");
            }}
            className="w-full rounded-2xl border border-border bg-card py-3.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors active:scale-[0.98]"
          >
            Carregar dados demo
          </button>
        </motion.div>
      )}
    </div>
  );
};
