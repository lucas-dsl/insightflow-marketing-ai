import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  FileSpreadsheet,
  Trash2,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/app/useAppState";
import { PageHeader } from "@/components/common/PageHeader";
import { exampleCsvFiles, type ExampleCsvFile } from "@/data/exampleCsvFiles";
import {
  buildCsvPreview,
  parseCsvFile,
  parseCsvText,
  type CsvParseSuccess,
} from "@/services/csvParser";
import type { CsvPreview } from "@/types/marketing";

type UploadState = "idle" | "parsing" | "success" | "error";

const PreviewTable = ({ preview }: { preview: CsvPreview }) => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <div className="border-b border-border px-4 py-3">
      <p className="text-sm font-medium text-foreground">Preview de {preview.fileName}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {preview.rows.length} linhas exibidas com as colunas validadas do CSV.
      </p>
    </div>
    <div className="scrollbar-hidden overflow-x-auto">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-secondary/60 text-muted-foreground">
          <tr>
            {preview.columns.map((column) => (
              <th key={column} className="px-3 py-2 font-medium uppercase tracking-wide">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.rows.map((row, index) => (
            <tr key={`${row.date}-${row.campaign}-${index}`} className="border-t border-border">
              <td className="px-3 py-2 text-foreground">{row.date}</td>
              <td className="px-3 py-2 text-foreground">{row.channel}</td>
              <td className="px-3 py-2 text-foreground">{row.campaign}</td>
              <td className="px-3 py-2 text-foreground">{row.spend}</td>
              <td className="px-3 py-2 text-foreground">{row.clicks}</td>
              <td className="px-3 py-2 text-foreground">{row.leads}</td>
              <td className="px-3 py-2 text-foreground">{row.conversions}</td>
              <td className="px-3 py-2 text-foreground">{row.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const UploadPage = () => {
  const navigate = useNavigate();
  const {
    clearImportedData,
    hasImportedData,
    importedFileName,
    importedRows,
    isDemo,
    setImportedData,
    setSelectedChannel,
  } = useAppState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [examplePreview, setExamplePreview] = useState<CsvPreview | null>(null);
  const [preview, setPreview] = useState<CsvPreview | null>(null);
  const [state, setState] = useState<UploadState>("idle");

  const activePreview = examplePreview ?? preview;
  const importedSummary = useMemo(
    () => ({
      columns: activePreview?.columns.length ?? 0,
      rows: importedRows.length,
    }),
    [activePreview, importedRows.length],
  );

  const applyParsedCsv = useCallback(
    (parsed: CsvParseSuccess, demo = false) => {
      setImportedData(parsed.rows, parsed.fileName, demo);
      setSelectedChannel(null);
      setPreview(buildCsvPreview(parsed));
      setExamplePreview(null);
      setErrorMessage(null);
      setState("success");
    },
    [setImportedData, setSelectedChannel],
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setErrorMessage("Envie um arquivo CSV valido com extensao .csv.");
        setState("error");
        return;
      }

      setState("parsing");
      setErrorMessage(null);

      const parsed = await parseCsvFile(file);

      if ("error" in parsed) {
        setErrorMessage(parsed.error);
        setState("error");
        return;
      }

      applyParsedCsv(parsed);
    },
    [applyParsedCsv],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

      if (file) {
        void handleFile(file);
      }
    },
    [handleFile],
  );

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        void handleFile(file);
      }
    },
    [handleFile],
  );

  const handleClearData = () => {
    clearImportedData();
    setSelectedChannel(null);
    setPreview(null);
    setExamplePreview(null);
    setErrorMessage(null);
    setState("idle");
  };

  const handlePreviewExample = async (example: ExampleCsvFile) => {
    setErrorMessage(null);
    const response = await fetch(example.url);
    const csvText = await response.text();
    const parsed = await parseCsvText(csvText, example.fileName);

    if ("error" in parsed) {
      setErrorMessage(parsed.error);
      setState("error");
      return;
    }

    setExamplePreview(buildCsvPreview(parsed));
  };

  const handleImportExample = async (example: ExampleCsvFile) => {
    setState("parsing");
    setErrorMessage(null);
    const response = await fetch(example.url);
    const csvText = await response.text();
    const parsed = await parseCsvText(csvText, example.fileName);

    if ("error" in parsed) {
      setErrorMessage(parsed.error);
      setState("error");
      return;
    }

    applyParsedCsv(parsed, true);
  };

  return (
    <section className="screen-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Importacao de CSV"
          description="Envie dados internos da empresa, valide o arquivo e visualize uma amostra antes de seguir."
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
              Toque para selecionar ou arraste um arquivo CSV
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Colunas obrigatorias: date, channel, campaign, spend, clicks, leads, conversions e revenue
            </p>
          </div>
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleInput} />
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
            <p className="text-sm text-muted-foreground">Validando e transformando o CSV...</p>
          </motion.div>
        ) : null}

        {state === "error" && errorMessage ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground">Nao foi possivel importar</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{errorMessage}</p>
            </div>
          </motion.div>
        ) : null}

        {state === "success" && hasImportedData ? (
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
                  {importedRows.length.toLocaleString()} linhas • {activePreview?.columns.length ?? 0} colunas
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                <p className="text-xs font-medium text-foreground">
                  {importedFileName ?? "Arquivo importado"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Os dados foram salvos no estado global e ja alimentam Dashboard e Insights automaticamente.
              </p>
            </div>

            {activePreview ? <PreviewTable preview={activePreview} /> : null}

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-2xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-primary transition-transform active:scale-[0.98]"
            >
              Ver dashboard
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="space-y-3">
        {hasImportedData ? (
          <button
            type="button"
            onClick={handleClearData}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 py-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]"
          >
            <Trash2 className="h-4 w-4" />
            Limpar dados importados
          </button>
        ) : null}

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Exemplos da empresa
          </p>
          {exampleCsvFiles.map((example) => (
            <article key={example.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{example.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{example.description}</p>
                </div>
                {isDemo && importedFileName === example.fileName ? (
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                    Em uso
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handlePreviewExample(example)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Visualizar
                </button>
                <button
                  type="button"
                  onClick={() => void handleImportExample(example)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Importar exemplo
                </button>
                <a
                  href={example.url}
                  download={example.fileName}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Download className="h-3.5 w-3.5" />
                  Baixar CSV
                </a>
              </div>
            </article>
          ))}
        </div>

        {activePreview && state !== "success" ? <PreviewTable preview={activePreview} /> : null}

        {state === "idle" && !hasImportedData ? (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground">Nenhum dado interno carregado</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Dashboard e Insights permanecem vazios ate a importacao de um CSV valido.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};
