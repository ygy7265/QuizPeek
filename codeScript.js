let problems = [];
let currentIndex = 0;

fetch('/QuizPeek/quiz/gisaCodeProblems.json')
  .then(response => response.json())
  .then(data => {
    problems = shuffleArray(data); // 페이지 로드 시 한 번만 셔플
    showProblem();
  })
  .catch(error => {
    console.error('문제 파일을 불러오는데 실패했습니다:', error);
  });
// 배열 섞기 함수 (Fisher-Yates shuffle)
function shuffleArray(arr) {
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function showProblem() {
  const p = problems[currentIndex];
  document.getElementById('description').innerText = p.description;
  document.getElementById('progress').innerText = `문제 ${currentIndex + 1} / ${problems.length}`;

  const codeEl = document.getElementById('code');
  codeEl.textContent = p.code;
  codeEl.className = `language-${p.language}`;
  hljs.highlightElement(codeEl);

  const answerEl = document.getElementById('answer');
  answerEl.innerText = p.answer;
  answerEl.style.display = 'none';
}

document.getElementById('showAnswerBtn').addEventListener('click', () => {
  const answerEl = document.getElementById('answer');
  if (answerEl.style.display === 'none') {
    answerEl.style.display = 'block';
  } else {
    answerEl.style.display = 'none';
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % problems.length;
  showProblem();
});

document.getElementById('prevBtn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + problems.length) % problems.length;
  showProblem();
});
