import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean database to prevent unique constraint conflicts on re-runs
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Genres (4+ required)
  const fiction = await prisma.genre.create({ data: { name: 'Fiction' } });
  const sciFi = await prisma.genre.create({ data: { name: 'Science Fiction' } });
  const fantasy = await prisma.genre.create({ data: { name: 'Fantasy' } });
  const mystery = await prisma.genre.create({ data: { name: 'Mystery' } });

  // Create a sample user for the review stretch relation
  await prisma.user.create({
    data: {
      email: 'librarian@library.com',
      name: 'Head Librarian',
      role: Role.LIBRARIAN,
    },
  });

  // 2. Create Books (15+ required distributed across genres)
  const booksData = [
    // Fiction
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedYear: 1960, genreId: fiction.id },
    { title: '1984', author: 'George Orwell', publishedYear: 1949, genreId: fiction.id },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publishedYear: 1925, genreId: fiction.id },
    { title: 'Pride and Prejudice', author: 'Jane Austen', publishedYear: 1813, genreId: fiction.id },
    
    // Science Fiction
    { title: 'Dune', author: 'Frank Herbert', publishedYear: 1965, genreId: sciFi.id },
    { title: 'Ender\'s Game', author: 'Orson Scott Card', publishedYear: 1985, genreId: sciFi.id },
    { title: 'Neuromancer', author: 'William Gibson', publishedYear: 1984, genreId: sciFi.id },
    { title: 'The Martian', author: 'Andy Weir', publishedYear: 2011, genreId: sciFi.id },
    
    // Fantasy
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937, genreId: fantasy.id },
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', publishedYear: 1997, genreId: fantasy.id },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', publishedYear: 2007, genreId: fantasy.id },
    { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', publishedYear: 2006, genreId: fantasy.id },
    
    // Mystery
    { title: 'The Da Vinci Code', author: 'Dan Brown', publishedYear: 2003, genreId: mystery.id },
    { title: 'Gone Girl', author: 'Gillian Flynn', publishedYear: 2012, genreId: mystery.id },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', publishedYear: 2005, genreId: mystery.id },
    { title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', publishedYear: 1887, genreId: mystery.id },
  ];

  for (const book of booksData) {
    await prisma.book.create({ data: book });
  }

  console.log(`Successfully seeded ${booksData.length} books across 4 genres.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });