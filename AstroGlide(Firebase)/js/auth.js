import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const toEmail = u => `${u}@astroglide.app`;

window.doRegister = async function () {
  const u = regUser.value.trim();
  const p = regPass.value;
  const p2 = regPass2.value;

  if (!u || !p) return alert("Fill all fields");
  if (p !== p2) return alert("Passwords do not match");

  try {
    await createUserWithEmailAndPassword(auth, toEmail(u), p);
    alert("Registered successfully. Please login.");
    renderModal("login");
  } catch (e) {
    alert(e.message);
  }
};

window.doLogin = async function () {
  const u = loginUser.value.trim();
  const p = loginPass.value;

  try {
    await signInWithEmailAndPassword(auth, toEmail(u), p);
    closeModalFn();
    showLoggedInState(u);
  } catch {
    alert("Invalid credentials");
  }
};

window.doLogout = function () {
  signOut(auth).then(() => location.reload());
};

window.checkAuth = function (cb) {
  onAuthStateChanged(auth, cb);
};
