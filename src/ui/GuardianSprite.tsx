import { useId } from "react";

/** A small page guardian: original vector artwork, not a chat avatar. */
export function GuardianSprite({ happy = false }: { happy?: boolean }) {
  const id = useId().replaceAll(":", "");
  return <svg viewBox="0 0 140 150" fill="none" aria-hidden="true" className="guardian-sprite">
    <defs>
      <linearGradient id={`${id}-body`} x1="43" y1="34" x2="96" y2="119" gradientUnits="userSpaceOnUse">
        <stop stopColor="#edf5ee" /><stop offset=".54" stopColor="#c8ddd9" /><stop offset="1" stopColor="#aac6cc" />
      </linearGradient>
      <radialGradient id={`${id}-glow`}><stop stopColor="#f1d891" stopOpacity=".55" /><stop offset="1" stopColor="#f1d891" stopOpacity="0" /></radialGradient>
    </defs>
    <ellipse className="sprite-shadow" cx="70" cy="138" rx="24" ry="5" fill="#789284" opacity=".15" />
    <g className="sprite-float">
      <circle cx="70" cy="75" r="64" fill={`url(#${id}-glow)`} />
      <path d="M65 34C56 25 58 15 58 15C73 16 83 23 77 36" fill="#b7ccb0" stroke="#6f927f" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M65 24L70 35" stroke="#6f927f" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M41 73C29 73 23 85 28 91C32 96 40 90 47 88M99 73C110 73 119 67 121 72C124 80 109 89 96 88" fill="#c6d9d4" stroke="#73958e" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M69 32C91 31 104 47 106 67C109 86 106 114 88 120C79 123 76 113 70 113C64 113 61 124 51 120C32 114 32 92 34 72C36 51 42 35 69 32Z" fill={`url(#${id}-body)`} stroke="#709087" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M46 59C46 48 55 42 63 41" stroke="#f8faf0" strokeWidth="4" strokeLinecap="round" opacity=".8" />
      <ellipse cx="49" cy="82" rx="7" ry="3.6" fill="#d4bca1" opacity=".45" /><ellipse cx="89" cy="82" rx="7" ry="3.6" fill="#d4bca1" opacity=".45" />
      {happy ? <g stroke="#35534b" strokeWidth="2.3" strokeLinecap="round"><path d="M52 74Q57 69 61 74" /><path d="M79 74Q84 69 88 74" /></g> : <g fill="#35534b"><ellipse cx="57" cy="74" rx="2.4" ry="3.4" /><ellipse cx="83" cy="74" rx="2.4" ry="3.4" /></g>}
      <path d={happy ? "M64 83Q70 90 76 83" : "M65 84Q70 88 75 84"} stroke="#35534b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M65 98Q70 91 75 98Q77 104 70 108Q63 104 65 98" fill="#ddbe73" stroke="#b39958" strokeWidth="1" />
      <circle className="sprite-mote mote-one" cx="21" cy="52" r="2.4" fill="#d7bc78" /><circle className="sprite-mote mote-two" cx="118" cy="43" r="3" fill="#bad1ce" /><circle cx="114" cy="105" r="1.7" fill="#c9ad67" />
    </g>
  </svg>;
}

export function FamilyDrawing({ withChild = false }: { withChild?: boolean }) {
  return <svg viewBox="0 0 360 245" fill="none" aria-hidden="true" className="family-drawing">
    <ellipse cx="174" cy="223" rx="138" ry="12" fill="#d7decd" opacity=".55" />
    <path d="M78 220V158Q78 130 108 127H154Q181 133 188 169L196 220" fill="#a5bbb0" stroke="#718c80" strokeWidth="2" />
    <path d="M106 131L128 163L151 133" fill="#f6eee0" stroke="#718c80" strokeWidth="2" />
    <path d="M116 117V135Q132 147 146 131V110" fill="#c69c7b" stroke="#92755f" strokeWidth="1.8" />
    <path d="M101 72Q98 35 132 35Q167 33 167 71L161 104Q152 127 131 126Q109 125 102 102Z" fill="#d8b494" stroke="#92755f" strokeWidth="1.8" />
    <path d="M99 79Q87 56 103 37Q127 13 158 36Q174 48 167 80L155 65L149 49Q125 63 105 58Z" fill="#4b5148" />
    <path d="M110 87Q115 83 121 87M144 87Q149 83 154 87" stroke="#554e42" strokeWidth="2" strokeLinecap="round" />
    <path d="M127 105Q135 110 143 103" stroke="#805f4c" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M94 159L87 190L141 205M169 153L180 185L217 191" stroke="#718c80" strokeWidth="18" strokeLinecap="round" />
    <path d="M137 204L159 207M208 191L224 192" stroke="#d8b494" strokeWidth="13" strokeLinecap="round" />
    {withChild && <g>
      <path d="M222 216V172Q223 152 246 150H270Q296 155 297 181L298 219" fill="#d9be7f" stroke="#a99059" strokeWidth="2" />
      <path d="M237 147V157Q251 168 264 155V144" fill="#d5ac86" />
      <path d="M226 113Q224 85 252 84Q282 85 281 115L277 137Q270 155 251 154Q233 153 228 138Z" fill="#e0bd99" stroke="#a48667" strokeWidth="1.6" />
      <path d="M225 119Q215 97 231 85Q249 69 269 84Q289 85 282 120L271 104L259 99L242 106L231 102Z" fill="#565247" />
      <path d="M236 124Q241 120 246 124M261 124Q266 120 270 124M246 139Q253 144 260 138" stroke="#6b5544" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M232 179L215 194M280 180L278 207" stroke="#e0bd99" strokeWidth="12" strokeLinecap="round" />
    </g>}
    <path d="M38 209H324V220H38Z" fill="#dfcfb0" stroke="#bda988" strokeWidth="1.5" />
    <path d="M61 220L58 241M303 220L306 241" stroke="#bda988" strokeWidth="6" strokeLinecap="round" />
    <path d="M150 179L212 174L227 207L162 207Z" fill="#fffcf1" stroke="#adaf98" strokeWidth="1.5" />
    <path d="M168 185L203 183M172 192L212 190M177 198H203" stroke="#b9c5b2" strokeWidth="2.5" strokeLinecap="round" />
  </svg>;
}
