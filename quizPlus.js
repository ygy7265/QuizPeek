fetch('/QuizPeek/quiz/semiPracticalQuizzesPlus.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('quiz-container');
    const originalData = [...data]; // 전체 퀴즈 원본 저장

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    function renderQuizzes(data) {
      container.innerHTML = ''; // 기존 내용 지우기
      if (!document.getElementById('shuffle-selected-btn')) {
        const shuffleSelectedBtn = document.createElement('button');
        shuffleSelectedBtn.id = 'shuffle-selected-btn';
        shuffleSelectedBtn.textContent = '✅ 선택한 문제만 다시 보기';
        shuffleSelectedBtn.style.marginTop = '20px';
        shuffleSelectedBtn.style.padding = '10px';
        shuffleSelectedBtn.style.backgroundColor = '#28a745';
        shuffleSelectedBtn.style.color = 'white';
        shuffleSelectedBtn.style.border = 'none';
        shuffleSelectedBtn.style.borderRadius = '5px';
        shuffleSelectedBtn.style.cursor = 'pointer';

        shuffleSelectedBtn.addEventListener('click', () => {
          const checked = Array.from(document.querySelectorAll('.quiz-check:checked'));
          const selected = checked.map(chk => {
            const index = chk.dataset.index;
            // 현재 보여지는 data에서 index 추출
            return data[parseInt(index)];
          });
          shuffleArray(selected);
          renderQuizzes(selected);
        });

        container.appendChild(shuffleSelectedBtn);

        // 🔁 전체 다시 셔플 버튼 추가
        const reshuffleAllBtn = document.createElement('button');
        reshuffleAllBtn.textContent = '🔁 전체 다시 셔플하기';
        reshuffleAllBtn.style.marginTop = '10px';
        reshuffleAllBtn.style.marginLeft = '10px';
        reshuffleAllBtn.style.padding = '10px';
        reshuffleAllBtn.style.backgroundColor = '#ffc107';
        reshuffleAllBtn.style.color = 'black';
        reshuffleAllBtn.style.border = 'none';
        reshuffleAllBtn.style.borderRadius = '5px';
        reshuffleAllBtn.style.cursor = 'pointer';

        reshuffleAllBtn.addEventListener('click', () => {
          const copiedData = [...originalData];
          shuffleArray(copiedData);
          renderQuizzes(copiedData);
        });

        container.appendChild(reshuffleAllBtn);
        container.appendChild(reshuffleAllBtn);
      data.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.style.border = "1px solid #ccc";
        wrapper.style.padding = "10px";
        wrapper.style.marginBottom = "10px";

        // 줄바꿈 기준 분리
        const split = item.question.split(/\n(?=.+)/);
        const firstLine = split[0];
        const restCode = split.slice(1).join('\n');

        let questionHTML = `
          <label style="display: flex; align-items: center; margin-bottom: 5px;">
            <input type="checkbox" class="quiz-check" data-index="${index}" style="margin-right: 10px;">
            <strong>문제 ${index + 1}:</strong> ${firstLine}
          </label>
        `;

        if (restCode.trim()) {
          const escapeHtml = (str) => {
            return str.replace(/[&<>"']/g, (match) => {
              const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
              };
              return map[match];
            });
          };
          const escapedCode = escapeHtml(restCode).replace(/\n/g, '<br>');
          questionHTML += `
            <div style="background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; border-radius: 5px;
              font-size: 14px; font-family: monospace; white-space: pre-wrap; overflow-wrap: break-word; margin-top: 10px;">
              ${escapedCode}
            </div>
          `;
        }

        if (item.image) {
          questionHTML += `
            <div style="margin-top: 10px;">
              <img src="${item.image}" alt="문제 이미지" style="max-width: 100%; height: auto;">
            </div>
          `;
        }

        wrapper.innerHTML = `
          ${questionHTML}
          <button id="btn-${index}">정답 보기</button>
          <p id="answer-${index}" style="display: none; color: green; margin-top: 5px;">
            <strong>정답:</strong><br>
            ${item.answer ? item.answer.replace(/\n/g, '<br>') : '정답이 없습니다.'}
          </p>
        `;

        container.appendChild(wrapper);

        document.getElementById(`btn-${index}`).addEventListener('click', () => {
          const answer = document.getElementById(`answer-${index}`);
          answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
        });
      });
// 선택 문제로 다시 보기 버튼 없으면 추가

      }
    }

    // 처음 셔플하여 전체 렌더링
    shuffleArray(data);
    renderQuizzes(data);
  })
  .catch(error => {
    console.error('퀴즈 로딩 실패:', error);
  });
