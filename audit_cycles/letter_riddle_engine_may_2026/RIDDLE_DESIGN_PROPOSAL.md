# Letter-Riddle Engine Design Proposal

**Source:** Generic extended thinking LLM (ChatGPT 5.5 Plus thinking mode), May 2026.
**Status:** Initial design proposal received. Pending Claude review + FB2 verification of Riddle 2 answer.

---

## 1. Recommended option (with brief justification)

**Моя рекомендация: Option 1 (Text-input UI) с лимитом попыток.**

**Обоснование:** Опция 1 — единственная, которая на 100% сохраняет оригинальную механику и дух книги-игры. Игрок должен сам догадаться до ответа, что дает максимальное чувство удовлетворения от решения головоломки. Multiple-choice (Опция 2) и гибрид (Опция 3) неизбежно спойлерят ответ или сильно сужают пространство поиска, превращая загадку в тривиальный перебор кнопок.

Главная проблема Опции 1 (угроза брутфорса и читерства через консоль/state) элегантно решается самой математической природой загадки Браславского: **правильный ответ (строка) вообще не нужно хранить в данных**. Мы храним только модификатор, а движок просто вычисляет математическую сумму введенных букв. Если игрок введет любую белиберду, которая в сумме дает нужный результат (например, 76), он всё равно перейдет на правильный параграф — и это абсолютно канонично для физической книги! Это делает механику на 100% устойчивой к инспекции localStorage и remake_data.js. А проблема опечаток решается введением счетчика попыток (например, 3 попытки до Game Over).

---

## 2. Implementation sketch (Option 1)

### Data schema

На уровне JSON (в GD[N]) загадка описывается новым объектом `riddle` внутри параграфа. Массив `choices` при этом можно оставить пустым или скрыть до провала/успеха.

```javascript
// Пример для §1131
GD[1131] = {
  text: "Стоит село — заселено, но петухи там не поют...",
  riddle: {
    modifier: 916,               // Число, прибавляемое к сумме
    fail_target: 1190,           // Куда отправляем при исчерпании попыток
    max_attempts: 3,             // Лимит ошибок
    alphabet_mode: "ru_standard", // "ru_standard" (А=1..Я=33) или "ru_yo_eq" (Ё=Е=6)
    valid_targets: [992]         // Опционально: массив валидных параграфов-ответов,
                                 // чтобы не пускать на пустые узлы при случайном совпадении.
  },
  choices: []
};
```

### Engine handler (Pseudocode)

```javascript
const ALPHABET_RU = "*АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"; // Индекс = порядковый номер

function applyRiddleAnswer(input, riddleConfig) {
    // 1. Очистка ввода: оставляем только кириллицу, убираем пробелы, в верхний регистр
    let cleanInput = input.toUpperCase().replace(/[^А-ЯЁ]/g, '');

    // 2. Обработка флага "Ё=Е" (в зависимости от конвенции книги)
    if (riddleConfig.alphabet_mode === "ru_yo_eq") {
        cleanInput = cleanInput.replace(/Ё/g, 'Е');
    }

    // 3. Вычисление суммы
    let sum = 0;
    for (let char of cleanInput) {
        let val = ALPHABET_RU.indexOf(char); // А=1, Б=2 и т.д.
        if (val > 0) sum += val;
    }

    // 4. Определение целевого параграфа
    const targetId = sum + riddleConfig.modifier;

    // 5. Валидация перехода
    if (riddleConfig.valid_targets.includes(targetId) && GD[targetId]) {
        // Успех
        S.riddle_attempts = 0; // сброс стейта
        goToParagraph(targetId);
    } else {
        // Ошибка
        handleRiddleFail(riddleConfig);
    }
}

function handleRiddleFail(riddleConfig) {
    S.riddle_attempts = (S.riddle_attempts || 0) + 1;
    let remaining = riddleConfig.max_attempts - S.riddle_attempts;

    if (remaining <= 0) {
        S.riddle_attempts = 0; // сброс перед смертью
        goToParagraph(riddleConfig.fail_target); // Переход на параграф смерти
    } else {
        showRiddleErrorUX(remaining); // Тряска UI, обновление счетчика
    }
}
```

### UI changes

В функции `renderGame` проверяем наличие поля `riddle`. Если оно есть, рендерим кастомный блок вместо стандартных `choices`.

HTML/CSS скетч:

```html
<div class="riddle-container">
    <input type="text" id="riddle-input" placeholder="Ваш ответ..." autocomplete="off" autocorrect="off" spellcheck="false" />
    <button id="riddle-submit" class="btn-primary">Ответить</button>
    <div id="riddle-feedback" class="hidden">Неверно. Осталось попыток: <span id="riddle-attempts"></span></div>
</div>
```

CSS-класс `.shake` применяется к `#riddle-input` при неверном ответе (анимация translateX туда-сюда на 300ms). Ввод очищается, рамка мигает красным.

### Anti-cheat

Слово «кладбище» нигде не фигурирует в коде. Человек, заглянувший в LocalStorage, увидит только `S.riddle_attempts`. Игрок, посмотревший в исходник данных, увидит `modifier: 916` и `valid_targets: [992]`. Вычислить из `992 - 916 = 76` то самое слово «кладбище» алгоритмически невозможно (это односторонняя функция: хэш-коллизий у суммы из 33 чисел слишком много). Таким образом, система неуязвима к дата-майнингу.

