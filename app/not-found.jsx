import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  .nf-main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 24px 80px;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    background: white;
  }
  .nf-bg {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.55;
    pointer-events: none;
  }
  .nf-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, white 100%);
    pointer-events: none;
  }
  .nf-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 640px;
  }

  /* Scene */
  .nf-scene {
    position: relative;
    width: 480px;
    max-width: 100%;
    height: 260px;
    margin-bottom: 32px;
    animation: nfFadeUp .7s ease both;
  }
  .nf-warning-light {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #f97316;
    box-shadow: 0 0 12px 4px rgba(249,115,22,.6);
    animation: nfLightBlink 1.1s ease-in-out infinite;
    z-index: 1;
  }
  .nf-scaffold-svg {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
  }
  .nf-worker {
    position: absolute;
    bottom: 18px;
    right: 60px;
    width: 72px;
    animation: nfWorkerFloat 3.2s ease-in-out infinite;
    transform-origin: bottom center;
  }
  .nf-cone {
    position: absolute;
    bottom: 18px;
    left: 64px;
    width: 38px;
    animation: nfConeWobble 4s ease-in-out infinite;
    transform-origin: bottom center;
  }
  .nf-four-oh-four {
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 168px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -8px;
    color: transparent;
    -webkit-text-stroke: 3px #e5e7eb;
    white-space: nowrap;
    user-select: none;
  }
  .nf-four-oh-four span {
    color: transparent;
    -webkit-text-stroke: 3px #f97316;
  }

  /* Text & badges */
  .nf-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(249,115,22,.1);
    color: #f97316;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 20px;
    margin-bottom: 18px;
    animation: nfFadeUp .6s .1s ease both;
  }
  .nf-title {
    font-size: 38px;
    font-weight: 900;
    color: #111827;
    line-height: 1.12;
    letter-spacing: -.03em;
    margin-bottom: 14px;
    text-wrap: balance;
    animation: nfFadeUp .6s .2s ease both;
  }
  .nf-subtitle {
    font-size: 16.5px;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 36px;
    max-width: 440px;
    text-wrap: balance;
    animation: nfFadeUp .6s .3s ease both;
  }

  /* Buttons */
  .nf-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    animation: nfFadeUp .6s .4s ease both;
  }
  .nf-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #f97316;
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    padding: 13px 26px;
    border-radius: 8px;
    text-decoration: none;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 14px rgba(249,115,22,.35);
  }
  .nf-btn-primary:hover {
    background: #ea6c0a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(249,115,22,.45);
  }
  .nf-btn-primary:active { transform: translateY(0); }
  .nf-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: #111827;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    text-decoration: none;
    transition: background .2s, border-color .2s, transform .15s;
  }
  .nf-btn-secondary:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
  .nf-btn-secondary:active { transform: translateY(0); }

  /* Quick links */
  .nf-quick-links {
    margin-top: 56px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    animation: nfFadeUp .6s .5s ease both;
  }
  .nf-quick-links-label {
    font-size: 13px;
    color: #9ca3af;
    font-weight: 500;
  }
  .nf-chip {
    display: inline-flex;
    align-items: center;
    background: #f3f4f6;
    color: #374151;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    text-decoration: none;
    transition: background .2s, border-color .2s, color .2s;
  }
  .nf-chip:hover {
    background: rgba(249,115,22,.08);
    border-color: rgba(249,115,22,.3);
    color: #f97316;
  }

  /* Animations */
  @keyframes nfFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes nfWorkerFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    30%      { transform: translateY(-8px) rotate(-2deg); }
    60%      { transform: translateY(-4px) rotate(1.5deg); }
  }
  @keyframes nfConeWobble {
    0%, 100% { transform: rotate(0deg); }
    25%      { transform: rotate(3deg); }
    75%      { transform: rotate(-3deg); }
  }
  @keyframes nfLightBlink {
    0%, 45%, 55%, 100% { opacity: 1; box-shadow: 0 0 12px 4px rgba(249,115,22,.6); }
    50%                { opacity: .25; box-shadow: 0 0 4px 1px rgba(249,115,22,.2); }
  }
