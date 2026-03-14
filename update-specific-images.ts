import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PRODUCT_IMAGES: Record<string, string[]> = {
  "LG 27GP850-B": ["https://www.lg.com/us/images/monitors/md08016462/gallery/desktop-01.jpg"],
  "ASUS ROG Swift PG27AQN": ["https://dlcdnwebimgs.asus.com/gain/9BB0E9C7-87AA-48ED-90E2-C39D3FA6FF31"],
  "Logitech G Pro X Superlight 2": ["https://resource.logitechg.com/w_1000,c_limit,q_auto,f_auto,dpr_auto/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/gallery/pro-x-superlight-2-gallery-1-black.png"],
  "Keychron Q1 Max": ["https://www.keychron.com/cdn/shop/files/Keychron-Q1-Max-QMK-VIA-wireless-custom-mechanical-keyboard-black-1.jpg?v=1702956637"],
  "Samsung 990 Pro": ["https://images.samsung.com/is/image/samsung/p6pim/vn/mz-v9p1t0bw/gallery/vn-990-pro-nvme-m2-ssd-mz-v9p1t0bw-534125791?$650_519_PNG$"],
  "WD Black SN7100": ["https://www.westerndigital.com/content/dam/store/en-us/assets/products/internal-storage/wd-black-sn770-nvme-ssd/gallery/wd-black-sn770-nvme-ssd-front.png"],
  "Corsair Vengeance RGB": ["https://cwsmgmt.corsair.com/pdp/vengeance-rgb-ddr5/images/vengeance-rgb-ddr5-black.png"],
  "Kingston Fury Beast": ["https://media.kingston.com/kingston/product/kf-fury-beast-ddr5-rgb-1-tn.png"]
};

async function updateTargetImages() {
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    for (const [nameKey, urls] of Object.entries(PRODUCT_IMAGES)) {
      if (product.name.includes(nameKey)) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: urls }
        });
        console.log(`Updated images for: ${product.name}`);
        break;
      }
    }
  }
}

updateTargetImages()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
