#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ======================
// DATA DEFINITIONS
// ======================

const N5_VERBS = [
  { kanji: '食べる', hiragana: 'たべる', type: 'ru', english: 'to eat' },
  { kanji: '飲む', hiragana: 'のむ', type: 'u', english: 'to drink' },
  { kanji: '行く', hiragana: 'いく', type: 'u-special', english: 'to go' },
  { kanji: '来る', hiragana: 'くる', type: 'irr', english: 'to come' },
  { kanji: 'する', hiragana: 'する', type: 'irr', english: 'to do' },
  { kanji: '見る', hiragana: 'みる', type: 'ru', english: 'to see' },
  { kanji: '聞く', hiragana: 'きく', type: 'u', english: 'to hear' },
  { kanji: '読む', hiragana: 'よむ', type: 'u', english: 'to read' },
  { kanji: '書く', hiragana: 'かく', type: 'u', english: 'to write' },
  { kanji: '話す', hiragana: 'はなす', type: 'u', english: 'to speak' },
  { kanji: '買う', hiragana: 'かう', type: 'u', english: 'to buy' },
  { kanji: '待つ', hiragana: 'まつ', type: 'u', english: 'to wait' },
  { kanji: '会う', hiragana: 'あう', type: 'u', english: 'to meet' },
  { kanji: 'なる', hiragana: 'なる', type: 'u', english: 'to become' },
  { kanji: '帰る', hiragana: 'かえる', type: 'u', english: 'to return' },
  { kanji: '出る', hiragana: 'でる', type: 'ru', english: 'to leave' },
  { kanji: '入る', hiragana: 'はいる', type: 'u', english: 'to enter' },
  { kanji: '立つ', hiragana: 'たつ', type: 'u', english: 'to stand' },
  { kanji: '座る', hiragana: 'すわる', type: 'u', english: 'to sit' },
  { kanji: '歩く', hiragana: 'あるく', type: 'u', english: 'to walk' },
  { kanji: '走る', hiragana: 'はしる', type: 'u', english: 'to run' },
  { kanji: '泳ぐ', hiragana: 'およぐ', type: 'u', english: 'to swim' },
  { kanji: '遊ぶ', hiragana: 'あそぶ', type: 'u', english: 'to play' },
  { kanji: '働く', hiragana: 'はたらく', type: 'u', english: 'to work' },
  { kanji: '休む', hiragana: 'やすむ', type: 'u', english: 'to rest' },
  { kanji: '起きる', hiragana: 'おきる', type: 'ru', english: 'to wake up' },
  { kanji: '寝る', hiragana: 'ねる', type: 'ru', english: 'to sleep' },
  { kanji: '開ける', hiragana: 'あける', type: 'ru', english: 'to open' },
  { kanji: '閉める', hiragana: 'しめる', type: 'ru', english: 'to close' },
  { kanji: 'つける', hiragana: 'つける', type: 'ru', english: 'to turn on' },
  { kanji: '消す', hiragana: 'けす', type: 'u', english: 'to turn off' },
  { kanji: '持つ', hiragana: 'もつ', type: 'u', english: 'to hold' },
  { kanji: '使う', hiragana: 'つかう', type: 'u', english: 'to use' },
  { kanji: '作る', hiragana: 'つくる', type: 'u', english: 'to make' },
  { kanji: '教える', hiragana: 'おしえる', type: 'ru', english: 'to teach' },
  { kanji: '習う', hiragana: 'ならう', type: 'u', english: 'to learn' },
];

const N4_VERBS = [
  { kanji: '届ける', hiragana: 'とどける', type: 'ru', english: 'to deliver' },
  { kanji: '届く', hiragana: 'とどく', type: 'u', english: 'to arrive' },
  { kanji: '間に合う', hiragana: 'まにあう', type: 'u', english: 'to be on time' },
  { kanji: '慣れる', hiragana: 'なれる', type: 'ru', english: 'to get used to' },
  { kanji: '決める', hiragana: 'きめる', type: 'ru', english: 'to decide' },
  { kanji: '変わる', hiragana: 'かわる', type: 'u', english: 'to change (intr)' },
  { kanji: '変える', hiragana: 'かえる', type: 'ru', english: 'to change (tr)' },
  { kanji: '比べる', hiragana: 'くらべる', type: 'ru', english: 'to compare' },
  { kanji: '続ける', hiragana: 'つづける', type: 'ru', english: 'to continue (tr)' },
  { kanji: '続く', hiragana: 'つづく', type: 'u', english: 'to continue (intr)' },
  { kanji: '片付ける', hiragana: 'かたづける', type: 'ru', english: 'to tidy up' },
  { kanji: '伝える', hiragana: 'つたえる', type: 'ru', english: 'to convey' },
  { kanji: '落ちる', hiragana: 'おちる', type: 'ru', english: 'to fall' },
  { kanji: '落とす', hiragana: 'おとす', type: 'u', english: 'to drop' },
  { kanji: '壊れる', hiragana: 'こわれる', type: 'ru', english: 'to break (intr)' },
  { kanji: '壊す', hiragana: 'こわす', type: 'u', english: 'to break (tr)' },
  { kanji: '直す', hiragana: 'なおす', type: 'u', english: 'to fix' },
  { kanji: '見つける', hiragana: 'みつける', type: 'ru', english: 'to find' },
  { kanji: '運ぶ', hiragana: 'はこぶ', type: 'u', english: 'to carry' },
  { kanji: '選ぶ', hiragana: 'えらぶ', type: 'u', english: 'to choose' },
  { kanji: '守る', hiragana: 'まもる', type: 'u', english: 'to protect' },
  { kanji: '忘れる', hiragana: 'わすれる', type: 'ru', english: 'to forget' },
  { kanji: '疲れる', hiragana: 'つかれる', type: 'ru', english: 'to get tired' },
  { kanji: 'やめる', hiragana: 'やめる', type: 'ru', english: 'to quit' },
  { kanji: '盗む', hiragana: 'ぬすむ', type: 'u', english: 'to steal' },
  { kanji: '殴る', hiragana: 'なぐる', type: 'u', english: 'to punch' },
  { kanji: '踏む', hiragana: 'ふむ', type: 'u', english: 'to step on' },
  { kanji: '怒る', hiragana: 'おこる', type: 'u', english: 'to get angry' },
  { kanji: '減らす', hiragana: 'へらす', type: 'u', english: 'to reduce' },
  { kanji: '買い替える', hiragana: 'かいかえる', type: 'ru', english: 'to replace by buying' },
];

