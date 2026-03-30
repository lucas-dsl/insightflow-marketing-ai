import { Users, DollarSign, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MetricCard } from "@/components/MetricCard";
import { mockCampaignData, mockChannelData, allChannels } from "@/lib/mock-data";
import { useFilter } from "@/contexts/FilterContext";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-card text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-muted-foreground">
          <span style={{ color: p.color }}>●</span> {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export const DashboardPage = () => {
  const { selectedChannel, setSelectedChannel } = useFilter();
  const data = mockCampaignData;
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];

  const leadsChange = (((latest.leads - prev.leads) / prev.leads) * 100).toFixed(1);
  const convChange = (((latest.conversions - prev.conversions) / prev.conversions) * 100).toFixed(1);
  const revenueChange = (((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1);
  const roi = ((latest.revenue / latest.spend - 1) * 100).toFixed(0);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Performance das suas campanhas</p>
      </motion.div>

      {/* Channel Filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        <button
          onClick={() => setSelectedChannel(null)}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            selectedChannel === null
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:border-primary/40"
          }`}
        >
          Todos
        </button>
        {allChannels.map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(selectedChannel === ch ? null : ch)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              selectedChannel === ch
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {ch}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <MetricCard icon={Users} label="Leads" value={latest.leads.toLocaleString()} change={`+${leadsChange}%`} changeType="positive" />
        <MetricCard icon={Target} label="Conversões" value={latest.conversions.toString()} change={`+${convChange}%`} changeType="positive" />
        <MetricCard icon={DollarSign} label="Receita" value={`R$ ${(latest.revenue / 1000).toFixed(1)}k`} change={`+${revenueChange}%`} changeType="positive" />
        <MetricCard icon={TrendingUp} label="ROI" value={`${roi}%`} change="vs mês anterior" changeType="neutral" />
      </div>

      {selectedChannel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-2"
        >
          <span className="text-xs text-primary font-medium">Filtro ativo:</span>
          <span className="text-xs font-semibold text-foreground">{selectedChannel}</span>
          <span className="text-[10px] text-muted-foreground ml-auto">Tendências e Insights filtrados</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 rounded-2xl border border-border gradient-card shadow-card p-4"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">Leads vs Conversões</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
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
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="leads" name="Leads" stroke="hsl(187, 90%, 51%)" fill="url(#gradLeads)" strokeWidth={2} />
            <Area type="monotone" dataKey="conversions" name="Conversões" stroke="hsl(265, 80%, 65%)" fill="url(#gradConv)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 rounded-2xl border border-border gradient-card shadow-card p-4"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">Canais de Aquisição</h2>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={mockChannelData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} strokeWidth={0}>
                {mockChannelData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {mockChannelData.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: ch.color }} />
                  <span className="text-muted-foreground">{ch.name}</span>
                </div>
                <span className="font-mono font-medium text-foreground">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