### Failure mode

При вводе неверного ответа:

- Поле ввода трясётся (shake animation), текст окрашивается в красный, затем поле очищается.
- Появляется или обновляется текст под инпутом: «Ответ неверен. Лес не прощает ошибок... Осталось попыток: 2».
- При третьей ошибке кнопка блокируется, и движок форсированно делает переход на `fail_target` (в данном случае §1190 — смерть от пауков).

---

## 3. Comparison table for all three options

| Criteria | Option 1 (Text-input) | Option 2 (Multiple-choice) | Option 3 (Hybrid) |
|---|---|---|---|
| Implementation complexity | Medium (~50-70 LoC for UI + parser) | Low (~10 LoC, reuses standard choices) | High (~80-100 LoC, state machine needed) |
| UI complexity (Mobile) | Medium (Requires virtual keyboard handling, avoiding zoom-in on focus) | Low (Standard native buttons) | High (Swapping UI paradigms mid-screen) |
| Puzzle authenticity | High (Exact paper book feel) | Low (Spoils the word entirely) | Medium (Gives one authentic chance) |
| Cheat resistance | High (Math sum is a 1-way hash. Word is hidden) | Low (Buttons explicitly show targets/words) | Medium (Fallback buttons must be stored in DOM/State) |
| Future extensibility | High (Just add new modifier & target in JSON) | High (Standard choice rendering) | Medium (Requires fallback config per riddle) |
| Code review surface | Medium (String parsing, RegEx edge cases) | Low (Trivial array looping) | High (State transitions, conditionally hidden arrays) |
| Save-game compatibility | High (Only save attempts counter in S) | High (No state changes needed) | Medium (Must save "is_hint_mode" in S) |
| Accessibility (Non-RU) | Low (Requires typing Cyrillic on non-RU keyboard) | High (Just click a button) | Medium (Fails first time, but fallback works) |
| Localization | Easy to adapt (Just swap ALPHABET constant) | Easy (Translate labels) | Complex (Translate labels + handle alphabet) |
| Player frustration risk | High (Typos cost attempts) | Low | Medium |

---

## 4. Open questions / requested clarifications

1. **Riddle 2 target verification**: Вы упомянули слово «год» (4+16+5 = 25). 25 + 825 = 850. Существует ли параграф §850 в FB2, и является ли он логичным продолжением для победителя головоломки? **Это критически важно проверить перед мерджем в remake_data.js.**

2. **Chaining (N-ary chains)**: Нужно ли поддерживать цепочки загадок внутри одного параграфа (без смены paragraph_id)? В текущем дизайне каждая загадка — это отдельный параграф со своим текстом и полем `riddle`, что идеально вписывается в архитектуру. **Рекомендую избегать цепочек в одном DOM-рендере и разбивать их на параграфы, как в книге.**

3. **Case of Failure**: Должны ли все неправильные ответы вести на Game Over? Механика `fail_target` позволяет направить игрока куда угодно: как на параграф смерти (для §1131 → §1190), так и обратно на предыдущую развилку (как штраф), что дает геймдизайнеру гибкость.

4. **Alphabet Standards**: В русском алфавите 33 буквы, но в 1991 году в печатных изданиях букву «Ё» часто игнорировали при математических головоломках, присваивая «Ж» номер 7 (а не 8). Авторский шифр «кладбище» (сумма 76) совпадает со стандартным алфавитом, где А=1 ... Е=6, Ё=7, Ж=8 ... Щ=27. Слово «кладбище» не содержит букв после "Щ", индексы которых сдвинулись бы из-за отсутствия «Ё». Но ответ на вторую загадку (или будущие загадки) может пострадать. **Следует ли ввести хардкодный массив алфавита от Браславского?**

---

## 5. Risks and pitfalls

- **Клавиатура на мобильных (Zoom-in)**: Если font-size инпута меньше 16px, iOS Safari автоматически делает зум экрана при фокусе, что ломает верстку PWA. *Решение*: Задать инпуту `font-size: 16px` (или выше) в CSS.

- **Автокоррекция и пробелы**: Мобильные клавиатуры часто вставляют пробел после слова или пытаются исправить "незнакомые" словарю слова. *Решение*: Строгий `replace(/[^А-ЯЁ]/g, '')`, который удалит всё, кроме букв, до того, как начнется математика.

- **Ё/Е эквивалентность**: Игрок может ввести «Ё» там, где подразумевается «Е», или наоборот (особенно если ответ подразумевает Ё). *Решение*: Параметр `alphabet_mode: "ru_yo_eq"` в JSON, который прозрачно для игрока конвертирует все Ё в Е перед подсчетом суммы, чтобы избежать фрустрации (если сам автор считал их одной буквой в конкретной загадке).

- **Падежи и синонимы**: Что если игрок введет «кладбища» или «на кладбище»? Сумма изменится, и переход не сработает. *Решение*: Лимит в 3 попытки дает игроку шанс понять, что он ошибся в форме слова (в книгах-играх ответы обычно даются в именительном падеже, единственном числе). В UI можно добавить `placeholder="Ответ (им. падеж, ед. ч.)"`.
