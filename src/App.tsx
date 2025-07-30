import { useEffect, useRef, useState } from "react";
import { fakeData } from "./fake-data";
import type { Fruit } from "./types";
import "./index.css";

const PAGE_SIZE = 3;
const FALLBACK_IMG = "fallback.png";

function App() {
  const [items, setItems] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLLIElement | null>(null);

  const hasMore = items.length < fakeData.length;

  // 載入下一批
  const loadNext = async () => {
    // 設為 async 函式
    if (loading || !hasMore) return;
    setLoading(true);

    // 模擬非同步資料取得
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 模擬網路延遲

    setItems((prev) => {
      const next = fakeData.slice(prev.length, prev.length + PAGE_SIZE);
      return [...prev, ...next];
    });

    setLoading(false);
  };

  // 初次載入3筆
  useEffect(() => {
    loadNext();
  }, []);

  // 監看最後一筆
  useEffect(() => {
    if (!sentinelRef.current) return;

    // 建立新 observer 前先清舊的
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadNext(),
      { rootMargin: "0px 0px 200px 0px", threshold: 0 } // 提前200px就開始載入，減少使用者等待，也可以拿掉
    );

    observerRef.current.observe(sentinelRef.current);

    // 清理
    return () => observerRef.current?.disconnect();
  }, [items, loading, hasMore]); // 當items或loading或hasMore有變化時就重新執行

  return (
    <main className="mx-auto max-w-3xl p-4">
      <ul className="flex flex-col gap-10">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={item.id}
              ref={isLast ? sentinelRef : null} // 最後一筆當sentinel
              className="border border-gray-300 rounded-xl p-4 flex flex-col items-center"
            >
              <img
                src={item.img}
                alt={item.text}
                loading="lazy"
                className="w-full h-60 object-cover rounded-lg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).onerror = null;
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                }}
              />
              <p className="mt-4 text-xl font-medium">{item.text}</p>
            </li>
          );
        })}
      </ul>

      {loading && <p className="mt-10 text-center">載入中…(模擬網路延遲1秒)</p>}
      {!hasMore && <p className="mt-10 text-center">已顯示全部資料</p>}
    </main>
  );
}

export default App;
