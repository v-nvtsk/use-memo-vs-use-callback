import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import debounce from 'lodash/debounce';

let lodashCallsInUseCallback = 0;
let lodashCallsInUseMemo = 0;
let customDebounceCalls = 0;
let appRenders = 0;


// Собственная простая реализация функции debounce
function customDebounce<Args extends unknown[]>(func: (...args: Args) => void, wait: number) {
  customDebounceCalls++;
  console.warn(`[customDebounce] Функция инициализирована! Создан новый таймер.`, customDebounceCalls);
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  function debounced(...args: Args) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  }

  return debounced;
}

export default function Demo() {
  appRenders++;
  const [memoValue, setMemoValue] = useState("");
  const [callbackValue, setCallbackValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [, setDummy] = useState(0);

  // === ТЕСТ 1: useMemo ===
  const debouncedMemoFn = useMemo(() => {
    lodashCallsInUseMemo++;
    console.warn(`[useMemo] Вызван lodash.debounce! Создан новый таймер.`);
    return debounce((value: string) => {
      console.log(
        `%c[useMemo] СРАБОТАЛ ДЕБАУНС для значения: "${value}"`,
        "color: #00ff00; font-weight: bold;",
      );
    }, 500);
  }, []);

  // === ТЕСТ 2: useCallback ===
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCallbackFn = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    (() => {
      lodashCallsInUseCallback++;
      console.warn(
        `[useCallback] Вызван lodash.debounce! Создан новый таймер.`,
      );
      return debounce((value: string) => {
        console.log(
          `%c[useCallback] СРАБОТАЛ ДЕБАУНС для значения: "${value}"`,
          "color: #00ff00; font-weight: bold;",
        );
      }, 500);
    })(),
    [],
  );

  // === ТЕСТ 3: Собственная реализация debounce ===
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCustomFn = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    customDebounce((value: string) => {
        console.log(
          `%c[Custom] СРАБОТАЛ ДЕБАУНС для значения: "${value}"`,
          "color: #8b5cf6; font-weight: bold;",
        );
      }, 500),[]);

  const handleMemoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMemoValue(value);
    debouncedMemoFn(value);
  };

  const handleCallbackInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCallbackValue(value);
    debouncedCallbackFn(value);
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    debouncedCustomFn(value);
  };

  return (
    <>
      <h2>Тестируем дебаунс: useMemo vs useCallback</h2>
      <p className="description">
        Открой консоль (F12) и начни вводить текст в оба поля, чтобы увидеть
        разницу в поведении:
      </p>

      <div className="meta-info">
        <span>
          Рендеров компонента App:{" "}
          <strong className="renders-count">{appRenders}</strong>
        </span>
        <button
          onClick={() => setDummy((d) => d + 1)}
          className="re-render-btn"
        >
          Вызвать ререндер
        </button>
      </div>

      <div className="grid">
        {/* Блок useMemo */}
        <div className="card memo-card">
          <h3>Вариант 1: useMemo</h3>
          <p className="card-desc">
            Фабричная функция вызывается <strong>только один раз</strong> при
            старте. В консоли не создаются лишние таймеры при вводе.
          </p>
          <input
            type="text"
            value={memoValue}
            onChange={handleMemoInput}
            placeholder="Печатай сюда (useMemo)..."
          />
          <div className="card-stats">
            Инициализаций lodash.debounce:{" "}
            <span className="stat-value memo-val">
              {lodashCallsInUseMemo}
            </span>
          </div>
        </div>

        {/* Блок useCallback */}
        <div className="card callback-card">
          <h3>Вариант 2: useCallback</h3>
          <p className="card-desc">
            Аргумент <code>debounce(...)</code> вычисляется{" "}
            <strong>на каждый рендер</strong> (каждый символ)! В консоль будут
            сыпаться предупреждения.
          </p>
          <input
            type="text"
            value={callbackValue}
            onChange={handleCallbackInput}
            placeholder="Печатай сюда (useCallback)..."
          />
          <div className="card-stats">
            Инициализаций lodash.debounce:{" "}
            <span className="stat-value callback-val">
              {lodashCallsInUseCallback}
            </span>
          </div>
        </div>

        {/* Блок Собственный Debounce */}
        <div className="card custom-card">
          <h3>Вариант 3: Свой Debounce (useCallback)</h3>
          <p className="card-desc">
            Использует <strong>собственную реализацию</strong> дебаунса. Функция
            оборачивается в <code>useCallback</code> с IIFE, имитируя оригинальный lodash debounce.
          </p>
          <input
            type="text"
            value={customValue}
            onChange={handleCustomInput}
            placeholder="Печатай сюда (свой debounce)..."
          />
          <div className="card-stats">
            Инициализаций customDebounce:{" "}
            <span className="stat-value custom-val">
              {customDebounceCalls}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

