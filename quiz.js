fetch('../../../quiz/semiPracticalQuizzes.json')
  .then(response => response.json())
  .then(data => {
    // Fisher-Yates 알고리즘으로 배열 셔플
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
      }
    }

    // 퀴즈 데이터 셔플
    shuffleArray(data);

    const container = document.getElementById('quiz-container');

    data.forEach((item, index) => {
      const wrapper = document.createElement('div');
      wrapper.style.border = "1px solid #ccc";
      wrapper.style.padding = "10px";
      wrapper.style.marginBottom = "10px";

      // 문제에서 코드 블럭 추출 (예: \n\n 기준으로 나누기)
      const split = item.question.split(/\n(?=.+)/); // 줄바꿈 기준 분리
      const firstLine = split[0];
      const restCode = split.slice(1).join('\n');

      let questionHTML = `<p><strong>문제 ${index + 1}:</strong> ${firstLine}</p>`;

      // 코드가 존재한다면 코드 블럭 렌더링
      if (restCode.trim()) {
        // HTML 특수문자 이스케이프 처리
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

        const escapedCode = escapeHtml(restCode).replace(/\n/g, '<br>'); // \n을 <br>로 바꾸기

        questionHTML += `
          <div style="
            background-color: #f4f4f4;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            font-family: monospace;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            word-break: break-all;
            margin-top: 10px;
          ">${escapedCode}</div>
        `;
      }

      // 이미지가 존재하면 이미지 추가
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

      // 정답 보기 버튼 클릭 시 동작
      document.getElementById(`btn-${index}`).addEventListener('click', () => {
        const answer = document.getElementById(`answer-${index}`);
        answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
      });
    });

  })
  .catch(error => {
    console.error('퀴즈 로딩 실패:', error);
  });
