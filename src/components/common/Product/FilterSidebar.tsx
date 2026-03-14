"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  brands: { name: string; slug: string; id: string }[];
  currentBrands?: string[];
  currentSort?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default function FilterSidebar({ 
  brands, 
  currentBrands = [], 
  currentSort,
  minPrice,
  maxPrice 
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState({
    min: minPrice || "",
    max: maxPrice || ""
  });

  const handleBrandChange = (brandSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let brands = currentBrands;
    
    if (brands.includes(brandSlug)) {
      brands = brands.filter(b => b !== brandSlug);
    } else {
      brands = [...brands, brandSlug];
    }
    
    if (brands.length > 0) {
      params.set("brand", brands.join(","));
    } else {
      params.delete("brand");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange.min) params.set("minPrice", priceRange.min);
    else params.delete("minPrice");
    
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    else params.delete("maxPrice");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.filterGroup}>
        <h3 className={styles.title}>Sắp xếp</h3>
        <select 
          className={styles.selectBox} 
          value={currentSort || "newest"}
          onChange={handleSortChange}
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.title}>Khoảng giá</h3>
        <div className={styles.priceInputs}>
          <input 
            type="number" 
            placeholder="Min" 
            value={priceRange.min}
            onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
            className={styles.priceInput}
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={priceRange.max}
            onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
            className={styles.priceInput}
          />
        </div>
        <button onClick={handlePriceApply} className={styles.applyBtn}>Áp dụng</button>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.title}>Hãng sản xuất</h3>
        <ul className={styles.list}>
          {brands.map((brand) => (
            <li key={brand.id}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={currentBrands.includes(brand.slug)}
                  onChange={() => handleBrandChange(brand.slug)}
                />
                <span className={styles.checkboxText}>{brand.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
