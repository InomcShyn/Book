import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Book from './models/Book.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Category.deleteMany({});
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Văn học',
        description: 'Sách văn học Việt Nam và thế giới',
        status: 'active',
      },
      {
        name: 'Kinh tế',
        description: 'Sách về kinh tế, kinh doanh',
        status: 'active',
      },
      {
        name: 'Kỹ năng sống',
        description: 'Sách phát triển bản thân',
        status: 'active',
      },
      {
        name: 'Công nghệ',
        description: 'Sách về lập trình, công nghệ',
        status: 'active',
      },
      {
        name: 'Khoa học',
        description: 'Sách khoa học tự nhiên và xã hội',
        status: 'active',
      },
    ]);
    console.log('✅ Created categories:', categories.length);

    // Create books
    const books = await Book.insertMany([
      {
        name: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        price: 100000,
        categoryId: categories[2]._id, // Kỹ năng sống
        status: 'active',
      },
      {
        name: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        price: 80000,
        categoryId: categories[0]._id, // Văn học
        status: 'active',
      },
      {
        name: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        price: 150000,
        categoryId: categories[4]._id, // Khoa học
        status: 'active',
      },
      {
        name: 'Tư Duy Nhanh Và Chậm',
        author: 'Daniel Kahneman',
        price: 120000,
        categoryId: categories[1]._id, // Kinh tế
        status: 'active',
      },
      {
        name: 'Clean Code',
        author: 'Robert C. Martin',
        price: 200000,
        categoryId: categories[3]._id, // Công nghệ
        status: 'active',
      },
      {
        name: 'JavaScript: The Good Parts',
        author: 'Douglas Crockford',
        price: 180000,
        categoryId: categories[3]._id, // Công nghệ
        status: 'active',
      },
      {
        name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        price: 90000,
        categoryId: categories[2]._id, // Kỹ năng sống
        status: 'active',
      },
      {
        name: 'Nghệ Thuật Bán Hàng',
        author: 'Brian Tracy',
        price: 110000,
        categoryId: categories[1]._id, // Kinh tế
        status: 'active',
      },
      {
        name: 'Số Đỏ',
        author: 'Vũ Trọng Phụng',
        price: 70000,
        categoryId: categories[0]._id, // Văn học
        status: 'active',
      },
      {
        name: 'Lão Hạc',
        author: 'Nam Cao',
        price: 60000,
        categoryId: categories[0]._id, // Văn học
        status: 'active',
      },
      {
        name: 'Design Patterns',
        author: 'Gang of Four',
        price: 250000,
        categoryId: categories[3]._id, // Công nghệ
        status: 'active',
      },
      {
        name: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
        author: 'Stephen Hawking',
        price: 140000,
        categoryId: categories[4]._id, // Khoa học
        status: 'active',
      },
      {
        name: 'Tôi Tài Giỏi, Bạn Cũng Thế',
        author: 'Adam Khoo',
        price: 95000,
        categoryId: categories[2]._id, // Kỹ năng sống
        status: 'active',
      },
      {
        name: 'Kinh Tế Học Vĩ Mô',
        author: 'N. Gregory Mankiw',
        price: 180000,
        categoryId: categories[1]._id, // Kinh tế
        status: 'active',
      },
      {
        name: 'Trí Tuệ Nhân Tạo',
        author: 'Stuart Russell',
        price: 220000,
        categoryId: categories[3]._id, // Công nghệ
        status: 'active',
      },
    ]);
    console.log('✅ Created books:', books.length);

    console.log('\n🎉 Seed completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Books: ${books.length}`);
    console.log('\n💡 You can now start the server with: npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
