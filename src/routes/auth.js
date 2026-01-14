import express from "express"
import { register, login, user } from "../controllers/authController.js"
import { protect } from "../middleware/auth.js"
import { validateRegister, validateLogin } from "../middleware/validation.js"

const router = express.Router()

// Public routes
router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)

// Protected routes
router.get("/me", protect, user)

router.get("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout successful. Clear token on client side.",
  })
})

export default router
