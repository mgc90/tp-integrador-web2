import { Router } from "express"
import { login, loginForm, logout, signup, signupForm } from "../controller/auth.js"

const auth = Router()
auth.get('/login', loginForm)

auth.post('/login', login)

auth.get('/signup', signupForm)

auth.post('/signup', signup)

auth.post('/logout', logout)

export default auth