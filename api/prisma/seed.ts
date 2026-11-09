import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data to prevent unique constraint errors on re-seed
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const genreNames = ["Fantasy", "Science Fiction", "Mystery", "Biography"];
  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.create({
        data: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      }),
    ),
  );

  // Create a sample user
  await prisma.user.create({
    data: {
      email: "librarian@library.com",
      password: "securepassword123",
      role: "LIBRARIAN",
    },
  });

  const sampleBooks = [
    // Fantasy (4)
    { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" },
    { title: "Harry Potter", author: "J.K. Rowling", genre: "Fantasy" },
    { title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy" },
    { title: "Mistborn", author: "Brandon Sanderson", genre: "Fantasy" },
    // Science Fiction (4)
    { title: "Dune", author: "Frank Herbert", genre: "Science Fiction" },
    { title: "Ender's Game", author: "Orson Scott Card", genre: "Science Fiction" },
    { title: "Neuromancer", author: "William Gibson", genre: "Science Fiction" },
    { title: "The Martian", author: "Andy Weir", genre: "Science Fiction" },
    // Mystery (4)
    { title: "The Big Sleep", author: "Raymond Chandler", genre: "Mystery" },
    { title: "Gone Girl", author: "Gillian Flynn", genre: "Mystery" },
    { title: "The Da Vinci Code", author: "Dan Brown", genre: "Mystery" },
    { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Mystery" },
    // Biography (4)
    { title: "Educated", author: "Tara Westover", genre: "Biography" },
    { title: "The Diary of a Young Girl", author: "Anne Frank", genre: "Biography" },
    { title: "Steve Jobs", author: "Walter Isaacson", genre: "Biography" },
    { title: "Becoming", author: "Michelle Obama", genre: "Biography" },
  ];

  for (const book of sampleBooks) {
    const genre = genres.find((g) => g.name === book.genre);
    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        isbn: `978${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        description: `${book.title} by ${book.author}.`,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genre.id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });