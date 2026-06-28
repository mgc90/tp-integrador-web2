import { User } from "../models/User.js";
import { loginSchema, signupSchema } from "../validators/auth.js";

export async function loginForm(req, res) {
  res.render('auth/login')
}

export async function login(req, res) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).render('auth/login', { errors, formValues: req.body });
  }

  const { email, password } = result.data;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).render('auth/login', {
        alert: { status: "error", text: "Usuario o contraseña incorrecta." },
        formValues: req.body,
      });
    }

    const isValidated = await user.validatePassword(password);
    if (!isValidated) {
      return res.status(400).render('auth/login', {
        alert: { status: "error", text: "Usuario o contraseña incorrecta." },
        formValues: req.body,
      });
    }

    req.session.user = { id: user.id };
  } catch (error) {
    console.log('[!] Error en login: ', error);
    return res.status(500).render('auth/login', {
      alert: { status: "error", text: "Hubo un error al iniciar sesión" },
      formValues: req.body,
    });
  }

  res.redirect('/feed')
}

export async function signupForm(req, res) {
  res.render('auth/signup')
}

export async function signup(req, res) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).render('auth/signup', { errors, formValues: req.body });
  }

  const { nombre, apellido, email, password } = result.data;

  try {
    await User.create({
      firstName: nombre,
      lastName: apellido,
      email,
      password,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render('auth/signup', {
      alert: { status: "error", text: "Hubo un error al crear el usuario" },
      formValues: req.body,
    });
  }

  res.redirect('/auth/login')
}

export async function logout(req, res) {
  if(req.session){
    await req.session.destroy();
    res.redirect('/auth/login');
  }
}