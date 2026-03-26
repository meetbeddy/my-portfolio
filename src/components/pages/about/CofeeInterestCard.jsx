import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee } from "lucide-react";
import styled from "styled-components";

const InterestCard = styled(motion.div)`
  background: ${props => props.bgColor || props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  will-change: transform;
`;

const CoffeeInterestCard = ({ bgColor }) => {
  const [coffeeCount, setCoffeeCount]       = useState(0);
  const [coffeeStrength, setCoffeeStrength] = useState("medium");
  const [brewing, setBrewing]               = useState(false);

  const brewCoffee = () => {
    if (brewing) return;
    setBrewing(true);
    setTimeout(() => {
      setCoffeeCount(c => c + 1);
      setBrewing(false);
    }, 1800);
  };

  const fillPx = Math.min(
    coffeeCount * (coffeeStrength === "espresso" ? 6 : coffeeStrength === "medium" ? 9 : 12),
    48
  );

  const fillColor =
    coffeeStrength === "espresso" ? "linear-gradient(to top,#1a0800,#3E2723)"
    : coffeeStrength === "medium"  ? "linear-gradient(to top,#2d1500,#5D4037)"
    :                                "linear-gradient(to top,#3d2000,#795548)";

  const messages = [
    null,
    "First cup. Engines warming... ☀️",
    "Getting into the zone 🎯",
    "Peak flow state achieved 🚀",
    "Fingers flying across the keyboard!",
    "Reaching optimal velocity...",
  ];
  const msg = coffeeCount <= 5 ? messages[coffeeCount]
    : coffeeCount <= 7 ? "Is the code writing itself? 🤔"
    : coffeeCount <= 10 ? "I can see through the bugs now 👁️"
    : "Maybe water next time? 😅";

  return (
    <InterestCard bgColor={bgColor}>
      {/* Title */}
      <div style={{
        fontSize: "1.125rem", fontWeight: 600,
        marginBottom: "0.5rem", display: "flex",
        alignItems: "center", color: "white",
      }}>
        <motion.div whileHover={{ rotate: [0, -10, 20, -10, 0] }} transition={{ duration: 0.5 }}>
          <Coffee style={{ marginRight: "0.5rem", color: "#e04848" }} size={20} />
        </motion.div>
        Coffee
      </div>

      <p style={{ color: "#aaa", marginBottom: "1rem", fontSize: "0.88rem", lineHeight: "1.6" }}>
        Espresso is a feature, not a bug. Essential fuel for every coding session.
      </p>

      {/* Strength selector */}
      <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "14px" }}>
        {["espresso", "medium", "long"].map(s => (
          <motion.button key={s}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setCoffeeStrength(s)}
            style={{
              padding: "4px 12px", borderRadius: "20px", border: "none",
              fontSize: "0.62rem", letterSpacing: "1px", textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
              background: coffeeStrength === s ? "linear-gradient(135deg,#6b3a2a,#8b4513)" : "rgba(255,255,255,0.07)",
              color: coffeeStrength === s ? "#f5deb3" : "rgba(255,255,255,0.4)",
              boxShadow: coffeeStrength === s ? "0 0 10px rgba(139,69,19,0.5)" : "none",
            }}
          >{s}</motion.button>
        ))}
      </div>

      {/* Machine body */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <div style={{ position: "relative", width: "120px" }}>
          <div style={{
            width: "100px", height: "80px", margin: "0 auto",
            background: "linear-gradient(160deg,#2a2a2a 0%,#1a1a1a 50%,#3a3a3a 100%)",
            borderRadius: "12px 12px 4px 4px", position: "relative",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            {/* Pressure gauge */}
            <div style={{
              position: "absolute", top: "10px", left: "10px",
              width: "20px", height: "20px", borderRadius: "50%",
              background: "radial-gradient(circle at 40% 40%,#444,#1a1a1a)",
              border: "2px solid #555",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <motion.div
                animate={{ rotate: brewing ? [0, 45, 60, 45] : [0, 8, 0] }}
                transition={{ duration: brewing ? 1.4 : 3, repeat: Infinity }}
                style={{ width: "8px", height: "1.5px", background: "#e04848", borderRadius: "1px", transformOrigin: "left center" }}
              />
            </div>

            {/* LED */}
            <motion.div
              animate={{ opacity: brewing ? [0.5, 1, 0.5] : 1 }}
              transition={{ duration: 0.5, repeat: brewing ? Infinity : 0 }}
              style={{
                position: "absolute", top: "10px", right: "10px",
                width: "8px", height: "8px", borderRadius: "50%",
                background: brewing ? "#ff6b35" : "#00ff88",
                boxShadow: brewing ? "0 0 8px #ff6b35" : "0 0 8px #00ff88",
              }}
            />

            {/* Display */}
            <div style={{
              position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)",
              background: "#0a1628", borderRadius: "4px",
              padding: "3px 6px", border: "1px solid #333",
              fontSize: "0.55rem", color: brewing ? "#ff6b35" : "#00ff88",
              fontFamily: "monospace", letterSpacing: "1px", whiteSpace: "nowrap",
            }}>
              {brewing ? "BREWING" : coffeeStrength === "espresso" ? "25ml" : coffeeStrength === "medium" ? "60ml" : "120ml"}
            </div>

            {/* Portafilter */}
            <div style={{
              position: "absolute", bottom: "-10px", left: "50%", transform: "translateX(-50%)",
              width: "52px", height: "14px",
              background: "linear-gradient(to bottom,#444,#2a2a2a)",
              borderRadius: "0 0 20px 20px", border: "1px solid rgba(255,255,255,0.08)",
            }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={brewing ? { height: ["0px","14px","0px"], opacity: [0,1,0] } : { height: "0px", opacity: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.15, repeat: brewing ? Infinity : 0 }}
                  style={{
                    position: "absolute", top: "14px", left: `${9 + i * 13}px`,
                    width: "3px", background: "linear-gradient(to bottom,#3E2723,#1a0f00)",
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Steam wisps */}
          {brewing && [0, 1, 2].map(i => (
            <motion.div key={`st${i}`}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.5, 0], y: -28, x: (i - 1) * 7 }}
              transition={{ duration: 1.1, delay: i * 0.25, repeat: Infinity }}
              style={{
                position: "absolute", top: "2px", left: "50%",
                width: "5px", height: "5px", borderRadius: "50%",
                background: "rgba(255,255,255,0.35)", filter: "blur(3px)",
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Clickable cup */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={brewCoffee}
          style={{
            width: "64px", height: "56px",
            background: "linear-gradient(160deg,#f5f5f0,#e8e0d0)",
            borderRadius: "3px 3px 16px 16px",
            position: "relative", cursor: brewing ? "wait" : "pointer",
            overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          {/* Handle */}
          <div style={{
            position: "absolute", right: "-10px", top: "12px",
            width: "12px", height: "24px",
            border: "3px solid #e0d8c8", borderLeft: "none",
            borderRadius: "0 30px 30px 0",
          }} />

          {/* Coffee fill */}
          <motion.div
            animate={{ height: coffeeCount > 0 ? `${fillPx}px` : "0px" }}
            transition={{ type: "spring", damping: 12 }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: fillColor,
              borderRadius: "0 0 13px 13px",
            }}
          />

          {/* Foam */}
          {coffeeCount > 0 && (
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute", bottom: fillPx, left: 2, right: 2,
                height: "4px", background: "rgba(220,185,120,0.65)", borderRadius: "4px",
              }}
            />
          )}

          {/* Tap hint */}
          {coffeeCount === 0 && !brewing && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.52rem", color: "rgba(0,0,0,0.3)",
              letterSpacing: "1px", textAlign: "center", lineHeight: 1.4,
            }}>TAP<br/>TO<br/>BREW</div>
          )}
        </motion.div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        background: "rgba(0,0,0,0.2)", borderRadius: "8px",
        padding: "7px 12px", fontSize: "0.72rem", marginBottom: "8px",
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>
          ☕ <strong style={{ color: "rgba(255,255,255,0.85)" }}>{coffeeCount}</strong> cups
        </span>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>
          ⚡ <strong style={{ color: coffeeCount > 7 ? "#e04848" : "rgba(255,255,255,0.85)" }}>{coffeeCount * 95}mg</strong>
        </span>
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        {coffeeCount > 0 && (
          <motion.div
            key={coffeeCount}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: "0.75rem", fontStyle: "italic",
              color: "rgba(255,255,255,0.5)", textAlign: "center",
              padding: "6px", background: "rgba(0,0,0,0.15)", borderRadius: "6px",
            }}
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </InterestCard>
  );
};

export default CoffeeInterestCard;