const ALL_VERBS = [...N5_VERBS, ...N4_VERBS];

const VOCABULARY = [
  { jp: '水', reading: 'みず', english: 'water' },
  { jp: '食べ物', reading: 'たべもの', english: 'food' },
  { jp: '飲み物', reading: 'のみもの', english: 'drink' },
  { jp: '朝', reading: 'あさ', english: 'morning' },
  { jp: '昼', reading: 'ひる', english: 'noon' },
  { jp: '夜', reading: 'よる', english: 'night' },
  { jp: '今日', reading: 'きょう', english: 'today' },
  { jp: '明日', reading: 'あした', english: 'tomorrow' },
  { jp: '昨日', reading: 'きのう', english: 'yesterday' },
  { jp: '学生', reading: 'がくせい', english: 'student' },
  { jp: '先生', reading: 'せんせい', english: 'teacher' },
  { jp: '会社', reading: 'かいしゃ', english: 'company' },
  { jp: '学校', reading: 'がっこう', english: 'school' },
  { jp: '家', reading: 'いえ', english: 'house' },
  { jp: '駅', reading: 'えき', english: 'station' },
  { jp: '大きい', reading: 'おおきい', english: 'big' },
  { jp: '小さい', reading: 'ちいさい', english: 'small' },
  { jp: '新しい', reading: 'あたらしい', english: 'new' },
  { jp: '古い', reading: 'ふるい', english: 'old' },
  { jp: '綺麗', reading: 'きれい', english: 'clean' },
  { jp: '時間', reading: 'じかん', english: 'time' },
  { jp: '月', reading: 'つき', english: 'moon' },
  { jp: '日', reading: 'ひ', english: 'day' },
  { jp: '年', reading: 'ねん', english: 'year' },
  { jp: '友達', reading: 'ともだち', english: 'friend' },
  { jp: '家族', reading: 'かぞく', english: 'family' },
  { jp: '兄弟', reading: 'きょうだい', english: 'siblings' },
  { jp: '父', reading: 'ちち', english: 'father' },
  { jp: '母', reading: 'はは', english: 'mother' },
  { jp: '本', reading: 'ほん', english: 'book' },
  { jp: 'コンピュータ', reading: 'こんぴゅーた', english: 'computer' },
  { jp: '仕事', reading: 'しごと', english: 'work' },
  { jp: '休日', reading: 'きゅうじつ', english: 'holiday' },
  { jp: '週末', reading: 'しゅうまつ', english: 'weekend' },
  { jp: '色', reading: 'いろ', english: 'color' },
];

