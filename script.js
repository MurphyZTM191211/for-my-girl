const storyChapters = {
  'hard-days': {
    number: 'A little chapter · 01',
    title: 'When everything felt like too much',
    text: "You didn't ask me to pretend I was okay. You let me be exactly where I was, and stayed beside me anyway. I'll never forget how much that meant.",
    sign: 'You made the heavy days easier to carry.',
  },
  'showing-up': {
    number: 'A little chapter · 02',
    title: 'You kept showing up',
    text: "Somehow, whether you had the perfect words or not, you were there. That quiet kind of care reminded me I didn't have to go through everything on my own.",
    sign: 'Your presence said more than words could.',
  },
  listening: {
    number: 'A little chapter · 03',
    title: 'You made room for me',
    text: 'Thank you for listening without rushing me, for being patient, and for letting me feel whatever I needed to feel. You made it safe to be honest.',
    sign: 'Being heard by you meant everything.',
  },
  light: {
    number: 'A little chapter · 04',
    title: 'Little by little, the light came back',
    text: 'You reminded me that even hard seasons change. With you beside me, there was room for a laugh, a breath, and hope for brighter days.',
    sign: 'Thank you for helping me find my way back.',
  },
};

const storyTabs = Array.from(document.querySelectorAll('.story-tab'));
const storyPanel = document.getElementById('story-panel');
const storyNumber = document.getElementById('story-number');
const storyTitle = document.getElementById('story-card-title');
const storyText = document.getElementById('story-card-text');
const storySign = document.getElementById('story-card-sign');

const selectStory = (tab, moveFocus = false) => {
  const chapter = storyChapters[tab.dataset.story];
  if (!chapter) return;

  storyTabs.forEach((storyTab) => {
    const isSelected = storyTab === tab;
    storyTab.classList.toggle('active', isSelected);
    storyTab.setAttribute('aria-selected', String(isSelected));
    storyTab.tabIndex = isSelected ? 0 : -1;
  });

  storyPanel.setAttribute('aria-labelledby', tab.id);
  storyNumber.textContent = chapter.number;
  storyTitle.textContent = chapter.title;
  storyText.textContent = chapter.text;
  storySign.textContent = chapter.sign;

  if (moveFocus) tab.focus();
};

storyTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStory(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % storyTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + storyTabs.length) % storyTabs.length;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectStory(storyTabs[nextIndex], true);
  });
});

const letterDialog = document.getElementById('letter-dialog');
const openLetterButtons = document.querySelectorAll('[data-open-letter]');
const closeLetterButtons = document.querySelectorAll('[data-close-letter]');

openLetterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!letterDialog.open) letterDialog.showModal();
  });
});

closeLetterButtons.forEach((button) => {
  button.addEventListener('click', () => letterDialog.close());
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && letterDialog.open) letterDialog.close();
});

letterDialog.addEventListener('click', (event) => {
  if (event.target === letterDialog) letterDialog.close();
});

const floatingLayer = document.getElementById('floatingLayer');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  const decorations = ['♡', '✧', '✦'];

  for (let index = 0; index < 12; index += 1) {
    const decoration = document.createElement('span');
    decoration.className = index % 3 === 1 ? 'floating-star' : 'floating-heart';
    decoration.textContent = decorations[index % decorations.length];
    decoration.style.left = `${(index * 37 + 9) % 100}%`;
    decoration.style.fontSize = `${0.8 + (index % 4) * 0.18}rem`;
    decoration.style.animationDuration = `${19 + (index % 7) * 2}s`;
    decoration.style.animationDelay = `${-(index % 9) * 2}s`;
    decoration.style.setProperty('--drift', `${(index % 2 ? 1 : -1) * (22 + (index % 5) * 13)}px`);
    floatingLayer.appendChild(decoration);
  }
}
