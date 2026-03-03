`use client`

import { safeWindow } from "../../../utils/safe_window";
import { buildBusinessRegisterUrl } from "../utils/urlBuilder";

export default function PricingHeaderForPringItem({ flowId, plan, originalPrice, limitedOffer, cta, price, allShow, refQuery, lgQuery }: { flowId: any, plan: string, originalPrice?: { monthly: number, annually: number }, limitedOffer?: string, cta: string, price: { monthly: number, annually: number }, allShow: string, refQuery: string, lgQuery?: string }) {

	const handleClick = () => {
		const url = buildBusinessRegisterUrl({
			ref: refQuery,
			lg: lgQuery,
			flowId: flowId[allShow]
		});
		safeWindow?.open(url, '_blank');
	};

	const isFeatured = plan === "PROFESSIONAL";
	const currentPrice = allShow === "monthly" ? price.monthly : price.annually;
	const origPrice = allShow === "monthly" ? originalPrice?.monthly : originalPrice?.annually;
	const period = allShow === "monthly" ? "month" : "year";
	const hasDiscount = origPrice && origPrice > currentPrice;

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			gap: 8,
			padding: "24px 20px",
			position: "relative",
			fontFamily: "'DM Sans', sans-serif"
		}}>
			{isFeatured && (
				<span style={{
					position: "absolute",
					top: 16,
					right: 16,
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
				marginBottom: 4
			}}>{plan}</p>

			{hasDiscount && (
				<p style={{
					fontFamily: "'JetBrains Mono', monospace",
					fontSize: 11,
					color: "#4A5368",
					textDecoration: "line-through"
				}}>${origPrice}/{period}</p>
			)}

			<div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
				<span style={{
					fontFamily: "'Bebas Neue', sans-serif",
					fontSize: "clamp(44px,5vw,60px)",
					lineHeight: 1,
					color: isFeatured ? "#FF5C1A" : "#EEF2FF"
				}}>${currentPrice}</span>
				<span style={{
					fontFamily: "'JetBrains Mono', monospace",
					fontSize: 12,
					color: "#4A5368"
				}}>/{period}</span>
			</div>

			{allShow === "annually" && limitedOffer && (
				<p style={{
					fontFamily: "'JetBrains Mono', monospace",
					fontSize: 9,
					color: "#FF5C1A",
					letterSpacing: 1
				}}>Limited offer until {limitedOffer}</p>
			)}

			<div style={{ height: 1, background: "#1A1F30", margin: "12px 0" }} />

			<button
				onClick={handleClick}
				style={{
					display: "block",
					width: "100%",
					padding: "12px",
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
	)
}
