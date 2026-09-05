import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Unevaluated = () => {
  const [notifies] = useState([
    { id: 1, name: 'ዳዊት ሀይለማርያም', tin: 'TIN-101', startDate: '2025-01-01', endDate: '2025-01-31' },
    { id: 2, name: 'ሰላም አበበ', tin: 'TIN-102', startDate: '2025-02-01', endDate: '2025-02-28' },
    { id: 3, name: 'ሄለን ገብረእግዚአብሔር', tin: 'TIN-103', startDate: '2025-03-01', endDate: '2025-03-31' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = notifies.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 w-full text-slate-800 dark:text-slate-100">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1a1a2e',
            padding: '16px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            fontSize: '14px',
          },
        }}
      />
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
        {/* Frame Header */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex justify-end">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-3.5 py-2 w-full sm:w-72 focus-within:ring-2 focus-within:ring-navy-800/20 dark:focus-within:ring-gold-400/20 transition-all">
            <FaSearch className="text-slate-400 dark:text-slate-300 shrink-0 text-sm" />
            <input
              type="text"
              className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 w-full"
              placeholder="ፈልግ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredData.map((item, idx) => (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1" key={item.id}>
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                    {(item.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-base text-navy-800 dark:text-gold-400 line-clamp-1">{item.name}</div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">{item.tin}</div>
                  </div>
                </div>
                <span className="bg-navy-50 dark:bg-slate-700 text-navy-800 dark:text-gold-400 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-navy-100 dark:border-slate-600 shrink-0">#{idx + 1}</span>
              </div>
              <div className="p-4 space-y-2 text-sm flex-1">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">🆔 TIN</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.tin}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">📅 መነሻ ቀን</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.startDate}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-0.5">📅 መጨረሻ ቀን</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.endDate}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <div className="text-5xl mb-3">📭</div>
              <div className="text-base font-semibold">DATA NOT AVAILABLE</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unevaluated;