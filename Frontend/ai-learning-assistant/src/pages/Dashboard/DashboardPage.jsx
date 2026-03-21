import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

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
      <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6dadbe]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black border border-[#6dadbe]/30 text-[#6dadbe] mb-8 shadow-[0_0_20px_rgba(109,173,190,0.2)]">
            <TrendingUp className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <p className="text-[#6dadbe]/60 font-mono tracking-widest text-xs uppercase italic">&gt; No data streams detected in current sector.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
    },
    {
      label: "Total Questions",
      value: dashboardData.overview.totalQuestions,
      icon: BookOpen,
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
    }
  ];

  return (
    <div className="min-h-screen relative pb-12 overflow-hidden">
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={itemVariants} className="relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-8 bg-[#6dadbe]/50" />
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#6dadbe] uppercase font-bold">Dashboard // Home</span>
          </div>
          <h1 className="text-5xl font-light text-slate-100 tracking-tight mb-4 lowercase">
            System /<span className="font-bold text-white uppercase italic">Overview</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
            Real-time analytics and personal study metrics.
          </p>
          <div className="absolute -top-10 -left-20 w-64 h-64 bg-[#6dadbe]/5 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 hover:border-[#6dadbe]/30 transition-all duration-500 group cursor-default overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6dadbe]/5 rounded-full blur-2xl group-hover:bg-[#6dadbe]/10 transition-colors duration-500 translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-black border border-white/10 text-[#6dadbe] flex items-center justify-center transition-all duration-500 group-hover:border-[#6dadbe]/50 group-hover:shadow-[0_0_15px_rgba(109,173,190,0.2)]`}>
                  <stat.icon size={22} strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                   <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-widest font-bold">Online</span>
                </div>
              </div>
               <div className="relative z-10">
                  <p className="text-4xl font-bold text-white tracking-tighter mb-2 font-mono">
                    {String(stat.value).padStart(2, '0')}.<span className="text-[#6dadbe]/20">00</span>
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <motion.div 
            variants={itemVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }}
            className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6dadbe]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Clock size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-light text-slate-100 tracking-tight lowercase">Recent <span className="font-bold uppercase italic text-white">Activity</span></h3>
                <p className="text-[10px] font-mono text-[#f59e0b]/50 uppercase tracking-[0.2em] font-bold mt-1">Status: Monitoring Session Logs</p>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
               <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-4 h-1 bg-[#6dadbe]/20 rounded-full" />
                  ))}
               </div>
               <span className="text-[9px] font-mono text-[#6dadbe]/30 uppercase">Protocol 08-A</span>
            </div>
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
                  <motion.div
                    key={activity.id || index}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-[#6dadbe]/5 hover:border-[#6dadbe]/30 transition-all duration-500 group gap-4 relative overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 w-[2px] bg-[#6dadbe]/20 group-hover:bg-[#6dadbe]/60 transition-colors" />
                    
                    <div className="flex items-center gap-5 relative z-10">
                      <div
                        className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-500 ${activity.type === "document"
                          ? "bg-black border-white/10 text-[#6dadbe] group-hover:border-[#6dadbe]/40"
                          : "bg-black border-white/10 text-[#6dadbe] group-hover:border-[#6dadbe]/40"
                          }`}
                      >
                         {activity.type === "document" ? <FileText size={20} strokeWidth={1.5} /> : <BookOpen size={20} strokeWidth={1.5} />}
                      </div>
                      <div>
                        <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">
                          {activity.type === "document" ? "DOC // VIEWED" : "QUIZ // ATTEMPT"}
                        </p>
                        <h4 className="text-lg font-bold text-slate-200 tracking-tight group-hover:text-white transition-colors">
                          {activity.description}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-1 h-1 rounded-full bg-[#6dadbe]/40" />
                           <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                            TIMESTAMP: {new Date(activity.timestamp).toLocaleString(undefined, {
                                year: '2-digit', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit', hour12: false
                            }).replace(',', ' //')}
                           </p>
                        </div>
                      </div>
                    </div>

                    {activity.link && (
                      <a
                        href={activity.link}
                        className="inline-flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white bg-black hover:bg-[#f59e0b]/10 px-5 py-3 rounded-xl border border-[#f59e0b] hover:border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all z-10 active:scale-95"
                      >
                        Open
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-[#f59e0b]" />
                      </a>
                    )}
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 text-slate-500 border border-white/10 mb-4">
                <Clock size={32} />
              </div>
              <p className="text-slate-300 font-bold">No recent activity yet.</p>
              <p className="text-slate-500 text-sm mt-1">
                Start learning to see your progress here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default DashboardPage;
