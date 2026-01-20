"use client";

import { useState, useEffect } from "react";

import { useCart } from "@/context/CartContext";

import {
  FileText,
  ArrowRight,
  TrendingUp,
  Package,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export default function AdminReportsPage() {
  const { orders } = useCart();

  const [filterType, setFilterType] = useState<"daily" | "weekly" | "monthly">(
    "daily",
  );

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Logika Filter Tab (Harian, Mingguan, Bulanan)

  useEffect(() => {
    const today = new Date();

    let start = new Date();

    if (filterType === "daily") {
      start = today;
    } else if (filterType === "weekly") {
      start.setDate(today.getDate() - 7);
    } else if (filterType === "monthly") {
      start.setMonth(today.getMonth() - 1);
    }

    setStartDate(start.toISOString().split("T")[0]);

    setEndDate(today.toISOString().split("T")[0]);
  }, [filterType]);

  // Fungsi Filter Data berdasarkan tanggal yang dipilih

  const getFilteredOrders = () => {
    return orders.filter((order) => {
      if (order.status !== "completed") return false;

      const orderDate = order.createdAt.split("T")[0];

      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const generateBasePDF = (title: string) => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("TERSENYUM COFFEE", 14, 22);

    doc.setFontSize(10);

    doc.setTextColor(100);

    doc.text("Laporan Operasional Digital", 14, 28);

    doc.text(`Periode: ${startDate} s/d ${endDate}`, 14, 33);

    doc.setDrawColor(230, 230, 230);

    doc.line(14, 38, 196, 38);

    doc.setFontSize(14);

    doc.setTextColor(0);

    doc.text(title.toUpperCase(), 14, 48);

    return doc;
  };

  // 1. Perbaikan Laporan Transaksi (Error substring fixed)

  const exportGeneralReport = () => {
    const doc = generateBasePDF("Laporan Riwayat Transaksi");

    const filtered = getFilteredOrders();

    const data = filtered.map((o) => [
      String(o.id), // Pastikan menjadi string sebelum diproses

      new Date(o.createdAt).toLocaleDateString("id-ID"),

      (o.customerName || "Pelanggan").toUpperCase(),

      (o as any).paymentMethod || "TUNAI",

      `Rp ${Number(o.total).toLocaleString("id-ID")}`,
    ]);

    autoTable(doc, {
      startY: 55,

      head: [["ID", "TANGGAL", "PELANGGAN", "METODE", "TOTAL"]],

      body: data,

      theme: "grid",

      headStyles: { fillColor: [30, 41, 59], fontSize: 9 },

      styles: { fontSize: 8, cellPadding: 4 },
    });

    doc.save(`Laporan_Transaksi_${startDate}.pdf`);
  };

  // 2. Laporan Produk

  const exportProductReport = () => {
    const doc = generateBasePDF("Analisis Performa Produk");

    const productMap: Record<string, any> = {};

    getFilteredOrders().forEach((order) => {
      order.items.forEach((item: any) => {
        if (!productMap[item.name]) {
          productMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
        }

        productMap[item.name].qty += item.qty;

        productMap[item.name].revenue += item.price * item.qty;
      });
    });

    const data = Object.values(productMap).map((p: any) => [
      p.name.toUpperCase(),

      `${p.qty} Unit`,

      `Rp ${p.revenue.toLocaleString("id-ID")}`,
    ]);

    autoTable(doc, {
      startY: 55,

      head: [["NAMA PRODUK", "VOLUME TERJUAL", "TOTAL PENDAPATAN"]],

      body: data,

      theme: "striped",

      headStyles: { fillColor: [217, 119, 6], fontSize: 9 },
    });

    doc.save(`Laporan_Produk_${startDate}.pdf`);
  };

  // 3. Perbaikan Laporan Profit (Error width fixed)

  const exportProfitReport = () => {
    const doc = generateBasePDF("Ringkasan Profitabilitas");

    const filtered = getFilteredOrders();

    const totalRev = filtered.reduce((a, b) => a + Number(b.total), 0);

    const avgTrans = filtered.length > 0 ? totalRev / filtered.length : 0;

    const data = [
      ["Total Volume Transaksi", `${filtered.length} Pesanan`],

      ["Total Omzet Kotor", `Rp ${totalRev.toLocaleString("id-ID")}`],

      [
        "Rata-rata Keranjang",
        `Rp ${Math.round(avgTrans).toLocaleString("id-ID")}`,
      ],

      ["Status Laporan", "Valid / Terverifikasi Sistem"],
    ];

    autoTable(doc, {
      startY: 55,

      body: data,

      styles: { fontSize: 10, cellPadding: 6 },

      columnStyles: { 0: { fontStyle: "bold", cellWidth: 80 } }, // Menggunakan cellWidth bukan width
    });

    doc.save(`Laporan_Profit_${startDate}.pdf`);
  };

  // 4. Laporan Retensi Pelanggan (Fungsi Khusus)

  const exportCustomerReport = () => {
    const doc = generateBasePDF("Laporan Retensi Pelanggan");

    const customerMap: Record<string, any> = {};

    getFilteredOrders().forEach((o) => {
      const name = (o.customerName || "Umum").toUpperCase();

      if (!customerMap[name]) {
        customerMap[name] = { name, visits: 0, spend: 0 };
      }

      customerMap[name].visits += 1;

      customerMap[name].spend += Number(o.total);
    });

    const data = Object.values(customerMap).map((c: any) => [
      c.name,

      `${c.visits} Kali`,

      `Rp ${c.spend.toLocaleString("id-ID")}`,
    ]);

    autoTable(doc, {
      startY: 55,

      head: [["NAMA PELANGGAN", "FREKUENSI KUNJUNGAN", "TOTAL BELANJA"]],

      body: data,

      theme: "grid",

      headStyles: { fillColor: [5, 150, 105], fontSize: 9 },
    });

    doc.save(`Laporan_Retensi_${startDate}.pdf`);
  };

  return (
    <div className="p-10 bg-[#fafafa] min-h-screen font-sans antialiased text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">
            Pusat Laporan
          </h1>

          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">
            Manajemen Laporan
          </p>
        </div>

        {/* Filter Card */}

        <div className="bg-white p-5 rounded-md border border-slate-200 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex bg-slate-100 p-1 rounded-md w-fit">
              <button
                onClick={() => setFilterType("daily")}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${filterType === "daily" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Harian
              </button>

              <button
                onClick={() => setFilterType("weekly")}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${filterType === "weekly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Mingguan
              </button>

              <button
                onClick={() => setFilterType("monthly")}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${filterType === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Bulanan
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                <Clock size={14} className="text-slate-400" />

                <input
                  type="date"
                  className="bg-transparent text-xs font-bold outline-none text-slate-700"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid Menu */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReportMenuCard
            title="Laporan Transaksi"
            description="Riwayat pesanan sukses sesuai filter tanggal yang dipilih."
            icon={<TrendingUp size={20} />}
            onExport={exportGeneralReport}
            color="amber"
          />

          <ReportMenuCard
            title="Laporan Produk"
            description="Statistik produk terjual dan performa item menu."
            icon={<Package size={20} />}
            onExport={exportProductReport}
            color="blue"
          />

          <ReportMenuCard
            title="Laporan Profitabilitas & Omzet"
            description="Laporan finansial mengenai pendapatan kotor dan rata-rata pesanan."
            icon={<BarChart3 size={20} />}
            onExport={exportProfitReport}
            color="purple"
          />

          <ReportMenuCard
            title="Laporan Retensi Pelanggan"
            description="Data statistik kunjungan dan loyalitas pelanggan."
            icon={<Users size={20} />}
            onExport={exportCustomerReport}
            color="emerald"
          />
        </div>
      </div>
    </div>
  );
}

function ReportMenuCard({ title, description, icon, onExport, color }: any) {
  const colorMap: any = {
    amber: "text-amber-600 bg-amber-50 border-amber-100",

    blue: "text-blue-600 bg-blue-50 border-blue-100",

    purple: "text-purple-600 bg-purple-50 border-purple-100",

    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <div className="bg-white p-6 rounded-md border border-slate-200 hover:border-slate-400 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-md border ${colorMap[color]}`}>{icon}</div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1.5 rounded-md hover:bg-slate-900 hover:text-white transition-all shadow-sm"
        >
          <FileText size={14} />
          Export PDF
        </button>
      </div>

      <h3 className="text-sm font-black text-slate-900 uppercase mb-2 group-hover:text-amber-600 transition-colors">
        {title}
      </h3>

      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        {description}
      </p>

      <div className="pt-4 border-t border-slate-50 flex justify-end">
        <ArrowRight
          size={16}
          className="text-slate-300 group-hover:text-amber-500 transition-all group-hover:translate-x-1"
        />
      </div>
    </div>
  );
}
