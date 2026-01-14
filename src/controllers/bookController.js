const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, author, publishedDate } = req.body;
        const book = await prisma.book.create({
            data: {
                title,
                author,
                publishedDate: new Date(publishedDate),
                userId: req.user.id,
            },
        });
        res.status(201).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, publishedDate } = req.body;

        // Check ownership
        const existingBook = await prisma.book.findUnique({ where: { id: parseInt(id) } });
        if (!existingBook) return res.status(404).json({ message: "Book not found" });
        if (existingBook.userId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const book = await prisma.book.update({
            where: { id: parseInt(id) },
            data: {
                title,
                author,
                publishedDate: new Date(publishedDate),
            },
        });
        res.json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ownership
        const existingBook = await prisma.book.findUnique({ where: { id: parseInt(id) } });
        if (!existingBook) return res.status(404).json({ message: "Book not found" });
        if (existingBook.userId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await prisma.book.delete({ where: { id: parseInt(id) } });
        res.json({ success: true, message: "Book deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
};
