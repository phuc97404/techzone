"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductForm.module.css";
import { Save, X, Image as ImageIcon } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  categories: Option[];
  brands: Option[];
}

export default function ProductForm({ initialData, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    salePrice: initialData?.salePrice || "",
    stock: initialData?.stock || "",
    status: initialData?.status || "ACTIVE",
    categoryId: initialData?.categoryId || "",
    brandId: initialData?.brandId || "",
    featured: initialData?.featured || false
  });

  const [specs, setSpecs] = useState<{key: string, value: string}[]>(() => {
    if (!initialData || !initialData.specs) return [{ key: "", value: "" }];
    
    let parsedSpecs = initialData.specs;
    if (typeof parsedSpecs === 'string') {
      try {
        parsedSpecs = JSON.parse(parsedSpecs);
      } catch {
        return [{ key: "", value: "" }];
      }
    }
    
    if (typeof parsedSpecs === 'object' && !Array.isArray(parsedSpecs) && parsedSpecs !== null) {
      const entries = Object.entries(parsedSpecs);
      if (entries.length > 0) {
        return entries.map(([k, v]) => ({ key: k, value: String(v) }));
      }
    }
    
    return [{ key: "", value: "" }];
  });

  const [options, setOptions] = useState<{name: string, values: string}[]>(() => {
    if (!initialData || !initialData.options) return [{ name: "", values: "" }];
    
    let parsedOptions = initialData.options;
    if (typeof parsedOptions === 'string') {
      try {
        parsedOptions = JSON.parse(parsedOptions);
      } catch {
        return [{ name: "", values: "" }];
      }
    }
    
    if (Array.isArray(parsedOptions) && parsedOptions.length > 0) {
      return parsedOptions.map(opt => ({
        name: opt.name || "",
        values: Array.isArray(opt.values) 
          ? opt.values.map((v: { val: string, priceOffset?: number } | string) => 
               typeof v === 'object' && v !== null ? `${v.val}${v.priceOffset ? ':'+v.priceOffset : ''}` : v
            ).join(", ") 
          : (opt.values || "")
      }));
    }
    
    return [{ name: "", values: "" }];
  });

  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === "name" && !initialData) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpecField = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpecField = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  const handleOptionChange = (index: number, field: "name" | "values", value: string) => {
    const newOpts = [...options];
    newOpts[index][field] = value;
    setOptions(newOpts);
  };

  const addOptionField = () => setOptions([...options, { name: "", values: "" }]);
  const removeOptionField = (index: number) => {
    const newOpts = [...options];
    newOpts.splice(index, 1);
    setOptions(newOpts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Transform specs back to object
    const finalSpecs = specs.reduce((acc, curr) => {
      if (curr.key && curr.value) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    // Transform options string values back to arrays with price offset support
    const finalOptions = options
      .filter(opt => opt.name.trim() !== "")
      .map(opt => ({
        name: opt.name.trim(),
        values: opt.values.split(",").map(v => {
          let valStr = v.trim();
          let priceOffset = 0;
          if (valStr.includes(":")) {
            const parts = valStr.split(":");
            valStr = parts[0].trim();
            priceOffset = parseInt(parts[1].trim().replace(/\D/g, '')) || 0;
          }
          return { val: valStr, priceOffset };
        }).filter(v => v.val !== "")
      }));

    // Lưu ý: Ở môi trường thật, đoạn này sẽ gọi API để upload file mới (newImages) lên S3/Cloudinary
    // Tạm thời tạo mock URLs cho ảnh mới để demo gửi đi
    const fakeUploadedUrls = newImages.map(f => URL.createObjectURL(f));
    const finalImages = [...existingImages, ...fakeUploadedUrls];

    try {
      const endpoint = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          salePrice: formData.salePrice ? Number(formData.salePrice) : null,
          stock: Number(formData.stock),
          specs: finalSpecs,
          options: finalOptions,
          images: finalImages
        })
      });

      if (res.ok) {
         router.push("/admin/products");
         router.refresh();
      } else {
         const err = await res.json();
         alert(err.error || "Có lỗi xảy ra");
      }
    } catch {
      alert("Lỗi kết nối server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.mainCol}>
         <div className={styles.card}>
            <h3>Thông tin cơ bản</h3>
            <div className={styles.formGroup}>
               <label>Tên sản phẩm *</label>
               <input name="name" value={formData.name} onChange={handleChange} required placeholder="Ví dụ: CPU Intel Core i9-14900K" />
            </div>
            <div className={styles.formGroup}>
               <label>Đường dẫn (Slug) *</label>
               <input name="slug" value={formData.slug} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
               <label>Mô tả chi tiết</label>
               <textarea name="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Nhập mô tả sản phẩm..." />
            </div>
         </div>

         <div className={styles.card}>
            <h3>Đa phương tiện</h3>
            <label className={styles.uploadArea}>
               <input type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
               <ImageIcon size={48} className={styles.uploadIcon} />
               <p>Kéo thả hình vào đây hoặc click để tải lên</p>
               <span className={styles.uploadHint}>Hỗ trợ JPG, PNG, WEBP (Max 2MB)</span>
            </label>

            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className={styles.galleryGrid}>
                {existingImages.map((url, idx) => (
                  <div key={`exist-${idx}`} className={styles.galleryItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Ảnh cũ ${idx}`} />
                    <button type="button" onClick={() => removeExistingImage(idx)} className={styles.removeImageBtn}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {newImages.map((file, idx) => (
                  <div key={`new-${idx}`} className={styles.galleryItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(file)} alt={`Ảnh mới ${idx}`} />
                    <button type="button" onClick={() => removeNewImage(idx)} className={styles.removeImageBtn}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
         </div>

         <div className={styles.card}>
            <h3>Thông số kỹ thuật</h3>
            {specs.map((spec, idx) => (
              <div key={idx} className={styles.specRow}>
                <input 
                  placeholder="Key (vd: Socket)" 
                  value={spec.key} 
                  onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                />
                <input 
                  placeholder="Value (vd: LGA 1700)" 
                  value={spec.value} 
                  onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                />
                <button type="button" onClick={() => removeSpecField(idx)} className={styles.removeBtn}>
                  <X size={16} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addSpecField} className={styles.addSpecBtn}>+ Thêm thông số</button>
         </div>

         <div className={styles.card}>
            <h3>Tuỳ chọn biến thể (Options)</h3>
            {options.map((opt, idx) => (
              <div key={idx} className={styles.specRow}>
                <input 
                  placeholder="Nhóm (vd: Màu sắc)" 
                  value={opt.name} 
                  onChange={(e) => handleOptionChange(idx, "name", e.target.value)}
                />
                <input 
                  placeholder="Các giá trị cách nhau bằng dấu phẩy (Dùng : để thêm giá. vd: RAM 16GB, RAM 32GB:500000)" 
                  value={opt.values} 
                  onChange={(e) => handleOptionChange(idx, "values", e.target.value)}
                />
                <button type="button" onClick={() => removeOptionField(idx)} className={styles.removeBtn}>
                  <X size={16} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addOptionField} className={styles.addSpecBtn}>+ Thêm nhóm tuỳ chọn</button>
         </div>
      </div>

      <div className={styles.sideCol}>
         <div className={styles.card}>
            <h3>Trạng thái lưu</h3>
            <div className={styles.formGroup}>
               <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">Đăng ngay (Active)</option>
                  <option value="DRAFT">Bản nháp (Draft)</option>
                  <option value="OUT_OF_STOCK">Hết hàng (Out of stock)</option>
               </select>
            </div>
            
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
              Sản phẩm nổi bật (Featured)
            </label>
         </div>

         <div className={styles.card}>
            <h3>Phân loại</h3>
            <div className={styles.formGroup}>
               <label>Danh mục *</label>
               <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>
            <div className={styles.formGroup}>
               <label>Thương hiệu *</label>
               <select name="brandId" value={formData.brandId} onChange={handleChange} required>
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
               </select>
            </div>
         </div>

         <div className={styles.card}>
            <h3>Giá & Kho</h3>
            <div className={styles.formGroup}>
               <label>Giá bán (VNĐ) *</label>
               <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
            </div>
            <div className={styles.formGroup}>
               <label>Giá sale (nếu có)</label>
               <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} min="0" />
            </div>
            <div className={styles.formGroup}>
               <label>Số lượng kho *</label>
               <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
            </div>
         </div>
      </div>

      <div className={styles.stickyActionBar}>
         <button type="button" className={styles.cancelBtn} onClick={() => router.push("/admin/products")}>
            Hủy bỏ
         </button>
         <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            <Save size={18} />
            {isSubmitting ? "Đang xử lý..." : (initialData ? "Cập nhật sản phẩm" : "Lưu sản phẩm")}
         </button>
      </div>
    </form>
  );
}
