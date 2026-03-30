export interface ExampleCsvFile {
  description: string;
  fileName: string;
  id: string;
  title: string;
  url: string;
}

export const exampleCsvFiles: ExampleCsvFile[] = [
  {
    description: "Mix multicanal com campanhas de performance e CRM.",
    fileName: "empresa-campanhas-multicanal.csv",
    id: "multicanal",
    title: "Exemplo empresa multicanal",
    url: "/examples/empresa-campanhas-multicanal.csv",
  },
  {
    description: "Operacao B2B com foco em geracao de leads e pipeline.",
    fileName: "empresa-campanhas-b2b.csv",
    id: "b2b",
    title: "Exemplo empresa B2B",
    url: "/examples/empresa-campanhas-b2b.csv",
  },
];
