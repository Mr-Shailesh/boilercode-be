import express from "express"
import { prisma } from "../scripts/seed.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// Get all books
router.get("/", async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            include: { user: { select: { name: true, email: true } } }
        })
        res.json({ success: true, data: books })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

// Get book by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) },
            include: { user: { select: { name: true, email: true } } }
        })

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" })
        }

        res.json({ success: true, data: book })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

// Create book
router.post("/", protect, async (req, res) => {
    try {
        const { title, author, publishedDate } = req.body

        const book = await prisma.book.create({
            data: {
                title,
                author,
                publishedDate: new Date(publishedDate),
                userId: req.user.id
            }
        })

        res.status(201).json({ success: true, data: book })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

// Update book
router.put("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params
        const { title, author, publishedDate } = req.body

        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) }
        })

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" })
        }

        if (book.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to update this book" })
        }

        const updatedBook = await prisma.book.update({
            where: { id: parseInt(id) },
            data: {
                title,
                author,
                publishedDate: publishedDate ? new Date(publishedDate) : undefined
            }
        })

        res.json({ success: true, data: updatedBook })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

// Delete book
router.delete("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params

        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) }
        })

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" })
        }

        if (book.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this book" })
        }

        await prisma.book.delete({
            where: { id: parseInt(id) }
        })

        res.json({ success: true, message: "Book deleted successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

export default router
