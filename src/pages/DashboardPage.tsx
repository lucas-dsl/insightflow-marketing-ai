import { motion } from "framer-motion";
import { DollarSign, Target, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppState } from "@/app/useAppState";
import { FilterBanner } from "@/components/common/FilterBanner";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { getDashboardSource } from "@/data/appData";
import { allChannels } from "@/data/mockMarketingData";

interface TooltipEntry {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: TooltipEntry[];
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3 text-xs shadow-card">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-muted-foreground">
          <span style={{ color: entry.color }}>•</span> {entry.name}:{" "}
          {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export const DashboardPage = () => {
  const { hasImportedData, isDemo, selectedChannel, setSelectedChannel } =
    useAppState();
  const { campaignData, channelData } = getDashboardSource({
    hasImportedData,
    isDemo,
  });
  const latest = campaignData[campaignData.length - 1];
  const previous = campaignData[campaignData.length - 2];

  const leadsChange = (
    previous.leads === 0 ? 0 : ((latest.leads - previous.leads) / previous.leads) * 100
  ).toFixed(1);
  const conversionChange = (
    previous.conversions === 0
      ? 0
      : ((latest.conversions - previous.conversions) / previous.conversions) * 100
  ).toFixed(1);
  const revenueChange = (
    previous.revenue === 0
      ? 0
      : ((latest.revenue - previous.revenue) / previous.revenue) * 100
  ).toFixed(1);
  const roi = (latest.spend === 0 ? 0 : (latest.revenue / latest.spend - 1) * 100).toFixed(0);

  return (
    <section className="screen-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Dashboard de dados"
          description="Leitura rapida da performance consolidada das campanhas."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="scrollbar-hidden flex gap-2 overflow-x-auto pb-2"
      >
        <button
          type="button"
          onClick={() => setSelectedChannel(null)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            selectedChannel === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40"
          }`}
        >
          Todos
        </button>
        {allChannels.map((channel) => (
          <button
            key={channel}
            type="button"
            onClick={() =>
              setSelectedChannel(selectedChannel === channel ? null : channel)
            }
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedChannel === channel
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {channel}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={Users}
          label="Leads"
          value={latest.leads.toLocaleString()}
          change={`+${leadsChange}%`}
          changeTone="positive"
        />
        <MetricCard
          icon={Target}
          label="Conversoes"
          value={latest.conversions.toString()}
          change={`+${conversionChange}%`}
          changeTone="positive"
        />
        <MetricCard
          icon={DollarSign}
          label="Receita"
          value={`R$ ${(latest.revenue / 1000).toFixed(1)}k`}
          change={`+${revenueChange}%`}
          changeTone="positive"
        />
        <MetricCard
          icon={TrendingUp}
          label="ROI"
          value={`${roi}%`}
          change="vs mes anterior"
        />
      </div>

      {selectedChannel && (isDemo || hasImportedData) ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <FilterBanner
            count={2}
            label="areas conectadas"
            value={selectedChannel}
          />
        </motion.div>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="surface-card p-4"
      >
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Leads vs Conversoes
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={campaignData}>
            <defs>
              <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(187, 90%, 51%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(187, 90%, 51%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradConv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(265, 80%, 65%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(265, 80%, 65%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="hsl(187, 90%, 51%)"
              fill="url(#gradLeads)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="conversions"
              name="Conversoes"
              stroke="hsl(265, 80%, 65%)"
              fill="url(#gradConv)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="surface-card p-4"
      >
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Canais de aquisicao
        </h2>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={channelData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                strokeWidth={0}
              >
                {channelData.map((channel) => (
                  <Cell key={channel.name} fill={channel.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 space-y-2">
            {channelData.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: channel.color }}
                  />
                  <span className="text-muted-foreground">{channel.name}</span>
                </div>
                <span className="font-mono font-medium text-foreground">
                  {channel.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </section>
  );
};
