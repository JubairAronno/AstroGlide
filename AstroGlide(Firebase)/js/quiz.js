import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let score = 0;
let answered = new Set();

document.querySelectorAll(".quiz-option").forEach(opt => {
  opt.addEventListener("click", function () {
    const card = this.closest(".quiz-card");
    if (answered.has(card.id)) return;

    answered.add(card.id);

    if (this.dataset.correct === "true") score++;

    if (answered.size === 5) saveScore();
  });
});

async function saveScore() {
  if (!auth.currentUser) return;

  await addDoc(collection(db, "quiz_scores"), {
    uid: auth.currentUser.uid,
    score,
    total: 5,
    createdAt: serverTimestamp()
  });

  alert(`Quiz finished! Score: ${score}/5`);
}
