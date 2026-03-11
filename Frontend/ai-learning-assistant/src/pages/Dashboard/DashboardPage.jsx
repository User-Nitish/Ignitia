import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Data_getDashboardData", data);
        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center ">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl group relative bg-linear-to-r from-emerald-500 to-teal-500 hover:to-teal-600 active:scale-[0.98] text-white shadow-inner mb-6 transition-all">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="text-slate-600 text-sm">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-400 to-cyan-500",
      shadowColor: "shadow-blue-500/25"
    },
    {
      label: "Total Questions",
      value: dashboardData.overview.totalQuestions,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
      shadowColor: "shadow-purple-500/25",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-500",
      shadowColor: "shadow-orange-500/25",
    }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:16px_16px] opacity-50 -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-500 font-medium">
            Track your learning progress and activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Clock size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
          </div>

          {dashboardData.recentActivity &&
            (dashboardData.recentActivity.documents?.length > 0 ||
              dashboardData.recentActivity.quizzes?.length > 0) ? (
            <div className="space-y-4">
              {[
                ...(dashboardData.recentActivity.documents || []).map((doc) => ({
                  id: doc._id,
                  description: doc.title,
                  timestamp: doc.lastAccessed,
                  link: `/documents/${doc._id}`,
                  type: "document",
                })),
                ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                  id: quiz._id,
                  description: quiz.title,
                  timestamp: quiz.completedAt || quiz.createdAt,
                  link: `/quizzes/${quiz._id}`,
                  type: "quiz",
                })),
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${activity.type === "document"
                          ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                          : "bg-gradient-to-r from-emerald-400 to-teal-500"
                          }`}
                      ></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {activity.type === "document"
                            ? "Accessed Document: "
                            : "Attempted Quiz: "}
                          <span className="font-medium text-slate-600">
                            {activity.description}
                          </span>
                        </p>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {activity.link && (
                      <a
                        href={activity.link}
                        className="opacity-0 group-hover:opacity-100 px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all duration-200"
                      >
                        View Details
                      </a>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 mb-4">
                <Clock size={32} />
              </div>
              <p className="text-slate-600 font-bold">No recent activity yet.</p>
              <p className="text-slate-400 text-sm mt-1">
                Start learning to see your progress here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;