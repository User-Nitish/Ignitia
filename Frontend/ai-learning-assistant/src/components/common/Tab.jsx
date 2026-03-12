import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="w-full flex-1 flex flex-col min-h-0">
            <div className="relative border-b-2 border-slate-100">
                <nav className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`relative pb-4 px-2 md:px-6 text-sm font-semibold transition-all duration-300 ${activeTab === tab.name
                                ? "text-blue-600"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <span className="relative z-10">{tab.label}</span>
                            {activeTab === tab.name && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/25" />
                            )}
                            {activeTab === tab.name && (
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent rounded-t-xl -z-10" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1 mt-6 flex flex-col min-h-0">
                {tabs.map((tab) => {
                    if (tab.name === activeTab) {
                        return (
                            <div key={tab.name} className="flex-1 animate-in fade-in duration-300 flex flex-col min-h-0">
                                {tab.content}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default Tabs;