import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Trash2,
  Upload,
} from "lucide-react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/app/useAppState";
import { PageHeader } from "@/components/common/PageHeader";

type UploadState = "idle" | "parsing" | "success" | "error";

export const UploadPage = () => {
  const navigate = useNavigate();
  const {
    hasImportedData,
    isDemo,
    setHasImportedData,
    setIsDemo,
    setSelectedChannel,
  } = useAppState();
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [state, setState] = useState<UploadState>("idle");

  const handleFile = useCallback(
    (file: File) => {
      setState("parsing");
      setFileName(file.name);

      Papa.parse(file, {
        complete: (results) => {
          if (results.data.length > 0) {
            setRowCount(results.data.length);
            setColumns(results.meta.fields || []);
            sessionStorage.setItem("csv_data", JSON.stringify(results.data));
            sessionStorage.setItem("csv_columns", JSON.stringify(results.meta.fields));
            setHasImportedData(true);
            setIsDemo(false);
            setState("success");
            return;
          }

          setState("error");
        },
        error: () => setState("error"),
        header: true,
        skipEmptyLines: true,
      });
    },
    [setHasImportedData, setIsDemo],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

      if (file?.name.endsWith(".csv")) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleClearData = () => {
    sessionStorage.removeItem("csv_data");
    sessionStorage.removeItem("csv_columns");
    setColumns([]);
    setFileName("");
    setHasImportedData(false);
    setIsDemo(false);
    setRowCount(0);
    setSelectedChannel(null);
    setState("idle");
  };

  const handleLoadDemo = () => {
    sessionStorage.removeItem("csv_data");
    sessionStorage.removeItem("csv_columns");
    setHasImportedData(false);
    setIsDemo(true);
    setSelectedChannel(null);
    navigate("/dashboard");
  };

  return (
    <section className="screen-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Importacao de CSV"
          description="Importe seu arquivo com dados de campanhas, leads e vendas."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-card p-10 transition-colors hover:border-primary/50"
        >
          <div className="rounded-2xl gradient-primary p-4 shadow-glow-primary">
            <Upload className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Toque para selecionar ou arraste um arquivo
            </p>
            <p className="mt-1 text-xs text-muted-foreground">CSV ate 10MB</p>
          </div>
          <input type="file" accept=".csv" className="hidden" onChange={handleInput} />
        </label>
      </motion.div>

      <AnimatePresence mode="wait">
        {state === "parsing" ? (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Processando {fileName}...</p>
          </motion.div>
        ) : null}

        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">Importacao concluida</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {rowCount.toLocaleString()} linhas • {columns.length} colunas
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                <p className="text-xs font-medium text-foreground">{fileName}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {columns.map((column) => (
                  <span
                    key={column}
                    className="rounded-lg bg-secondary px-2 py-1 text-[11px] font-mono text-secondary-foreground"
                  >
                    {column}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-2xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-primary transition-transform active:scale-[0.98]"
            >
              Ver dashboard
            </button>
          </motion.div>
        ) : null}

        {state === "error" ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground">Erro ao processar</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Verifique o formato do arquivo CSV
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {state === "idle" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {isDemo || hasImportedData ? (
            <button
              type="button"
              onClick={handleClearData}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 py-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]"
            >
              <Trash2 className="h-4 w-4" />
              Limpar dados
            </button>
          ) : null}

          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Ou use dados de exemplo
          </p>
          <button
            type="button"
            onClick={handleLoadDemo}
            className="w-full rounded-2xl border border-border bg-card py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.98]"
          >
            Adicionar dados ficticios
          </button>
        </motion.div>
      ) : null}
    </section>
  );
};
