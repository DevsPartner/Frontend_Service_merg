"use client";

import React from 'react';
import { Cpu, TrendingUp, Activity, Database } from 'lucide-react';
import ForecastWidget from '@/components/Admin/ForecastWidget';
import ModelTraining from '@/components/Admin/ModelTraining';
import HealthStatus from '@/components/Admin/HealthStatus';

export default function AIEnginePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          AI Engine & MLOps
        </h1>
        <p className="text-slate-400">
          Manage predictive models, trigger training cycles, and monitor service health.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Forecasting (Azar-styled card) */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-xl font-semibold">Demand Forecasting</h2>
            </div>
            {/* The actual 0c76 functional component */}
            <ForecastWidget />
          </section>

          <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Database size={24} />
              </div>
              <h2 className="text-xl font-semibold">Model Training & Data</h2>
            </div>
            {/* The actual 0c76 functional component */}
            <ModelTraining />
          </section>
        </div>

        {/* Right Column: Infrastructure & Health */}
        <div className="space-y-6">
          <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                <Activity size={24} />
              </div>
              <h2 className="text-xl font-semibold">Service Health</h2>
            </div>
            <HealthStatus />
          </section>

          {/* Quick Links to External MLOps Tools */}
          <section className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-3xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 mb-4">External Monitoring</h3>
            <div className="space-y-3">
              <ExternalToolLink label="MLflow Tracking" url="http://localhost:15000" />
              <ExternalToolLink label="Grafana Dashboards" url="http://localhost:13000" />
              <ExternalToolLink label="Prometheus Metrics" url="http://localhost:19090" />
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

function ExternalToolLink({ label, url }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
    >
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
      <Cpu size={14} className="text-slate-500" />
    </a>
  );
}