import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function runTests() {
  console.log('🧪 Đang kiểm tra dữ liệu module Tin tức...\n');
  let passed = 0;
  let total = 6;

  try {
    // 1. Kiểm tra Categories (news_categories)
    const categories = await (prisma as any).newsCategory.findMany();
    if (categories.length >= 4) {
      console.log('✅ 1. Danh mục: Đã tìm thấy ' + categories.length + ' danh mục.');
      passed++;
    } else {
      console.log('❌ 1. Danh mục: Thiếu danh mục.');
    }

    // 2. Kiểm tra danh sách bài viết (posts)
    const posts = await (prisma as any).post.findMany({
        include: { category: true }
    });
    if (posts.length >= 10) {
      console.log('✅ 2. Danh sách bài viết: Đã tìm thấy ' + posts.length + ' bài viết.');
      passed++;
    } else {
      console.log('❌ 2. Danh sách bài viết: Thiếu bài viết.');
    }

    // 3. Kiểm tra bài viết nổi bật
    const featured = posts.filter((p: any) => p.isFeatured);
    if (featured.length > 0) {
      console.log('✅ 3. Tin nổi bật: Đã lấy được ' + featured.length + ' bài viết nổi bật.');
      passed++;
    } else {
      console.log('❌ 3. Tin nổi bật: Không thấy bài nào nổi bật.');
    }

    // 4. Kiểm tra bài viết theo slug
    if (posts.length > 0) {
      const slug = posts[0].slug;
      const post = await (prisma as any).post.findUnique({ where: { slug } });
      if (post && post.title === posts[0].title) {
        console.log('✅ 4. Chi tiết bài viết: Đã tìm thấy bài viết theo slug "' + slug + '".');
        passed++;
      } else {
        console.log('❌ 4. Chi tiết bài viết: Lỗi slug.');
      }
    }

    // 5. Kiểm tra lọc theo danh mục
    if (categories.length > 0) {
      const catId = categories[0].id;
      const catPosts = posts.filter((p: any) => p.categoryId === catId);
      if (catPosts.length > 0) {
        console.log('✅ 5. Lọc danh mục: Danh mục "' + categories[0].name + '" có ' + catPosts.length + ' bài.');
        passed++;
      }
    }

    // 6. Kiểm tra quan hệ dữ liệu
    if (posts.length > 0 && posts[0].category) {
      console.log('✅ 6. Quan hệ dữ liệu: Post đã map đúng với Category.');
      passed++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 KẾT QUẢ: ' + passed + '/' + total + ' tests đạt.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (passed === total) {
      console.log('\n🚀 Tuyệt vời! Tất cả dữ liệu đã được verify thành công.');
    }

  } catch (error) {
    console.error('❌ Lỗi kỹ thuật:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

runTests();
