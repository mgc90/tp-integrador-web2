import { User } from "../models/User.js";

export async function loginForm(req, res) {
  res.render('auth/login')
}

export async function login(req, res) {
  const { email, password } = req.body;
  const mail = email.trim();
  const pass = password.trim();

  if(!mail || !pass ){
    res.status(400).render('auth/login', {
      alert: {
        status: "error",
        text: "Complete todos los campos"
      },
      formValues: req.body
    })
    return
  }

  try {
    const user = await User.findOne({
      where: {
        email: mail
      }
    });
    if(!user){
      res.status(400).render('auth/login', {
        alert: {
          status: "error",
          text: "Usuario o contrasena incorrecta."
        },
        formValues: req.body
      })
      return;
    }
    const isValidated = await user.validatePassword(pass);

    if(!isValidated){
      res.status(400).render('auth/login', {
        alert: {
          status: "error",
          text: "Usuario o contrasena incorrecta."
        },
        formValues: req.body
      })
      return;
    }

    req.session.user = {
      id: user.id,
    };
  } catch (error) {
    console.log('[!] Error en login: ', error);
    res.status(500).render('auth/login', {
      alert: {
        status: "error",
        text: "Hubo un error al iniciar sesion"
      },
      formValues: req.body
    })
    return;
  }

  // si esta todo ok => luego de redirecciona al home
  res.redirect('/expense')
}

export async function signupForm(req, res) {
  res.render('auth/signup')
}

export async function signup(req, res) {
  const { nombre, email, password, confirmPassword, apellido } = req.body

  const name = nombre.trim();
  const lastname = apellido.trim();
  const mail = email.trim();
  const pass = password.trim();
  const confirmPass = password.trim();

  if(!name || !lastname || !mail || !pass || !confirmPass){
    res.status(400).render('auth/signup', {
      alert: {
        status: "error",
        text: "No deben haber campos vacios"
      },
      formValues: req.body
    })
  }

  if(pass !== confirmPass){
    res.status(400).render('auth/signup', {
      alert: {
        status: "error",
        text: "Las contrasenas no coinciden"
      },
      formValues: req.body
    })
  }

  try {
    const user = await User.create({
      firstName: name,
      lastName: lastname,
      email: mail,
      password: pass
    })
  } catch (error) {
    console.log(error);
    res.status(500).render('auth/signup', {
      alert: {
        status: "error",
        text: "Hubo un error al crear el usuario"
      },
      formValues: req.body
    })
    return;
  }

  // si esta todo ok => luego de redirecciona al home
  res.redirect('/expense')
}

export async function logout(req, res) {
  if(req.session){
    await req.session.destroy();
    res.redirect('/auth/login');
    return;
  }
}