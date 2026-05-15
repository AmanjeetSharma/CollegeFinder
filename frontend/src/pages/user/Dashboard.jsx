import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Trophy,
  Calendar,
  Target,
  BookOpen,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  User,
  Minus,
  BarChart3
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTest } from "../../context/TestContext";
import PageLoader from "@/utils/PageLoader";

const buildEfficiencyInsights = ({ peakEfficiency, dropFromPeak, consistencyGap, status }) => {
  const insights = [];

  if (dropFromPeak >= 20) {
    insights.push("Performance dropped significantly from peak.");
  } else if (dropFromPeak > 0) {
    insights.push("Current efficiency is below peak but still recoverable.");
  } else if (peakEfficiency > 0) {
    insights.push("Current efficiency matches the all-time peak.");
  }

  if (status === "stable") {
    insights.push("Efficiency is stable.");
  } else if (status === "improving") {
    insights.push("Latest attempt improved over the previous score.");
  } else if (status === "declining") {
    insights.push("Latest attempt declined from the previous score.");
  }

  if (consistencyGap <= 10 && peakEfficiency > 0) {
    insights.push("Strong consistency among top scores.");
  } else if (consistencyGap >= 25) {
    insights.push("Top score is far ahead of the next best result.");
  }

  return insights.length ? insights : ["Complete more tests to unlock efficiency insights."];
};

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserAllTests } = useTest();
  const navigate = useNavigate();

  const [recentTests, setRecentTests] = useState([]);
  const [hasRunningTest, setHasRunningTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    currentEfficiency: 0,
    peakEfficiency: 0,
    dropFromPeak: 0,
    consistencyGap: 0,
    performanceStatus: "stable",
    efficiencyTrend: [],
    insights: ["Complete more tests to unlock efficiency insights."]
  });

  useEffect(() => {
    if (user?._id) fetchTestHistory();
  }, [user]);

  const fetchTestHistory = async () => {
    try {
      const tests = await getUserAllTests();
      const completed = tests.filter((t) => t.status === "submitted");
      const inProgress = tests.filter((t) => t.status === "in-progress");
      const completedChronological = [...completed].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const efficiencyValues = completedChronological.map(t => Number(t.scores?.aggregate) || 0);

      setHasRunningTest(inProgress.length > 0);

      const currentEfficiency = efficiencyValues.at(-1) || 0;
      const peakEfficiency = efficiencyValues.length > 0 ? Math.max(...efficiencyValues) : 0;
      const dropFromPeak = Math.max(0, peakEfficiency - currentEfficiency);
      const uniqueScores = [...new Set(efficiencyValues)].sort((a, b) => b - a);
      const consistencyGap = uniqueScores.length >= 2 ? uniqueScores[0] - uniqueScores[1] : 0;
      const previousEfficiency = efficiencyValues.length >= 2 ? efficiencyValues[efficiencyValues.length - 2] : currentEfficiency;
      const performanceStatus =
        currentEfficiency > previousEfficiency
          ? "improving"
          : currentEfficiency < previousEfficiency
            ? "declining"
            : "stable";

      const efficiencyTrend = completedChronological.map((test, index) => ({
        name: `T${index + 1}`,
        value: Number(test.scores?.aggregate) || 0,
        date: test.createdAt ? new Date(test.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : `Test ${index + 1}`
      }));

      const avgScore = completed.length > 0
        ? completed.reduce((sum, t) => sum + (t.scores?.aggregate || 0), 0) / completed.length
        : 0;

      const insights = buildEfficiencyInsights({
        currentEfficiency,
        peakEfficiency,
        dropFromPeak,
        consistencyGap,
        status: performanceStatus
      });

      setStats({
        totalTests: tests.length,
        completedTests: completed.length,
        averageScore: Math.round(avgScore),
        currentEfficiency,
        peakEfficiency,
        dropFromPeak,
        consistencyGap,
        performanceStatus,
        efficiencyTrend,
        insights
      });
      setRecentTests(completed.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scoreConfig = (score) => {
    if (score >= 80) return { label: "Elite", bg: "bg-emerald-50", text: "text-emerald-600" };
    if (score >= 60) return { label: "Advanced", bg: "bg-blue-50", text: "text-blue-600" };
    return { label: "Standard", bg: "bg-slate-50", text: "text-slate-600" };
  };

  const performanceConfig = {
    improving: {
      label: "Improving",
      icon: TrendingUp,
      chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
      iconClass: "text-emerald-500",
      line: "#10b981"
    },
    stable: {
      label: "Stable",
      icon: Minus,
      chip: "bg-amber-50 text-amber-700 border-amber-100",
      iconClass: "text-amber-500",
      line: "#f59e0b"
    },
    declining: {
      label: "Declining",
      icon: TrendingDown,
      chip: "bg-rose-50 text-rose-700 border-rose-100",
      iconClass: "text-rose-500",
      line: "#ef4444"
    }
  };
  const status = performanceConfig[stats.performanceStatus] || performanceConfig.stable;
  const StatusIcon = status.icon;

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-4 ring-white shadow-xl">
              <AvatarFallback className="bg-zinc-900 text-white font-bold uppercase">
                {user?.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
                {user?.name?.split(" ")[0]} <span className="text-zinc-400 font-light italic">/ DASHBOARD</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-zinc-500 border-zinc-200 font-medium">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="rounded-full px-6 border-zinc-200 hover:bg-zinc-100 hover:border-black/30 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <User className="w-3 h-3 mr-2" /> Profile
            </Button>
            <Button
              onClick={() => navigate(hasRunningTest ? "/take-test" : "/preferences")}
              className="rounded-full bg-black text-white px-8 shadow-xl shadow-zinc-200 hover:bg-zinc-700 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {hasRunningTest ? "Continue Test" : "Take New Test"}
            </Button>
          </div>
        </div>

        {/* --- Top Stats --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Activity className={hasRunningTest ? "text-emerald-600" : "text-zinc-600"} />}
            label="Status"
            value={hasRunningTest ? "Active Session" : "Ready"}
            badge={hasRunningTest ? "Running" : "Available"}
            color={hasRunningTest ? "bg-emerald-50" : "bg-zinc-50"}
          />
          <StatCard icon={<Target className="text-violet-600" />} label="Accuracy" value={`${stats.averageScore}%`} color="bg-violet-50" />
          <StatCard icon={<Trophy className="text-amber-600" />} label="Completed" value={stats.completedTests} color="bg-amber-50" />
          <StatCard icon={<BookOpen className="text-blue-600" />} label="Attempts" value={stats.totalTests} color="bg-blue-50" />
        </div>

        {/* --- Aggregate Efficiency Analytics --- */}
        <Card className="border-none shadow-xl shadow-zinc-200/60 bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 sm:p-8 border-b border-zinc-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardDescription className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Aggregate Efficiency
                </CardDescription>
                <CardTitle className="text-2xl font-black tracking-tight text-zinc-900 mt-1">
                  Performance Analytics
                </CardTitle>
              </div>
              <Badge variant="outline" className={`w-fit rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${status.chip}`}>
                <StatusIcon className={`h-3.5 w-3.5 mr-1.5 ${status.iconClass}`} />
                {status.label}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <EfficiencyKpiCard
                label="Current Efficiency"
                value={`${stats.currentEfficiency}%`}
                icon={<Activity className="h-4 w-4 text-zinc-100" />}
                tone="bg-zinc-900 text-white"
                caption="Latest aggregate"
              />
              <EfficiencyKpiCard
                label="Peak Efficiency"
                value={`${stats.peakEfficiency}%`}
                icon={<Trophy className="h-4 w-4 text-amber-500" />}
                caption="Highest aggregate"
              />
              <EfficiencyKpiCard
                label="Drop from Peak"
                value={`${stats.dropFromPeak}%`}
                icon={<TrendingDown className="h-4 w-4 text-rose-500" />}
                caption="Peak minus current"
              />
              <EfficiencyKpiCard
                label="Consistency Gap"
                value={`${stats.consistencyGap}%`}
                icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
                caption="Best minus next unique"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 rounded-3xl border border-zinc-100 bg-zinc-950 p-5 sm:p-6 shadow-inner">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Trend Visualization</p>
                    <h3 className="text-lg font-black text-white tracking-tight">Efficiency Over Time</h3>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">
                    {stats.efficiencyTrend.length} point{stats.efficiencyTrend.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="h-72">
                  {stats.efficiencyTrend.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm font-semibold text-zinc-500">
                      No submitted test data yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.efficiencyTrend} margin={{ top: 8, right: 8, left: -24, bottom: 8 }}>
                        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#a1a1aa", fontSize: 11, fontWeight: 700 }}
                        />
                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#a1a1aa", fontSize: 11, fontWeight: 700 }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #e4e4e7",
                            borderRadius: 14,
                            boxShadow: "0 20px 45px rgba(0,0,0,0.12)"
                          }}
                          labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
                          formatter={(value) => [`${value}%`, "Efficiency"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={status.line}
                          strokeWidth={4}
                          dot={{ r: 4, fill: status.line, strokeWidth: 2, stroke: "#18181b" }}
                          activeDot={{ r: 6, fill: status.line, stroke: "#ffffff", strokeWidth: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 rounded-3xl border border-zinc-100 bg-zinc-50 p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <StatusIcon className={`h-4 w-4 ${status.iconClass}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Insights</p>
                    <h3 className="text-base font-black text-zinc-900">Auto Summary</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {stats.insights.map((insight, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-white border border-zinc-100 p-4 text-sm font-semibold text-zinc-600 shadow-sm animate-in fade-in slide-in-from-bottom-2"
                    >
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Main Section --- */}
        <div className="grid grid-cols-1 gap-8 items-start">

          <div>
            <Card className="border-none shadow-xl shadow-zinc-200/50 bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-zinc-50 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold tracking-tight uppercase">Recent Attempts</CardTitle>
                  <CardDescription className="text-xs font-medium">Review your latest performance metrics</CardDescription>
                </div>

                {/* VIEW ALL BUTTON */}
                {recentTests.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/all-tests")}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all gap-2 px-4 rounded-full cursor-pointer"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </CardHeader>

              <CardContent className="p-0">
                {recentTests.length === 0 ? (
                  <div className="p-20 text-center text-zinc-400 font-medium">No activity recorded yet.</div>
                ) : (
                  <div className="divide-y divide-zinc-200">
                    {recentTests.map((test, idx) => {
                      const score = test.scores?.aggregate || 0;
                      const cfg = scoreConfig(score);
                      return (
                        <div
                          key={idx}
                          onClick={() => navigate(`/test-result/${test.testId}`)}
                          className="p-6 hover:bg-zinc-50/80 transition-all cursor-pointer group flex items-center justify-between"
                        >
                          <div className="flex items-center gap-6">
                            <div className={`h-10 w-10 rounded-xl ${cfg.bg} flex items-center justify-center font-black text-xs ${cfg.text}`}>
                              {score}%
                            </div>
                            <div>
                              <p className="text-xs font-black text-zinc-900 uppercase tracking-tighter">
                                {test.interest?.[0] || 'General Assessment'}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">
                                {new Date(test.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-zinc-900 group-hover:text-zinc-500 transition-colors" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, badge, color }) => (
  <Card className="border-none shadow-md bg-white rounded-2xl p-6">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
      {badge && <Badge variant="secondary" className="text-[9px] uppercase tracking-widest px-2">{badge}</Badge>}
    </div>
    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
    <h3 className="text-xl font-black text-zinc-900 tracking-tighter">{value}</h3>
  </Card>
);

const EfficiencyKpiCard = ({ label, value, icon, caption, tone = "bg-white text-zinc-900" }) => (
  <div className={`rounded-3xl border border-zinc-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${tone}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${tone.includes("zinc-900") ? "text-zinc-400" : "text-zinc-400"}`}>
          {label}
        </p>
        <h3 className="text-3xl font-black italic tracking-tight mt-2">{value}</h3>
      </div>
      <div className={`h-9 w-9 rounded-2xl flex items-center justify-center ${tone.includes("zinc-900") ? "bg-white/10" : "bg-zinc-50"}`}>
        {icon}
      </div>
    </div>
    <p className={`text-xs font-semibold mt-4 ${tone.includes("zinc-900") ? "text-zinc-400" : "text-zinc-500"}`}>
      {caption}
    </p>
  </div>
);

export default Dashboard;
