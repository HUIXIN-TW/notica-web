"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./map.module.css";

export default function MapPage() {
  const [jaVoice, setJaVoice] = useState(null);
  const [preflightPercent, setPreflightPercent] = useState(0);
  const [preflightTotal, setPreflightTotal] = useState(0);
  const [preflightRemaining, setPreflightRemaining] = useState(0);
  const preflightRef = useRef(null);
  const preflightStorageKey = "preflightChecklist";

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return undefined;
    }

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((voice) =>
        (voice.lang || "").toLowerCase().startsWith("ja"),
      );
      if (match) {
        setJaVoice(match);
      }
    };

    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
    };
  }, []);

  const speak = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const container = preflightRef.current;
    if (!container || typeof window === "undefined") {
      return undefined;
    }

    const inputs = Array.from(
      container.querySelectorAll('input[type="checkbox"]'),
    );
    const saved = JSON.parse(localStorage.getItem(preflightStorageKey) || "[]");

    inputs.forEach((input, index) => {
      input.checked = Boolean(saved[index]);
    });

    const updateProgress = () => {
      const total = inputs.length;
      const checked = inputs.filter((input) => input.checked).length;
      const percent = total ? Math.round((checked / total) * 100) : 0;
      setPreflightPercent(percent);
      setPreflightTotal(total);
      setPreflightRemaining(total - checked);
      localStorage.setItem(
        preflightStorageKey,
        JSON.stringify(inputs.map((input) => input.checked)),
      );
    };

    inputs.forEach((input) => input.addEventListener("change", updateProgress));
    updateProgress();

    return () => {
      inputs.forEach((input) =>
        input.removeEventListener("change", updateProgress),
      );
    };
  }, []);

  const resetPreflight = () => {
    const container = preflightRef.current;
    if (!container || typeof window === "undefined") {
      return;
    }
    const inputs = Array.from(
      container.querySelectorAll('input[type="checkbox"]'),
    );
    inputs.forEach((input) => {
      input.checked = false;
    });
    setPreflightPercent(0);
    setPreflightRemaining(inputs.length);
    setPreflightTotal(inputs.length);
    localStorage.setItem(
      preflightStorageKey,
      JSON.stringify(inputs.map(() => false)),
    );
  };

  const sharePreflight = async () => {
    const total = preflightTotal || 0;
    const remaining = preflightRemaining || 0;
    const container = preflightRef.current;
    const unchecked = container
      ? Array.from(
          container.querySelectorAll('input[type="checkbox"]:not(:checked)'),
        )
          .map((input) => {
            const label = input.closest("label");
            const textNode = label?.querySelector("span");
            return textNode?.textContent?.trim() || "";
          })
          .filter(Boolean)
      : [];
    const remainingText = unchecked.length
      ? `未勾項目：${unchecked.join("、")}`
      : "未勾項目：無";
    const message = `出飯店前檢查完成 ${preflightPercent}%（已勾 ${total - remaining}/${total}），還有 ${remaining} 項未勾。${remainingText}。準備出發！`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: message });
        return;
      } catch {
        return;
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(message);
    }
  };

  return (
    <div className={styles.mapPage}>
      <section className={styles.itinerary}>
        <h2 className={styles.sectionTitle}>日本行程總覽</h2>

        <details className={styles.day}>
          <summary className={styles.dayTitle}>
            Day 1｜大阪（抵達＋難波・心齋橋・通天閣）
          </summary>

          <h4 className={styles.blockTitle}>✈️ 抵達</h4>
          <ul className={styles.list}>
            <li>07:05–10:55 飛行：高雄 → 關西國際機場（KIX）</li>
          </ul>

          <h4 className={styles.blockTitle}>🧾 購票＋ICOCA</h4>
          <ul className={styles.list}>
            <li>10:55–11:30</li>
            <li>買：南海電鐵車票（信用卡）／ICOCA 儲值 ¥3,500</li>
            <li>
              步行：機場入境區 → 南海電鐵售票／閘口（約 5–10 分，依航廈位置）
            </li>
          </ul>

          <h4 className={styles.blockTitle}>🚆 機場 → 難波（信用卡買票）</h4>
          <ul className={styles.list}>
            <li>11:30–12:20 南海電鐵 Nankai Railway</li>
            <li>關西機場站 → 難波站（約 45–55 分）</li>
            <li>12:20–12:35 步行：難波站 → 飯店（約 10–15 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>🧳 寄放行李／入住</h4>
          <ul className={styles.list}>
            <li>12:35–12:50 飯店寄放行李</li>
            <li>15:00 飯店 Check-in（若先寄放，15:00 再回來）</li>
          </ul>

          <h4 className={styles.blockTitle}>🍽 午餐（擇一，含步行時間）</h4>
          <ul className={styles.list}>
            <li>方案 A（步行）：㐂舌響 KITAN HIBIKI（約 10 分）</li>
            <li>方案 A（步行）：Wagyu Sukiyaki Okuwo（約 11 分）</li>
            <li>
              方案 B（搭車＋步行）：Naiwa Omeriasu（搭車約 10 分＋步行約 23 分）
            </li>
            <li>
              方案 B（搭車＋步行）：Usamitei Matsubaya（搭車約 13 分＋步行約 26
              分）
            </li>
          </ul>

          <h4 className={styles.blockTitle}>🛍 心齋橋・道頓堀逛街</h4>
          <ul className={styles.list}>
            <li>午餐後–16:00 區域內步行移動</li>
            <li>飯店 ↔ 心齋橋筋（約 10–20 分）</li>
            <li>心齋橋 ↔ 道頓堀（約 5–10 分）</li>
            <li>道頓堀 ↔ 固力果看板（多在同區，步行 5–10 分內）</li>
          </ul>

          <h4 className={styles.blockTitle}>🚇 前往通天閣</h4>
          <ul className={styles.list}>
            <li>16:20–16:50</li>
            <li>步行：飯店 → 難波站（約 5–15 分）</li>
            <li>大阪 Metro：難波 → 動物園前（約 15–20 分）</li>
            <li>步行：動物園前站 → 通天閣（約 8–12 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>🗼 通天閣・新世界</h4>
          <ul className={styles.list}>
            <li>17:00–18:30 通天閣觀景台＋新世界散步</li>
            <li>19:00 新世界晚餐（炸串）或回難波吃</li>
            <li>若回難波：動物園前 → 難波（約 15–20 分）</li>
            <li>步行：難波站 → 飯店（約 10–15 分）</li>
          </ul>
        </details>

        <details className={styles.day}>
          <summary className={styles.dayTitle}>
            Day 2｜京都（清水寺晨拜＋和服＋錦市場）
          </summary>

          <h4 className={styles.blockTitle}>🚆 大阪 → 京都（含步行）</h4>
          <ul className={styles.list}>
            <li>05:30–06:30</li>
            <li>步行：飯店 → 難波站（約 10–15 分）</li>
            <li>大阪 Metro 御堂筋線：難波 → 淀屋橋（約 8–10 分）</li>
            <li>步行：淀屋橋地鐵 → 京阪淀屋橋站（約 3–6 分）</li>
            <li>京阪電鐵：淀屋橋 → 祇園四条（約 45–55 分）</li>
            <li>步行：祇園四条站 → 公車站牌（約 2–5 分）</li>
            <li>京都市公車：祇園四条附近 → 清水寺周邊（約 10–20 分）</li>
            <li>步行：下車站牌 → 清水寺入口（約 8–15 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>⛩ 清水寺 → 八坂神社（步行）</h4>
          <ul className={styles.list}>
            <li>06:30–09:00</li>
            <li>清水寺 Kiyomizu-dera</li>
            <li>步行：清水寺 → 八坂神社（約 20–30 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>👘 岡本和服（含步行）</h4>
          <ul className={styles.list}>
            <li>09:00 岡本和服清水店</li>
            <li>11:00–12:30 步行拍照</li>
            <li>花見小路（5–15 分）</li>
            <li>白川南通（5–15 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>🍜 午餐（擇一，含步行）</h4>
          <ul className={styles.list}>
            <li>Ramen Nishiki（搭公車約 15 分＋步行 3–8 分）</li>
            <li>Menya Inoichi（步行約 5 分）</li>
            <li>GOKAGO（甜點店多為步行 5–15 分內）</li>
          </ul>

          <h4 className={styles.blockTitle}>👘 還和服</h4>
          <ul className={styles.list}>
            <li>14:30 前</li>
            <li>步行：拍照區 → 岡本和服店（約 10–25 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>🛍 錦市場・鴨川（含步行）</h4>
          <ul className={styles.list}>
            <li>下午</li>
            <li>步行：祇園／河原町 → 錦市場（約 15–25 分）</li>
            <li>步行：錦市場 → 鴨川（約 10–20 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>🚆 回大阪（含步行）</h4>
          <ul className={styles.list}>
            <li>15:50–18:00</li>
            <li>步行：錦市場 → 四条站（約 5–8 分）</li>
            <li>京都市營地鐵 烏丸線：四条 → 京都（約 3–5 分）</li>
            <li>步行：京都地鐵/JR 區 → 近鐵京都站（約 5–10 分）</li>
            <li>近鐵特急：京都 → 大阪難波（約 35–50 分）</li>
            <li>步行：大阪難波站 → 飯店（約 10–15 分）</li>
            <li>18:00 晚餐：道頓堀／黑門市場（步行 10–20 分）</li>
          </ul>
        </details>

        <details className={styles.day}>
          <summary className={styles.dayTitle}>
            Day 3｜大阪（咖啡＋大阪城＋商店街＋返程）
          </summary>

          <h4 className={styles.blockTitle}>☕ 飯店 → 咖啡店（含步行）</h4>
          <ul className={styles.list}>
            <li>07:15–08:30</li>
            <li>步行：飯店 → 難波站（約 10–15 分）</li>
            <li>大阪 Metro：難波 → 谷町四丁目（約 20–30 分，含轉乘）</li>
            <li>步行：谷町四丁目站 → SOT COFFEE ROASTER（約 10–20 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>🏯 咖啡店 → 大阪城（步行）</h4>
          <ul className={styles.list}>
            <li>08:30–11:30</li>
            <li>步行：咖啡店 → 大阪城公園（約 20 分）</li>
            <li>天守閣（預計 2 小時）</li>
            <li>御座船：建議 09:30 先去排/劃位</li>
            <li>園區內步行通常再加 30–60 分</li>
          </ul>

          <h4 className={styles.blockTitle}>
            🛍 大阪城 → 天神橋筋商店街（含步行）
          </h4>
          <ul className={styles.list}>
            <li>11:30–15:00</li>
            <li>大阪 Metro 約 35 分，目的地：扇町站</li>
            <li>步行：扇町站 → 天神橋筋商店街（約 3–8 分）</li>
            <li>午餐小吃、逛街</li>
          </ul>

          <h4 className={styles.blockTitle}>🧳 回飯店取行李（含步行）</h4>
          <ul className={styles.list}>
            <li>15:00</li>
            <li>大阪 Metro：扇町 → 難波（約 25–35 分）</li>
            <li>步行：難波站 → 飯店（約 10–15 分）</li>
          </ul>

          <h4 className={styles.blockTitle}>
            ✈️ 難波 → 關西機場（信用卡買票）
          </h4>
          <ul className={styles.list}>
            <li>15:40</li>
            <li>步行：飯店 → 南海難波站（約 5–15 分）</li>
            <li>南海電鐵：難波 → KIX（約 45–55 分）</li>
            <li>20:20–22:55 KIX → 高雄</li>
          </ul>
        </details>
      </section>
      <section className={styles.extras}>
        <details className={styles.card}>
          <summary className={styles.cardSummary}>出飯店前 10 秒清單</summary>
          <div className={styles.cardBody}>
            <div className={styles.preflight} ref={preflightRef}>
              <div className={styles.preflightProgress}>
                <div className={styles.preflightProgressHeader}>
                  <span>CHECKLIST BEFORE LEAVING</span>
                  <div className={styles.preflightProgressActions}>
                    <strong>{preflightPercent}%</strong>
                    <button
                      type="button"
                      className={styles.resetButton}
                      onClick={resetPreflight}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className={styles.shareButton}
                      onClick={sharePreflight}
                    >
                      Share
                    </button>
                  </div>
                </div>
                <div className={styles.preflightProgressBar}>
                  <span
                    className={styles.preflightProgressFill}
                    style={{ width: `${preflightPercent}%` }}
                  />
                </div>
              </div>
              <div className={styles.preflightSection}>
                <div className={styles.preflightHeader}>
                  <span className={styles.preflightIndex}>1</span>
                  <span className={styles.preflightTitle}>隨身重要物品</span>
                </div>
                <div className={styles.preflightList}>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>護照</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>錢包</span>
                    </label>
                    <div className={styles.preflightSublist}>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>日圓 JPY</span>
                        </label>
                      </div>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>信用卡</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>ICOCA / Suica（是否有餘額）</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>手機（確認電量 ≥ 50%）</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>行動電源 & 充電線</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>飯店房卡</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>攜帶垃圾袋（日本分類）</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.preflightSection}>
                <div className={styles.preflightHeader}>
                  <span className={styles.preflightIndex}>2</span>
                  <span className={styles.preflightTitle}>手機與網路</span>
                </div>
                <div className={styles.preflightList}>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>eSIM / 網路是否正常</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>Google Map 已下載離線地圖</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>行程、餐廳、車站地址可離線查看</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>LINE / WhatsApp 可收訊（緊急聯絡）</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.preflightSection}>
                <div className={styles.preflightHeader}>
                  <span className={styles.preflightIndex}>3</span>
                  <span className={styles.preflightTitle}>當天天氣對應</span>
                </div>
                <div className={styles.preflightList}>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>❄️ 冷</span>
                    </label>
                    <div className={styles.preflightSublist}>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>圍巾、手套</span>
                        </label>
                      </div>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>外套是否需要加一層</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>☀️ 晴</span>
                    </label>
                    <div className={styles.preflightSublist}>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>防曬</span>
                        </label>
                      </div>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>太陽眼鏡</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.preflightSection}>
                <div className={styles.preflightHeader}>
                  <span className={styles.preflightIndex}>4</span>
                  <span className={styles.preflightTitle}>行程檢查</span>
                </div>
                <div className={styles.preflightList}>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>今天第一站「怎麼去」</span>
                    </label>
                    <div className={styles.preflightSublist}>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>最近車站</span>
                        </label>
                      </div>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>要搭哪條線（JR / 私鐵 / 地鐵）</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>是否有「指定時間」行程</span>
                    </label>
                    <div className={styles.preflightSublist}>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>餐廳預約</span>
                        </label>
                      </div>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>車票（新幹線、特急）</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.preflightSection}>
                <div className={styles.preflightHeader}>
                  <span className={styles.preflightIndex}>5</span>
                  <span className={styles.preflightTitle}>錢與購物</span>
                </div>
                <div className={styles.preflightList}>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>今天是否要逛街？</span>
                    </label>
                    <div className={styles.preflightSublist}>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>帶可退稅的護照或QR Code</span>
                        </label>
                      </div>
                      <div className={styles.preflightRow}>
                        <label className={styles.checkItem}>
                          <input type="checkbox" />
                          <span>帶購物用大袋 / 折疊袋</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>現金是否夠（便利商店不是每家都能刷卡）</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.preflightSection}>
                <div className={styles.preflightHeader}>
                  <span className={styles.preflightIndex}>6</span>
                  <span className={styles.preflightTitle}>安全與細節</span>
                </div>
                <div className={styles.preflightList}>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>房間電器是否關好（暖氣、吹風機）</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>窗戶是否關</span>
                    </label>
                  </div>
                  <div className={styles.preflightRow}>
                    <label className={styles.checkItem}>
                      <input type="checkbox" />
                      <span>貴重物品是否已收好（或放保險箱）</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>

        <details className={styles.card}>
          <summary className={styles.cardSummary}>旅途中常用日文</summary>
          <div className={styles.cardBody}>
            <ol className={styles.sentenceList}>
              <li>
                <span className={styles.jp}>すみません、駅はどこですか。</span>
                <span className={styles.romaji}>
                  Sumimasen, eki wa doko desu ka.
                </span>
                <span className={styles.zh}>不好意思，車站在哪裡？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("すみません、駅はどこですか。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>この電車は大阪に行きますか。</span>
                <span className={styles.romaji}>
                  Kono densha wa Osaka ni ikimasu ka.
                </span>
                <span className={styles.zh}>這班電車會到大阪嗎？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("この電車は大阪に行きますか。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>切符を二枚ください。</span>
                <span className={styles.romaji}>Kippu o nimai kudasai.</span>
                <span className={styles.zh}>請給我兩張票。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("切符を二枚ください。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>おすすめの料理は何ですか。</span>
                <span className={styles.romaji}>
                  Osusume no ryori wa nan desu ka.
                </span>
                <span className={styles.zh}>推薦的料理是什麼？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("おすすめの料理は何ですか。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>お会計をお願いします。</span>
                <span className={styles.romaji}>Okaikei o onegaishimasu.</span>
                <span className={styles.zh}>請結帳。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("お会計をお願いします。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>
                  クレジットカードは使えますか。
                </span>
                <span className={styles.romaji}>
                  Kurejitto kado wa tsukaemasu ka.
                </span>
                <span className={styles.zh}>可以使用信用卡嗎？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("クレジットカードは使えますか。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>写真を撮ってもらえますか。</span>
                <span className={styles.romaji}>
                  Shashin o totte moraemasu ka.
                </span>
                <span className={styles.zh}>可以幫我拍照嗎？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("写真を撮ってもらえますか。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>トイレはどこですか。</span>
                <span className={styles.romaji}>Toire wa doko desu ka.</span>
                <span className={styles.zh}>廁所在哪裡？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("トイレはどこですか。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>これはいくらですか。</span>
                <span className={styles.romaji}>Kore wa ikura desu ka.</span>
                <span className={styles.zh}>這個多少錢？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("これはいくらですか。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>いらっしゃいませ。</span>
                <span className={styles.romaji}>Irasshaimase.</span>
                <span className={styles.zh}>歡迎光臨。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("いらっしゃいませ。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>こんにちは。</span>
                <span className={styles.romaji}>Konnichiwa.</span>
                <span className={styles.zh}>你好（白天）。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("こんにちは。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>こんばんは。</span>
                <span className={styles.romaji}>Konbanwa.</span>
                <span className={styles.zh}>你好（晚上）。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("こんばんは。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>何名様ですか？</span>
                <span className={styles.romaji}>Nanmei sama desu ka?</span>
                <span className={styles.zh}>幾位？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("何名様ですか？")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>こちらでお召し上がりですか？</span>
                <span className={styles.romaji}>
                  Kochira de omeshiagari desu ka?
                </span>
                <span className={styles.zh}>內用嗎？</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("こちらでお召し上がりですか？")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>一人です。</span>
                <span className={styles.romaji}>Hitori desu.</span>
                <span className={styles.zh}>一人。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("一人です。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>二人です。</span>
                <span className={styles.romaji}>Futari desu.</span>
                <span className={styles.zh}>兩人。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("二人です。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>五人です。</span>
                <span className={styles.romaji}>Gonin desu.</span>
                <span className={styles.zh}>五人。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("五人です。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>はい。</span>
                <span className={styles.romaji}>Hai.</span>
                <span className={styles.zh}>是的。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("はい。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>いいえ。</span>
                <span className={styles.romaji}>Iie.</span>
                <span className={styles.zh}>不是。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("いいえ。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>お願いします。</span>
                <span className={styles.romaji}>Onegaishimasu.</span>
                <span className={styles.zh}>麻煩了／拜託。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("お願いします。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>ありがとうございます。</span>
                <span className={styles.romaji}>Arigatou gozaimasu.</span>
                <span className={styles.zh}>謝謝您。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("ありがとうございます。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>
                  こんにちは、二人です。お願いします。
                </span>
                <span className={styles.romaji}>
                  Konnichiwa, futari desu. Onegaishimasu.
                </span>
                <span className={styles.zh}>你好，我們兩位，麻煩了。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("こんにちは、二人です。お願いします。")}
                >
                  朗讀
                </button>
              </li>
              <li>
                <span className={styles.jp}>
                  道に迷いました、助けてください。
                </span>
                <span className={styles.romaji}>
                  Michi ni mayoimashita, tasukete kudasai.
                </span>
                <span className={styles.zh}>我迷路了，請幫幫我。</span>
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => speak("道に迷いました、助けてください。")}
                >
                  朗讀
                </button>
              </li>
            </ol>
          </div>
        </details>

        <details className={styles.card}>
          <summary className={styles.cardSummary}>飯店資訊卡</summary>
          <div className={styles.cardBody}>
            <ul className={styles.infoList}>
              <li>
                <span className={styles.infoLabel}>飯店名</span>
                <span className={styles.infoValue}>
                  GRIDS PREMIUM HOTEL OSAKA NAMBA
                </span>
              </li>
              <li>
                <span className={styles.infoLabel}>地址</span>
                <span className={styles.infoValue}>
                  大阪府大阪市浪速区難波中1丁目7-7
                </span>
              </li>
              <li>
                <span className={styles.infoLabel}>電話</span>
                <a className={styles.infoValue} href="tel:+81666350810">
                  +81 6-6635-0810
                </a>
              </li>
              <li>
                <span className={styles.infoLabel}>入住時間</span>
                <span className={styles.infoValue}>3pm</span>
              </li>
              <li>
                <span className={styles.infoLabel}>退房時間</span>
                <span className={styles.infoValue}>11am</span>
              </li>
            </ul>
          </div>
        </details>

        <details className={styles.card}>
          <summary className={styles.cardSummary}>當地緊急電話</summary>
          <div className={styles.cardBody}>
            <ul className={styles.infoList}>
              <li>
                <span className={styles.infoLabel}>警察</span>
                <a className={styles.infoValue} href="tel:110">
                  110
                </a>
              </li>
              <li>
                <span className={styles.infoLabel}>消防／救護車</span>
                <a className={styles.infoValue} href="tel:119">
                  119
                </a>
              </li>
              <li>
                <span className={styles.infoLabel}>海上保安廳</span>
                <a className={styles.infoValue} href="tel:118">
                  118
                </a>
              </li>
              <li>
                <span className={styles.infoLabel}>觀光諮詢（多語）</span>
                <div className={styles.infoActions}>
                  <a className={styles.infoValue} href="tel:05038162787">
                    050-3816-2787
                  </a>
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={() =>
                      navigator.clipboard.writeText("050-3816-2787")
                    }
                    aria-label="複製觀光諮詢電話"
                  >
                    複製
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </details>
      </section>
      <div className={styles.frameWrapper}>
        <iframe
          title="Notica map"
          className={styles.frame}
          src="https://www.google.com/maps/d/u/2/embed?mid=1I-jR7-sL_QXOJdqcB0a8Go19_VI2dsE&ehbc=2E312F"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