const GRAMMAR_POINTS = [
  {
    name: 'Passive (受身形)',
    pattern: '～(ら)れる',
    examples: [
      { jp: '彼は先生に褒められた。', en: 'He was praised by the teacher.' },
      { jp: 'この本は100万人に読まれている。', en: 'This book is read by 1 million people.' },
      { jp: '猫に傷つけられました。', en: 'I was hurt by a cat.' },
    ],
    exercises: [
      { jp: '日本語は___世界中で話されています。', blank: 'は', answer: 'は', en: 'Japanese is spoken all over the world.' },
      { jp: '私は兄に___られました。', blank: 'ほめ', answer: 'ほめ', en: 'I was praised by my older brother.' },
    ],
  },
  {
    name: 'Causative (使役形)',
    pattern: '～(さ)せる',
    examples: [
      { jp: '親は子どもに勉強させた。', en: 'The parent made the child study.' },
      { jp: '先生は学生に読ませました。', en: 'The teacher made the students read.' },
      { jp: '彼女は私に待たせた。', en: 'My girlfriend made me wait.' },
    ],
    exercises: [
      { jp: '母は私に___させました。', blank: 'は', answer: 'は', en: 'Mother made me...' },
    ],
  },
  {
    name: 'Experience: ～たことがある',
    pattern: '～たことがある',
    examples: [
      { jp: '日本に行ったことがあります。', en: 'I have been to Japan.' },
      { jp: 'すし を食べたことがありません。', en: 'I have never eaten sushi.' },
      { jp: 'あなたは富士山を見たことがありますか？', en: 'Have you ever seen Mt. Fuji?' },
    ],
    exercises: [
      { jp: '私は京都に___ことがあります。', blank: 'いった', answer: 'いった', en: 'I have been to Kyoto.' },
    ],
  },
  {
    name: 'Permission & Prohibition',
    pattern: '～てもいい / ～てはいけない',
    examples: [
      { jp: '水を飲んでもいいですか？', en: 'May I drink water?' },
      { jp: 'ここで走ってはいけません。', en: 'You must not run here.' },
      { jp: '電話を使っていいですか？', en: 'May I use the phone?' },
    ],
    exercises: [
      { jp: 'ここで寝___いいですか？', blank: 'ても', answer: 'ても', en: 'May I sleep here?' },
    ],
  },
  {
    name: 'Obligation: ～なければならない',
    pattern: '～なければならない',
    examples: [
      { jp: '毎日勉強しなければならない。', en: 'I must study every day.' },
      { jp: '明日までに終わらなければならない。', en: 'It must be finished by tomorrow.' },
      { jp: '会社に行かなければなりません。', en: 'I have to go to the company.' },
    ],
    exercises: [
      { jp: '宿題をしなければ___。', blank: 'ならない', answer: 'ならない', en: 'I must do homework.' },
    ],
  },
];

const CONJUGATION_FORMS = ['te-form', 'nai-form', 'ta-form', 'passive', 'causative', 'potential', 'volitional', 'ba-conditional'];

// ======================
// CONJUGATION ENGINE
// ======================

function getLastHiragana(word) {
  return word[word.length - 1];
}

function getStemWithoutRu(word) {
  return word.slice(0, -2);
}

function getUVerbStem(word) {
  // Get the base without the u-sound syllable
  return word.slice(0, -1);
}

function uSoundToASoundTable(char) {
  const map = {
    'く': 'か', 'ぐ': 'が', 'す': 'さ', 'つ': 'た', 'ぬ': 'な', 'ぶ': 'ば', 'む': 'ま', 'る': 'ら', 'う': 'わ',
  };
  return map[char] || char;
}

function uSoundToESoundTable(char) {
  const map = {
    'く': 'け', 'ぐ': 'げ', 'す': 'せ', 'つ': 'て', 'ぬ': 'ね', 'ぶ': 'べ', 'む': 'め', 'る': 'れ', 'う': 'え',
  };
  return map[char] || char;
}

function uSoundToOSoundTable(char) {
  const map = {
    'く': 'こ', 'ぐ': 'ご', 'す': 'そ', 'つ': 'と', 'ぬ': 'の', 'ぶ': 'ぼ', 'む': 'も', 'る': 'ろ', 'う': 'お',
  };
  return map[char] || char;
}

function conjugateVerb(hiragana, type, form) {
  // Special cases for irregulars
  if (type === 'irr') {
    if (hiragana === 'する') {
      const irregularSuru = {
        'te-form': 'して',
        'nai-form': 'しない',
        'ta-form': 'した',
        'passive': 'される',
        'causative': 'させる',
        'causative-passive': 'させられる',
        'potential': 'できる',
        'volitional': 'しよう',
        'ba-conditional': 'すれば',
      };
      return irregularSuru[form];
    } else if (hiragana === 'くる' || hiragana === 'くるう') {
      const irregularKuru = {
        'te-form': 'きて',
        'nai-form': 'こない',
        'ta-form': 'きた',
        'passive': 'こられる',
        'causative': 'こさせる',
        'causative-passive': 'こさせられる',
        'potential': 'こられる',
        'volitional': 'こよう',
        'ba-conditional': 'くれば',
      };
      return irregularKuru[form];
    }
  }

  // う-verb (godan)
  if (type === 'u' || type === 'u-special') {
    const stem = getUVerbStem(hiragana);
    const lastChar = getLastHiragana(hiragana);
    const aSound = uSoundToASoundTable(lastChar);
    const eSound = uSoundToESoundTable(lastChar);
    const oSound = uSoundToOSoundTable(lastChar);

    const specialHandling = {
      'いく': {
        'te-form': 'いって',
        'ta-form': 'いった',
      },
      '行く': {
        'te-form': '行って',
        'ta-form': '行った',
      },
    };

    if (specialHandling[hiragana] && specialHandling[hiragana][form]) {
      return specialHandling[hiragana][form];
    }

    switch (form) {
      case 'te-form':
        if (lastChar === 'う') return stem + 'って';
        if (lastChar === 'く') return stem + 'いて';
        if (lastChar === 'ぐ') return stem + 'いで';
        if (lastChar === 'す') return stem + 'して';
        if (lastChar === 'つ') return stem + 'って';
        if (lastChar === 'ぬ') return stem + 'んで';
        if (lastChar === 'ぶ') return stem + 'んで';
        if (lastChar === 'む') return stem + 'んで';
        if (lastChar === 'る') return stem + 'って';
        break;
      case 'nai-form':
        return stem + aSound + 'ない';
      case 'ta-form':
        if (lastChar === 'う') return stem + 'った';
        if (lastChar === 'く') return stem + 'いた';
        if (lastChar === 'ぐ') return stem + 'いだ';
        if (lastChar === 'す') return stem + 'した';
        if (lastChar === 'つ') return stem + 'った';
        if (lastChar === 'ぬ') return stem + 'んだ';
        if (lastChar === 'ぶ') return stem + 'んだ';
        if (lastChar === 'む') return stem + 'んだ';
        if (lastChar === 'る') return stem + 'った';
        break;
      case 'passive':
        return stem + aSound + 'れる';
      case 'causative':
        return stem + aSound + 'せる';
      case 'causative-passive':
        return stem + aSound + 'せられる';
      case 'potential':
        return stem + eSound + 'る';
      case 'volitional':
        return stem + oSound + 'う';
      case 'ba-conditional':
        return stem + eSound + 'ば';
    }
  }

  // る-verb (ichidan)
  if (type === 'ru') {
    const stem = getUVerbStem(hiragana);

    const specialHandling = {
      'いる': {
        'potential': 'いられる',
      },
    };

    if (specialHandling[hiragana] && specialHandling[hiragana][form]) {
      return specialHandling[hiragana][form];
    }

    switch (form) {
      case 'te-form':
        return stem + 'て';
      case 'nai-form':
        return stem + 'ない';
      case 'ta-form':
        return stem + 'た';
      case 'passive':
        return stem + 'られる';
      case 'causative':
        return stem + 'させる';
      case 'causative-passive':
        return stem + 'させられる';
      case 'potential':
        return stem + 'られる';
      case 'volitional':
        return stem + 'よう';
      case 'ba-conditional':
        return stem + 'れば';
    }
  }

  return '';
}

