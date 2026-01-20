"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Edit, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Menu {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export default function ManageMenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const router = useRouter();

  const fetchMenus = useCallback(async () => {
    try {
      const res = await fetch("https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/menu", {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setMenus(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus menu ini?")) {
      try {
        const res = await fetch(`https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/menu/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert("Menu berhasil dihapus");
          fetchMenus();
        }
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

 const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "/placeholder.png";
  
  const API_URL = "https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app";
  
  // Jika sudah full URL, return langsung
  if (imagePath.startsWith('http')) {
    // Hapus duplikat domain jika ada
    return imagePath.replace(/https?:\/\/[^\/]+/, API_URL);
  }
  
  // Bersihkan path
  const cleanPath = imagePath
    .replace(/^\/?public/, "")
    .replace(/^\//, "");
  
  return `${API_URL}/uploads/${cleanPath}`;
};

  
}