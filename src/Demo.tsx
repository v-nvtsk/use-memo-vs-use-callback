import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import debounce from 'lodash/debounce';

let lodashCallsInUseCallback = 0;
let lodashCallsInUseMemo = 0;
let appRenders = 0;

export default function Demo() {
  appRenders++;
  const [memoValue, setMemoValue] = useState("");
  const [callbackValue, setCallbackValue] = useState("");
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
      </div>
    </>
  );
}