`;

export default function NotFound() {
  return (
    <>
      <style>{styles}</style>

      <Navbar />
      <main className="nf-main">
        <div className="nf-bg" aria-hidden="true" />
        <div className="nf-vignette" aria-hidden="true" />

        <div className="nf-content">
          {/* Construction scene illustration */}
          <div className="nf-scene">
            <div className="nf-warning-light" aria-hidden="true" />

            <svg
              className="nf-scaffold-svg"
              viewBox="0 0 480 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line
                x1="40"
                y1="230"
                x2="440"
                y2="230"
                stroke="#e5e7eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Vertical poles */}
              <rect
                x="100"
                y="60"
                width="7"
                height="170"
                rx="3.5"
                fill="#d1d5db"
              />
              <rect
                x="175"
                y="60"
                width="7"
                height="170"
                rx="3.5"
                fill="#d1d5db"
              />
              <rect
                x="295"
                y="60"
                width="7"
                height="170"
                rx="3.5"
                fill="#d1d5db"
              />
              <rect
                x="370"
                y="60"
                width="7"
                height="170"
                rx="3.5"
                fill="#d1d5db"
              />
              {/* Horizontal cross-beams */}
              <rect x="97" y="95" width="85" height="6" rx="3" fill="#e5e7eb" />
              <rect
                x="97"
                y="148"
                width="85"
                height="6"
                rx="3"
                fill="#e5e7eb"
              />
              <rect
                x="292"
                y="95"
                width="85"
                height="6"
                rx="3"
                fill="#e5e7eb"
              />
              <rect
                x="292"
                y="148"
                width="85"
                height="6"
                rx="3"
                fill="#e5e7eb"
              />
              {/* Orange accent top beams */}
              <rect
                x="97"
                y="57"
                width="85"
                height="7"
                rx="3.5"
                fill="#f97316"
                opacity=".9"
              />
              <rect
                x="292"
                y="57"
                width="85"
                height="7"
                rx="3.5"
                fill="#f97316"
                opacity=".9"
              />
              {/* Diagonal cross bracing */}
              <line
                x1="103"
                y1="63"
                x2="179"
                y2="150"
                stroke="#e5e7eb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <line
                x1="179"
                y1="63"
                x2="103"
                y2="150"
                stroke="#e5e7eb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <line
                x1="298"
                y1="63"
                x2="374"
                y2="150"
                stroke="#e5e7eb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <line
                x1="374"
                y1="63"
                x2="298"
                y2="150"
                stroke="#e5e7eb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Blueprint overlay in the middle */}
              <rect
                x="190"
                y="58"
                width="95"
                height="175"
                fill="rgba(249,115,22,.04)"
                rx="2"
              />
              <line
                x1="190"
                y1="58"
                x2="285"
                y2="58"
                stroke="#f97316"
                strokeWidth="1"
                opacity=".25"
              />
              <line
                x1="190"
                y1="230"
                x2="285"
                y2="230"
                stroke="#f97316"
                strokeWidth="1"
                opacity=".25"
              />
              {/* Scaffold planks */}
              <rect
                x="97"
                y="89"
                width="85"
                height="12"
                rx="2"
                fill="#f9fafb"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <rect
                x="97"
                y="142"
                width="85"
                height="12"
                rx="2"
                fill="#f9fafb"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <rect
                x="292"
                y="89"
                width="85"
                height="12"
                rx="2"
                fill="#f9fafb"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <rect
                x="292"
                y="142"
                width="85"
                height="12"
                rx="2"
                fill="#f9fafb"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              {/* Hammer */}
              <rect
                x="108"
                y="110"
                width="4"
                height="12"
                rx="2"
                fill="#9ca3af"
              />
              <rect
                x="105"
                y="108"
                width="10"
                height="5"
                rx="2"
                fill="#6b7280"
              />
              {/* Wrench */}
              <circle
                cx="360"
                cy="113"
                r="5"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2.5"
              />
              <rect
                x="358.5"
                y="118"
                width="3"
                height="10"
                rx="1.5"
                fill="#9ca3af"
              />
              {/* Safety banner */}
              <rect
                x="182"
                y="200"
                width="116"
                height="10"
                rx="2"
                fill="white"
                stroke="#f97316"
                strokeWidth="1.5"
              />
              <rect
                x="182"
                y="200"
                width="20"
                height="10"
                fill="#f97316"
                opacity=".5"
              />
              <rect
                x="218"
                y="200"
                width="20"
                height="10"
                fill="#f97316"
                opacity=".5"
              />
              <rect
                x="254"
                y="200"
                width="20"
                height="10"
                fill="#f97316"
                opacity=".5"
              />
              <rect
                x="182"
                y="200"
                width="5"
                height="10"
                rx="2"
                fill="#f97316"
                opacity=".5"
              />
              <rect
                x="293"
                y="200"
                width="5"
                height="10"
                rx="2"
                fill="#f97316"
                opacity=".5"
              />
              {/* Tape measure */}
              <rect
                x="380"
                y="170"
                width="30"
                height="8"
                rx="4"
                fill="#fde68a"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <rect
                x="385"
                y="173"
                width="20"
                height="2"
                rx="1"
                fill="#f59e0b"
                opacity=".6"
              />
              {/* Bolt details */}
              <circle cx="103" cy="63" r="3" fill="#6b7280" />
              <circle cx="179" cy="63" r="3" fill="#6b7280" />
              <circle cx="298" cy="63" r="3" fill="#6b7280" />
              <circle cx="374" cy="63" r="3" fill="#6b7280" />
              <circle cx="103" cy="230" r="3.5" fill="#9ca3af" />
              <circle cx="179" cy="230" r="3.5" fill="#9ca3af" />
              <circle cx="298" cy="230" r="3.5" fill="#9ca3af" />
              <circle cx="374" cy="230" r="3.5" fill="#9ca3af" />
              {/* Missing page placeholder */}
              <rect
                x="192"
                y="70"
                width="96"
                height="118"
                rx="4"
                fill="rgba(249,115,22,.06)"
                stroke="#f97316"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x="240"
                y="138"
                textAnchor="middle"
                fontFamily="DM Sans,sans-serif"
                fontWeight="900"
                fontSize="48"
                fill="#f97316"
                opacity=".22"
              >
                ?
              </text>
              <rect
                x="218"
                y="64"
                width="44"
                height="14"
                rx="3"
                fill="#f97316"
              />
              <text
                x="240"
                y="74"
                textAnchor="middle"
                fontFamily="DM Sans,sans-serif"
                fontWeight="700"
                fontSize="8"
                fill="white"
                letterSpacing=".5"
              >
                MISSING
              </text>
            </svg>

            {/* Worker character */}
            <div className="nf-worker" aria-hidden="true">
              <svg
                viewBox="0 0 72 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="36" cy="28" rx="22" ry="7" fill="#f97316" />
                <rect
                  x="19"
                  y="27"
                  width="34"
                  height="5"
                  rx="2.5"
                  fill="#ea6c0a"
                />
                <rect
                  x="14"
                  y="29"
                  width="44"
                  height="4"
                  rx="2"
                  fill="#f97316"
                />
                <ellipse cx="36" cy="40" rx="14" ry="14" fill="#fde8c8" />
                <ellipse cx="30" cy="39" rx="2.5" ry="3" fill="#111827" />
                <ellipse cx="42" cy="39" rx="2.5" ry="3" fill="#111827" />
                <path
                  d="M27 34 Q30 31 33 33"
                  stroke="#92400e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M39 33 Q42 33 45 35"
                  stroke="#92400e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M31 47 Q36 45 41 47"
                  stroke="#92400e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <rect
                  x="31"
                  y="52"
                  width="10"
                  height="8"
                  rx="2"
                  fill="#fde8c8"
                />
                <rect
                  x="20"
                  y="58"
                  width="32"
                  height="28"
                  rx="4"
                  fill="#111827"
                />
                <rect
                  x="20"
                  y="68"
                  width="32"
                  height="4"
                  fill="#f97316"
                  opacity=".7"
                />
                <rect
                  x="20"
                  y="76"
                  width="32"
                  height="4"
                  fill="#f97316"
                  opacity=".7"
                />
                <rect
                  x="6"
                  y="58"
                  width="16"
                  height="8"
                  rx="4"
                  fill="#111827"
                />
                <rect
                  x="50"
                  y="58"
                  width="16"
                  height="8"
                  rx="4"
                  fill="#111827"
                />
                <rect
                  x="52"
                  y="44"
                  width="14"
                  height="8"
                  rx="4"
                  fill="#111827"
                  transform="rotate(-40 52 44)"
                />
                <ellipse cx="58" cy="36" rx="5" ry="5" fill="#fde8c8" />
                <rect
                  x="22"
                  y="84"
                  width="12"
                  height="12"
                  rx="3"
                  fill="#374151"
                />
                <rect
                  x="38"
                  y="84"
                  width="12"
                  height="12"
                  rx="3"
                  fill="#374151"
                />
              </svg>
            </div>

            {/* Traffic cone */}
            <div className="nf-cone" aria-hidden="true">
              <svg
                viewBox="0 0 38 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 2 L33 42 L5 42 Z" fill="#f97316" />
                <path
                  d="M11.5 26 L26.5 26 L28.5 34 L9.5 34 Z"
                  fill="white"
                  opacity=".85"
                />
                <rect
                  x="2"
                  y="42"
                  width="34"
                  height="6"
                  rx="3"
                  fill="#e5e7eb"
                />
              </svg>
            </div>

            <div className="nf-four-oh-four" aria-label="404">
              4<span>0</span>4
            </div>
          </div>

          {/* Badge */}
          <div className="nf-badge">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Error 404
          </div>

          <h1 className="nf-title">Blueprint Not Found</h1>

          <p className="nf-subtitle">
            Looks like this page wandered off the job site. The crew&#39;s
            checked everywhere — it&#39;s not in the plans.
          </p>

          {/* CTAs */}
          <div className="nf-actions">
            <Link href="/" className="nf-btn-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </Link>
            <Link href="/contractors" className="nf-btn-secondary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Find Contractors
            </Link>
          </div>

          {/* Quick links */}
          <div className="nf-quick-links">
            <span className="nf-quick-links-label">Popular trades:</span>
            <Link href="/contractors?trade=electrician" className="nf-chip">
              Electrician
            </Link>
            <Link href="/contractors?trade=plumber" className="nf-chip">
              Plumber
            </Link>
            <Link href="/contractors?trade=Roofer" className="nf-chip">
              Roofer
            </Link>
            <Link href="/contractors?trade=landscaper" className="nf-chip">
              Landscaper
            </Link>
            <Link href="/contractors?trade=handyman" className="nf-chip">
              Handyman
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
