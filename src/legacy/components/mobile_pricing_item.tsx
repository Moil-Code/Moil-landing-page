`use client`

import { useEffect, useState } from "react";
import { safeWindow } from "../../../utils/safe_window";
import { buildBusinessRegisterUrl } from "../utils/urlBuilder";

export default function MobilePricingItem({ flowId, plan, originalPrice, limitedOffer, cta, price, allShow, values, refQuery, lgQuery }: { flowId: any, plan: string, originalPrice?: { monthly: number, annually: number }, limitedOffer?: string, cta: string, price: { monthly: number, annually: number }, allShow: string, values: string[][], refQuery?: string, lgQuery?: string }) {
  const [oneShow, setOneShow] = useState(allShow);

  useEffect(() => {
    setOneShow(allShow);
  }, [allShow]);

  const handleClick = () => {
    const url = buildBusinessRegisterUrl({
      ref: refQuery,
      lg: lgQuery,
      flowId: flowId[oneShow]
    });
    safeWindow?.open(url, '_blank');
  };

  const isFeatured = plan === "PROFESSIONAL";
  const currentPrice = oneShow === "monthly" ? price.monthly : price.annually;
  const origPrice = oneShow === "monthly" ? originalPrice?.monthly : originalPrice?.annually;
  const period = oneShow === "monthly" ? "month" : "year";
  const hasDiscount = origPrice && origPrice > currentPrice;

  return (
    <div style={{
      background: isFeatured
        ? "linear-gradient(135deg, rgba(255,92,26,0.05), rgba(124,58,237,0.04), #0B0E18)"
        : "#0B0E18",
      border: isFeatured ? "1px solid #FF5C1A" : "1px solid #222840",
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: isFeatured ? "0 0 0 1px rgba(255,92,26,0.2), 0 32px 80px rgba(255,92,26,0.06)" : "none",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Card header */}
      <div style={{ padding: "28px 24px 20px", position: "relative" }}>
        {isFeatured && (
          <span style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "#FF5C1A",
            color: "white",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 8,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 4,
            letterSpacing: 1,
            textTransform: "uppercase"
          }}>⭐ BEST VALUE</span>
        )}

        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#EEF2FF",
          marginBottom: 12
        }}>{plan}</p>

        {hasDiscount && (
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#4A5368",
            textDecoration: "line-through",
            marginBottom: 2
          }}>${origPrice}/{period}</p>
        )}

        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 52,
            lineHeight: 1,
            color: isFeatured ? "#FF5C1A" : "#EEF2FF"
          }}>${currentPrice}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#4A5368"
          }}>/{period}</span>
        </div>

        {oneShow === "annually" && limitedOffer && (
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: "#FF5C1A",
            letterSpacing: 1,
            marginBottom: 8
          }}>Limited offer until {limitedOffer}</p>
        )}

        {/* Toggle buttons */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: "#10141F",
          border: "1px solid #222840",
          borderRadius: 100,
          padding: 4,
          marginBottom: 16
        }}>
          <button
            onClick={() => setOneShow("monthly")}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              padding: "7px 18px",
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s",
              background: oneShow === "monthly" ? "#FF5C1A" : "transparent",
              color: oneShow === "monthly" ? "#fff" : "#8892AA"
            }}
          >Monthly Plans</button>
          <button
            onClick={() => setOneShow("annually")}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              padding: "7px 18px",
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s",
              background: oneShow === "annually" ? "#FF5C1A" : "transparent",
              color: oneShow === "annually" ? "#fff" : "#8892AA"
            }}
          >See Annual Plans</button>
        </div>

        <button
          onClick={handleClick}
          style={{
            display: "block",
            width: "100%",
            padding: "13px",
            borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.25s",
            border: isFeatured ? "none" : "1px solid #222840",
            background: isFeatured ? "#FF5C1A" : "transparent",
            color: isFeatured ? "white" : "#8892AA"
          }}
        >{cta} →</button>
      </div>

      {/* Feature table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {values.map((items, i) => (
            <tr key={i}>
              <td style={{
                borderTop: "1px solid #1A1F30",
                padding: "12px 16px",
                maxWidth: 160,
                color: "#EEF2FF",
                fontSize: 12,
                fontWeight: 500
              }}>{items[0]}</td>
              <td style={{
                borderTop: "1px solid #1A1F30",
                padding: "12px 16px",
                background: isFeatured ? "rgba(255,92,26,0.04)" : "transparent",
                color: items[1] === "X" ? "#4A5368" : isFeatured ? "#FF5C1A" : "#10B981",
                fontSize: 13,
                fontWeight: items[1] !== "X" ? 500 : 400
              }}>{items[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