// ======================
// SEEDED RANDOM
// ======================

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffle(arr, seed) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom(arr, seed, count = 1) {
  const shuffled = shuffle(arr, seed);
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
}

// ======================
// QUIZ GENERATION
// ======================

function generateConjugationSection(dateStr, seed) {
  const selectedVerbs = pickRandom(ALL_VERBS, seed, 5);
  const selectedForms = pickRandom(CONJUGATION_FORMS, seed + 1, 4);
  const questions = [];

  let questionId = 1;
  for (const verb of selectedVerbs) {
    for (const form of selectedForms) {
      if (questions.length >= 15) break;
      const answer = conjugateVerb(verb.hiragana, verb.type, form);
      questions.push({
        id: `conj-${questionId}`,
        verbKanji: verb.kanji,
        verbReading: verb.hiragana,
        form: form,
        answer: answer,
      });
      questionId++;
    }
    if (questions.length >= 15) break;
  }

  return questions.slice(0, 15);
}

function generateVocabSection(dateStr, seed) {
  const selectedVocab = shuffle(VOCABULARY, seed);
  const questions = [];
  let jpToEn = true;

  for (let i = 0; i < 12; i++) {
    const vocab = selectedVocab[i % selectedVocab.length];
    if (jpToEn) {
      const distractors = shuffle(VOCABULARY, seed + i * 10)
        .filter(v => v.english !== vocab.english)
        .slice(0, 3);
      questions.push({
        id: `vocab-${i + 1}`,
        type: 'jp-to-en',
        jp: vocab.jp,
        reading: vocab.reading,
        correct: vocab.english,
        options: shuffle([vocab.english, ...distractors.map(v => v.english)], seed + i * 20),
      });
    } else {
      questions.push({
        id: `vocab-${i + 1}`,
        type: 'en-to-jp',
        english: vocab.english,
        correct: vocab.reading,
      });
    }
    jpToEn = !jpToEn;
  }

  return questions.slice(0, 12);
}

function generateGrammarSection(dateStr, seed) {
  const selected = pickRandom(GRAMMAR_POINTS, seed, 1);
  return selected;
}

function generateTranslationSection(dateStr, seed) {
  const sentences = [
    { en: 'I eat sushi every day.', jp: '毎日すしを食べます。' },
    { en: 'She reads books in the morning.', jp: '彼女は朝本を読みます。' },
    { en: 'He went to Tokyo yesterday.', jp: '彼は昨日東京に行きました。' },
    { en: 'I will learn Japanese tomorrow.', jp: '明日日本語を習います。' },
    { en: 'The school is very big.', jp: '学校はとても大きいです。' },
  ];

  const selected = shuffle(sentences, seed).slice(0, 3);
  return selected.map((s, i) => ({
    id: `trans-${i + 1}`,
    english: s.en,
    modelAnswer: s.jp,
  }));
}

// ======================
// HTML GENERATION
// ======================

