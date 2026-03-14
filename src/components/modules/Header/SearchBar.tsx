"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, X } from "lucide-react";
import { Box, Typography, Button } from "@mui/material";

interface SuggestionProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: {
    slug: string;
  };
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Failed to fetch search suggestions", error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative flex items-center group">
        <input
          type="text"
          placeholder="Bạn cần tìm linh kiện gì?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          required
          className="w-full h-[46px] pl-5 pr-20 bg-slate-900/50 border border-slate-700/50 hover:border-pink-500/30 focus:border-pink-500 focus:bg-slate-900 rounded-full text-slate-200 placeholder-slate-500 outline-none transition-all shadow-inner font-medium text-[15px]"
        />
        <div className="absolute right-12 flex items-center px-1">
          {query && (
            <button type="button" onClick={clearSearch} className="text-slate-400 hover:text-pink-400 transition-colors p-1" aria-label="Xóa">
              <X size={18} />
            </button>
          )}
          {isLoading && <Loader2 size={18} className="text-pink-500 animate-spin ml-1" />}
        </div>
        <button type="submit" className="absolute right-1 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full text-white shadow-md hover:shadow-lg hover:-translate-y-px transition-all" aria-label="Tìm kiếm">
          <Search size={18} />
        </button>
      </form>

      {showDropdown && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400 font-medium">Đang tìm kiếm...</div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-slate-700/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sản phẩm gợi ý
              </div>
              <ul className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.category.slug}/${product.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-slate-700/30 transition-colors border-b border-slate-700/30 last:border-0"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="w-16 h-16 rounded-xl bg-white/5 relative overflow-hidden flex-shrink-0 border border-slate-600/50 text-slate-500 flex items-center justify-center">
                        {product.images?.[0] ? (
                           <Image
                             src={product.images[0]}
                             alt={product.name}
                             fill
                             style={{ objectFit: "contain" }}
                           />
                        ) : (
                           <Search size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-200 font-semibold truncate hover:text-pink-400 transition-colors mb-1">
                          {product.name}
                        </div>
                        <div className="text-pink-400 font-bold text-sm">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.salePrice ?? product.price)}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="block w-full p-4 text-center text-sm font-bold text-indigo-400 hover:bg-slate-700/30 hover:text-indigo-300 transition-colors bg-slate-800/50"
                onClick={() => setShowDropdown(false)}
              >
                Xem tất cả kết quả cho &quot;{query}&quot; →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
