"use client";

import styles from "./map.module.css";

export default function MapPage() {
  return (
    <div className={styles.mapPage}>
      <section className={styles.itinerary}>
        <h2 className={styles.sectionTitle}>行程總覽</h2>

        <details className={styles.day} open>
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
          <summary className={styles.cardSummary}>出發前小清單</summary>
          <div className={styles.cardBody}>
            <div className={styles.checklist}>
              <label className={styles.checkItem}>
                <input type="checkbox" />
                <span>護照 Passport</span>
              </label>
              <label className={styles.checkItem}>
                <input type="checkbox" />
                <span>日圓 JPY</span>
              </label>
            </div>
          </div>
        </details>

        <details className={styles.card}>
          <summary className={styles.cardSummary}>旅途中常用日文</summary>
          <div className={styles.cardBody}>
            <ol className={styles.sentenceList}>
            <li>
              <span className={styles.jp}>すみません、駅はどこですか。</span>
              <span className={styles.zh}>不好意思，車站在哪裡？</span>
            </li>
            <li>
              <span className={styles.jp}>この電車は大阪に行きますか。</span>
              <span className={styles.zh}>這班電車會到大阪嗎？</span>
            </li>
            <li>
              <span className={styles.jp}>切符を二枚ください。</span>
              <span className={styles.zh}>請給我兩張票。</span>
            </li>
            <li>
              <span className={styles.jp}>おすすめの料理は何ですか。</span>
              <span className={styles.zh}>推薦的料理是什麼？</span>
            </li>
            <li>
              <span className={styles.jp}>お会計をお願いします。</span>
              <span className={styles.zh}>請結帳。</span>
            </li>
            <li>
              <span className={styles.jp}>クレジットカードは使えますか。</span>
              <span className={styles.zh}>可以使用信用卡嗎？</span>
            </li>
            <li>
              <span className={styles.jp}>写真を撮ってもらえますか。</span>
              <span className={styles.zh}>可以幫我拍照嗎？</span>
            </li>
            <li>
              <span className={styles.jp}>トイレはどこですか。</span>
              <span className={styles.zh}>廁所在哪裡？</span>
            </li>
            <li>
              <span className={styles.jp}>これはいくらですか。</span>
              <span className={styles.zh}>這個多少錢？</span>
            </li>
            <li>
              <span className={styles.jp}>道に迷いました、助けてください。</span>
              <span className={styles.zh}>我迷路了，請幫幫我。</span>
            </li>
            </ol>
          </div>
        </details>

        <details className={styles.card}>
          <summary className={styles.cardSummary}>飯店資訊卡</summary>
          <div className={styles.cardBody}>
            <ul className={styles.infoList}>
            <li>
              <span className={styles.infoLabel}>飯店名（日/英）</span>
              <span className={styles.infoValue}>
                GRIDS PREMIUM HOTEL OSAKA NAMBA
              </span>
            </li>
            <li>
              <span className={styles.infoLabel}>地址（日文原文）</span>
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
              <span className={styles.infoValue}>2026-01-08 3pm</span>
            </li>
            <li>
              <span className={styles.infoLabel}>退房時間</span>
              <span className={styles.infoValue}>2026-01-10 11am</span>
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