function generateHTML(dateStr, conjugation, vocab, grammar, translation) {
  const grammarArray = Array.isArray(grammar) ? grammar : [grammar];
  const selectedGrammar = grammarArray[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Japanese Quiz - ${dateStr}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8f9fa;
      color: #333;
      padding: 20px;
      line-height: 1.6;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 30px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #667eea;
      padding-bottom: 20px;
    }

    .header h1 {
      font-size: 28px;
      color: #667eea;
      margin-bottom: 10px;
    }

    .date-display {
      color: #666;
      font-size: 14px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      margin: 20px 0;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #64b5f6);
      width: 0%;
      transition: width 0.3s ease;
    }

    .section {
      margin: 20px 0;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .section-header {
      background: #f5f5f5;
      padding: 15px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
      transition: background 0.2s;
    }

    .section-header:hover {
      background: #eeeeee;
    }

    .section-header.active {
      background: #667eea;
      color: white;
    }

    .section-content {
      display: none;
      padding: 20px;
    }

    .section-content.active {
      display: block;
    }

    .section-score {
      font-size: 12px;
      background: #e8f5e9;
      color: #2e7d32;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .section-score.incomplete {
      background: #fff3e0;
      color: #e65100;
    }

    .question {
      margin: 20px 0;
      padding: 15px;
      background: #f9f9f9;
      border-left: 4px solid #667eea;
      border-radius: 4px;
    }

    .question-label {
      font-weight: 600;
      color: #667eea;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .verb-display {
      font-size: 24px;
      color: #333;
      margin: 10px 0;
      font-weight: 600;
    }

    .furigana {
      font-size: 12px;
      color: #666;
    }

    .conjugation-form-label {
      font-size: 14px;
      color: #666;
      margin: 10px 0;
      padding: 8px;
      background: #e3f2fd;
      border-radius: 4px;
      border-left: 3px solid #667eea;
    }

    input[type="text"] {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      font-family: inherit;
    }

    input[type="text"]:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .feedback {
      margin-top: 10px;
      padding: 10px;
      border-radius: 4px;
      font-size: 14px;
      display: none;
    }

    .feedback.correct {
      background: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #4caf50;
      display: block;
    }

    .feedback.incorrect {
      background: #ffebee;
      color: #c62828;
      border-left: 4px solid #f44336;
      display: block;
    }

    .answer-display {
      margin-top: 8px;
      font-weight: 600;
      color: #333;
    }

    .multiple-choice {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 10px 0;
    }

    .choice-btn {
      padding: 12px;
      border: 2px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .choice-btn:hover {
      border-color: #667eea;
      background: #f5f7ff;
    }

    .choice-btn.selected {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .choice-btn.correct {
      background: #4caf50;
      color: white;
      border-color: #4caf50;
    }

    .choice-btn.incorrect {
      background: #f44336;
      color: white;
      border-color: #f44336;
    }

    .example-sentence {
      margin: 10px 0;
      padding: 10px;
      background: #e3f2fd;
      border-left: 3px solid #667eea;
      border-radius: 4px;
      font-size: 14px;
    }

    .example-jp {
      font-weight: 600;
      color: #333;
    }

    .example-en {
      color: #666;
      font-style: italic;
      margin-top: 5px;
    }

    .hint-toggle {
      font-size: 12px;
      color: #667eea;
      cursor: pointer;
      margin-top: 8px;
      text-decoration: underline;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #64b5f6 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }

    .summary-card h2 {
      font-size: 20px;
      margin-bottom: 15px;
    }

    .score-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;
      margin: 15px 0;
    }

    .score-item {
      background: rgba(255,255,255,0.2);
      padding: 10px;
      border-radius: 4px;
    }

    .score-label {
      font-size: 12px;
      opacity: 0.9;
    }

    .score-value {
      font-size: 24px;
      font-weight: 700;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      justify-content: center;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .toggle-icon {
      font-size: 18px;
      transition: transform 0.2s;
    }

    .section-header.active .toggle-icon {
      transform: rotate(180deg);
    }

    .grammar-pattern {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px;
      border-radius: 4px;
      margin: 10px 0;
      font-weight: 600;
      color: #856404;
    }

    .ruby {
      font-size: 0.7em;
      color: #666;
    }

    @media (max-width: 600px) {
      .container {
        padding: 15px;
      }

      .header h1 {
        font-size: 22px;
      }

      .score-grid {
        grid-template-columns: 1fr 1fr;
      }

      .multiple-choice {
        grid-template-columns: 1fr;
      }

      .button-group {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>日本語クイズ</h1>
      <p class="date-display">Daily Quiz for ${dateStr}</p>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" id="progressBar"></div>
    </div>

    <!-- Section 1: Verb Conjugation -->
    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">
        <div>
          <span>Section 1: Verb Conjugation Drill (15 Questions)</span>
          <span class="section-score incomplete" id="score-conj">0%</span>
        </div>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="section-content" id="conj-section">
        <div id="conj-questions"></div>
        <button class="btn btn-primary" onclick="checkConjugation()">Check Answers</button>
      </div>
    </div>

    <!-- Section 2: Vocabulary -->
    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">
        <div>
          <span>Section 2: Vocabulary Quiz (12 Questions)</span>
          <span class="section-score incomplete" id="score-vocab">0%</span>
        </div>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="section-content" id="vocab-section">
        <div id="vocab-questions"></div>
        <button class="btn btn-primary" onclick="checkVocab()">Check Answers</button>
      </div>
    </div>

    <!-- Section 3: Grammar -->
    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">
        <div>
          <span>Section 3: Grammar Review</span>
          <span class="section-score incomplete" id="score-grammar">0%</span>
        </div>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="section-content" id="grammar-section"></div>
    </div>

    <!-- Section 4: Translation -->
    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">
        <div>
          <span>Section 4: Sentence Translation (3 Sentences)</span>
          <span class="section-score incomplete" id="score-trans">0%</span>
        </div>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="section-content" id="trans-section">
        <div id="trans-questions"></div>
        <button class="btn btn-primary" onclick="checkTranslation()">Check Answers</button>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-card" id="summary-card" style="display:none;">
      <h2>Daily Summary</h2>
      <div class="score-grid">
        <div class="score-item">
          <div class="score-label">Conjugation</div>
          <div class="score-value" id="final-conj">-</div>
        </div>
        <div class="score-item">
          <div class="score-label">Vocabulary</div>
          <div class="score-value" id="final-vocab">-</div>
        </div>
        <div class="score-item">
          <div class="score-label">Grammar</div>
          <div class="score-value" id="final-grammar">-</div>
        </div>
        <div class="score-item">
          <div class="score-label">Total</div>
          <div class="score-value" id="final-total">-</div>
        </div>
      </div>
      <div class="button-group">
        <button class="btn btn-primary" onclick="shareScore()">Share Score 📤</button>
        <button class="btn btn-secondary" onclick="resetQuiz()">Start Over</button>
      </div>
    </div>
  </div>

  <script>
    const quizData = {
      date: '${dateStr}',
      conjugation: ${JSON.stringify(conjugation)},
      vocab: ${JSON.stringify(vocab)},
      grammar: ${JSON.stringify(selectedGrammar)},
      translation: ${JSON.stringify(translation)},
      scores: {
        conjugation: 0,
        vocab: 0,
        grammar: 0,
        translation: 0,
      },
      answered: {
        conjugation: {},
        vocab: {},
        grammar: {},
        translation: {},
      }
    };

    function normalizeHiragana(str) {
      return str.toLowerCase().trim();
    }

    function toggleSection(header) {
      const isActive = header.classList.contains('active');
      document.querySelectorAll('.section-header').forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.classList.remove('active');
      });
      if (!isActive) {
        header.classList.add('active');
        header.nextElementSibling.classList.add('active');
      }
    }

    function initConjugation() {
      const container = document.getElementById('conj-questions');
      let html = '';
      quizData.conjugation.forEach(q => {
        html += \`
          <div class="question">
            <div class="question-label">Question \${q.id.split('-')[1]}</div>
            <div class="verb-display">
              <ruby><rb>\${q.verbKanji}</rb><rp>(</rp><rt>\${q.verbReading}</rt><rp>)</rp></ruby>
            </div>
            <div class="conjugation-form-label">
              Conjugation: \${q.form}
            </div>
            <input type="text" id="\${q.id}" placeholder="Type answer in hiragana" autocomplete="off">
            <div class="feedback" id="feedback-\${q.id}"></div>
          </div>
        \`;
      });
      container.innerHTML = html;
    }

    function checkConjugation() {
      let correct = 0;
      quizData.conjugation.forEach(q => {
        const input = document.getElementById(q.id);
        const userAnswer = normalizeHiragana(input.value);
        const isCorrect = userAnswer === normalizeHiragana(q.answer);
        const feedback = document.getElementById('feedback-' + q.id);

        if (isCorrect) {
          feedback.classList.add('correct');
          feedback.classList.remove('incorrect');
          feedback.textContent = '✓ Correct!';
          correct++;
        } else {
          feedback.classList.add('incorrect');
          feedback.classList.remove('correct');
          feedback.innerHTML = '✗ Incorrect<div class="answer-display">Correct answer: ' + q.answer + '</div>';
        }
      });

      quizData.scores.conjugation = Math.round((correct / quizData.conjugation.length) * 100);
      updateScore('conj', quizData.scores.conjugation);
      updateProgress();
    }

    function initVocab() {
      const container = document.getElementById('vocab-questions');
      let html = '';
      quizData.vocab.forEach((q, idx) => {
        if (q.type === 'jp-to-en') {
          html += \`
            <div class="question">
              <div class="question-label">Question \${idx + 1}</div>
              <div style="font-size: 20px; margin: 10px 0;">
                <ruby><rb>\${q.jp}</rb><rp>(</rp><rt>\${q.reading}</rt><rp>)</rp></ruby>
              </div>
              <div style="margin: 10px 0;">What does this mean in English?</div>
              <div class="multiple-choice" id="vocab-\${idx}">
                \${q.options.map((opt, i) => \`
                  <button class="choice-btn" onclick="selectChoice(\${idx}, \${i}, '\${opt}')">
                    \${opt}
                  </button>
                \`).join('')}
              </div>
              <div class="feedback" id="feedback-vocab-\${idx}"></div>
            </div>
          \`;
        } else {
          html += \`
            <div class="question">
              <div class="question-label">Question \${idx + 1}</div>
              <div style="font-size: 18px; margin: 10px 0; color: #555;">
                \${q.english}
              </div>
              <div style="margin: 10px 0;">Type the word in hiragana</div>
              <input type="text" id="vocab-input-\${idx}" placeholder="Type answer" autocomplete="off">
              <div class="feedback" id="feedback-vocab-\${idx}"></div>
            </div>
          \`;
        }
      });
      container.innerHTML = html;
    }

    function selectChoice(idx, optionIdx, answer) {
      const buttons = document.querySelectorAll('#vocab-' + idx + ' .choice-btn');
      buttons.forEach(btn => btn.classList.remove('selected', 'correct', 'incorrect'));
      quizData.answered.vocab[idx] = answer;
    }

    function checkVocab() {
      let correct = 0;
      quizData.vocab.forEach((q, idx) => {
        const feedback = document.getElementById('feedback-vocab-' + idx);

        if (q.type === 'jp-to-en') {
          const selected = quizData.answered.vocab[idx];
          const isCorrect = selected === q.correct;
          const buttons = document.querySelectorAll('#vocab-' + idx + ' .choice-btn');
          buttons.forEach(btn => {
            if (btn.textContent.trim() === selected) btn.classList.add('selected');
            if (btn.textContent.trim() === q.correct) {
              btn.classList.add('correct');
              isCorrect ? null : (correct += 0);
            }
          });

          if (isCorrect) {
            feedback.classList.add('correct');
            feedback.textContent = '✓ Correct!';
            correct++;
          } else {
            feedback.classList.add('incorrect');
            feedback.textContent = '✗ Incorrect. The answer is: ' + q.correct;
          }
        } else {
          const input = document.getElementById('vocab-input-' + idx);
          const userAnswer = normalizeHiragana(input.value);
          const isCorrect = userAnswer === normalizeHiragana(q.correct);

          if (isCorrect) {
            feedback.classList.add('correct');
            feedback.textContent = '✓ Correct!';
            correct++;
          } else {
            feedback.classList.add('incorrect');
            feedback.innerHTML = '✗ Incorrect<div class="answer-display">Correct answer: ' + q.correct + '</div>';
          }
        }
      });

      quizData.scores.vocab = Math.round((correct / quizData.vocab.length) * 100);
      updateScore('vocab', quizData.scores.vocab);
      updateProgress();
    }

    function initGrammar() {
      const container = document.getElementById('grammar-section');
      const g = quizData.grammar;
      let html = \`
        <div class="grammar-pattern">\${g.pattern}</div>
        <h3 style="margin-top: 20px; color: #333;">\${g.name}</h3>
      \`;

      html += '<h4 style="margin: 15px 0 10px 0; color: #667eea;">Examples:</h4>';
      g.examples.forEach(ex => {
        html += \`
          <div class="example-sentence">
            <div class="example-jp">\${ex.jp}</div>
            <div class="example-en">→ \${ex.en}</div>
          </div>
        \`;
      });

      html += '<h4 style="margin: 15px 0 10px 0; color: #667eea;">Practice:</h4>';
      g.exercises.slice(0, 2).forEach((ex, i) => {
        html += \`
          <div class="question">
            <div class="question-label">Exercise \${i + 1}</div>
            <div style="font-size: 16px; margin: 10px 0;">
              \${ex.jp}
            </div>
            <input type="text" id="grammar-\${i}" placeholder="Fill in the blank" autocomplete="off">
            <div class="feedback" id="feedback-grammar-\${i}"></div>
          </div>
        \`;
      });

      html += '<button class="btn btn-primary" onclick="checkGrammar()" style="margin-top: 20px;">Check Answers</button>';
      container.innerHTML = html;
    }

    function checkGrammar() {
      let correct = 0;
      const exerciseCount = quizData.grammar.exercises.slice(0, 2).length;
      quizData.grammar.exercises.slice(0, 2).forEach((ex, i) => {
        const input = document.getElementById('grammar-' + i);
        const userAnswer = normalizeHiragana(input.value);
        const isCorrect = userAnswer === normalizeHiragana(ex.answer);
        const feedback = document.getElementById('feedback-grammar-' + i);

        if (isCorrect) {
          feedback.classList.add('correct');
          feedback.textContent = '✓ Correct!';
          correct++;
        } else {
          feedback.classList.add('incorrect');
          feedback.textContent = '✗ Incorrect. Answer: ' + ex.answer;
        }
      });

      quizData.scores.grammar = Math.round((correct / exerciseCount) * 100);
      updateScore('grammar', quizData.scores.grammar);
      updateProgress();
    }

    function initTranslation() {
      const container = document.getElementById('trans-questions');
      let html = '';
      quizData.translation.forEach((q, idx) => {
        html += \`
          <div class="question">
            <div class="question-label">Sentence \${idx + 1}</div>
            <div style="font-size: 18px; margin: 10px 0; padding: 10px; background: #e3f2fd; border-radius: 4px;">
              \${q.english}
            </div>
            <input type="text" id="trans-\${idx}" placeholder="Type Japanese translation" autocomplete="off">
            <div class="feedback" id="feedback-trans-\${idx}"></div>
            <div style="margin-top: 10px; padding: 10px; background: #f9f9f9; border-radius: 4px; display:none;" id="model-trans-\${idx}">
              <div style="font-size: 12px; color: #666;">Model answer:</div>
              <div style="font-size: 16px; color: #333; font-weight: 600;">\${q.modelAnswer}</div>
            </div>
          </div>
        \`;
      });
      html += '<button class="btn btn-primary" onclick="checkTranslation()" style="margin-top: 20px;">Check Answers</button>';
      container.innerHTML = html;
    }

    function checkTranslation() {
      let correct = 0;
      // For translation, we show the model answer and let users self-grade
      // This is a simplified version - full grading would need more sophisticated NLP
      quizData.translation.forEach((q, idx) => {
        const input = document.getElementById('trans-' + idx);
        if (input.value.trim().length > 0) {
          document.getElementById('model-trans-' + idx).style.display = 'block';
          const feedback = document.getElementById('feedback-trans-' + idx);
          feedback.classList.add('correct');
          feedback.textContent = '✓ Submitted - Compare with model answer above';
          correct++;
        }
      });

      quizData.scores.translation = Math.round((correct / quizData.translation.length) * 100);
      updateScore('trans', quizData.scores.translation);
      updateProgress();
    }

    function updateScore(section, percentage) {
      const scoreEl = document.getElementById('score-' + section);
      scoreEl.textContent = percentage + '%';
      scoreEl.classList.remove('incomplete');
    }

    function updateProgress() {
      const total = Object.values(quizData.scores).reduce((a, b) => a + b, 0);
      const avgScore = Math.round(total / 4);
      const progressBar = document.getElementById('progressBar');
      progressBar.style.width = avgScore + '%';

      if (quizData.scores.conjugation > 0 && quizData.scores.vocab > 0 && quizData.scores.grammar > 0 && quizData.scores.translation > 0) {
        showSummary();
      }
    }

    function showSummary() {
      document.getElementById('summary-card').style.display = 'block';
      document.getElementById('final-conj').textContent = quizData.scores.conjugation + '%';
      document.getElementById('final-vocab').textContent = quizData.scores.vocab + '%';
      document.getElementById('final-grammar').textContent = quizData.scores.grammar + '%';
      const total = Math.round((quizData.scores.conjugation + quizData.scores.vocab + quizData.scores.grammar + quizData.scores.translation) / 4);
      document.getElementById('final-total').textContent = total + '%';
      saveToLocalStorage(total);
    }

    function saveToLocalStorage(total) {
      let data = JSON.parse(localStorage.getItem('nihongo_quiz_data') || '{}');
      data['${dateStr}'] = {
        conjugation: quizData.scores.conjugation,
        vocab: quizData.scores.vocab,
        grammar: quizData.scores.grammar,
        translation: quizData.scores.translation,
        total: total,
      };
      localStorage.setItem('nihongo_quiz_data', JSON.stringify(data));

      // Update streak
      const today = new Date('${dateStr}').toISOString().split('T')[0];
      let streak = JSON.parse(localStorage.getItem('nihongo_streak') || '{"current": 0, "lastDate": null}');
      if (streak.lastDate === today) {
        // Already completed today
      } else {
        const lastDate = streak.lastDate ? new Date(streak.lastDate) : null;
        const todayDate = new Date(today);
        if (lastDate && (todayDate - lastDate) / (1000 * 60 * 60 * 24) === 1) {
          streak.current++;
        } else if (!lastDate) {
          streak.current = 1;
        } else {
          streak.current = 1;
        }
        streak.lastDate = today;
      }
      localStorage.setItem('nihongo_streak', JSON.stringify(streak));
    }

    function shareScore() {
      const total = Math.round((quizData.scores.conjugation + quizData.scores.vocab + quizData.scores.grammar + quizData.scores.translation) / 4);
      const message = encodeURIComponent(\`My Japanese Quiz Score for \${quizData.date}: \${total}% 🎌\`);
      // For Telegram or other sharing
      window.open('tg://msg?text=' + message);
    }

    function resetQuiz() {
      location.reload();
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
      initConjugation();
      initVocab();
      initGrammar();
      initTranslation();
      // Open first section by default
      document.querySelector('.section-header').click();
    });
  </script>
</body>
</html>`;
}

// ======================
// MAIN SCRIPT
// ======================

function main() {
  const today = new Date();
  // Use local date components to avoid UTC offset issues
  const dateStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  // Output relative to script directory (repo root)
  const repoRoot = __dirname;
  const practiceDir = path.join(repoRoot, 'practice');
  const outputPath = path.join(practiceDir, `${dateStr}.html`);

  // Check if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`Quiz for ${dateStr} already exists at ${outputPath}`);
    process.exit(0);
  }

  // Ensure practice directory exists
  if (!fs.existsSync(practiceDir)) {
    fs.mkdirSync(practiceDir, { recursive: true });
  }

  // Use date as seed for deterministic randomness
  const seed = parseInt(dateStr.replace(/-/g, ''));

  // Generate quiz sections
  const conjugation = generateConjugationSection(dateStr, seed);
  const vocab = generateVocabSection(dateStr, seed);
  const grammar = generateGrammarSection(dateStr, seed);
  const translation = generateTranslationSection(dateStr, seed);

  // Generate HTML
  const html = generateHTML(dateStr, conjugation, vocab, grammar, translation);

  // Write to file
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Quiz generated successfully: ${outputPath}`);
}

main();
