# Draws the Learn-card diagrams into site/img. Labels are big and short so they read on a phone.
# Run: python3 build/diagrams.py
import math, os
OUT = os.path.join(os.path.dirname(__file__), "..", "site", "img")
INK, BLUE, RED, LB, GR, MU, WOOD = "#1F2328", "#005A9C", "#CE1126", "#E6EFF7", "#C9D0D7", "#5B6570", "#8B5A2B"
F = 'font-family="Arial, Helvetica, sans-serif"'

def svg(w, h, b, bg="#fff"): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><rect width="{w}" height="{h}" fill="{bg}"/>{b}</svg>'
def t(x, y, s, size=26, fill=INK, anchor="middle", bold=False):
    return f'<text x="{x}" y="{y}" {F} font-size="{size}" fill="{fill}" text-anchor="{anchor}"{" font-weight=\"700\"" if bold else ""}>{s}</text>'
def L(x1, y1, x2, y2, c=INK, w=14, dash=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}" stroke-linecap="round"{d}/>'
def C(x, y, r, fill=INK, stroke="none", sw=0): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def P(d, fill="none", stroke=INK, sw=4, dash=""):
    x = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{x}/>'
def R(x, y, w, h, fill, rx=0, stroke="none", sw=0): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def arrow(x1, y1, x2, y2, c=RED, w=5):
    a = math.atan2(y2 - y1, x2 - x1); h = 18
    return L(x1, y1, x2, y2, c, w) + f'<path d="M{x2},{y2} L{x2-h*math.cos(a-0.5):.1f},{y2-h*math.sin(a-0.5):.1f} L{x2-h*math.cos(a+0.5):.1f},{y2-h*math.sin(a+0.5):.1f} Z" fill="{c}"/>'

D = {}

# Shock: lying down, feet up about 12 inches, blanket
b = L(20, 250, 580, 250, GR, 4)
b += C(70, 212, 24, GR, INK, 4) + L(100, 222, 290, 222, INK, 26) + L(290, 222, 390, 170, INK, 22) + L(390, 170, 470, 170, INK, 20)
b += R(400, 182, 90, 68, GR, 10, INK, 4)
b += f'<path d="M110,205 Q200,180 295,200 L300,232 L110,236 Z" fill="{BLUE}"/>'
b += arrow(535, 248, 535, 176, RED, 5) + t(535, 105, "Feet up", 26, RED, bold=True) + t(535, 140, "12 in.", 26, RED)
b += t(200, 150, "Keep warm", 26, BLUE, bold=True)
D["shock.svg"] = svg(600, 270, b)

# CPR: shoulders over the chest, arms straight
b = L(20, 252, 580, 252, GR, 4)
b += C(70, 222, 22, GR, INK, 4) + L(98, 230, 400, 230, INK, 24) + L(400, 230, 520, 236, INK, 18)
b += C(222, 56, 22, GR, INK, 4) + L(228, 82, 305, 168, MU, 18) + L(305, 168, 332, 240, MU, 16) + L(332, 240, 400, 244, MU, 14)
b += L(222, 92, 210, 210, MU, 12) + R(188, 206, 44, 14, RED, 6)
b += arrow(110, 140, 182, 200) + t(110, 96, "Center of", 26, RED, bold=True) + t(110, 126, "the chest", 26, RED, bold=True)
b += t(460, 90, "Arms straight", 26) + t(460, 126, "Hard and fast", 26, RED, bold=True)
D["cpr.svg"] = svg(600, 270, b)

# Direct pressure
b = R(40, 150, 520, 70, GR, 35, INK, 4) + R(230, 128, 140, 40, BLUE, 8)
b += R(240, 70, 120, 58, GR, 22, INK, 4) + R(250, 40, 100, 44, GR, 20, INK, 4)
b += arrow(430, 30, 430, 120, RED, 6) + arrow(170, 30, 170, 120, RED, 6)
b += t(300, 262, "Press hard. Keep pressing.", 28, INK, bold=True)
D["pressure.svg"] = svg(600, 280, b)

# Burn: cool water
b = R(300, 20, 130, 30, MU, 8) + R(400, 40, 26, 40, MU, 6)
for x in [402, 413, 424]: b += L(x, 92, x, 168, BLUE, 4)
b += R(80, 170, 440, 56, GR, 28, INK, 4)
b += t(160, 80, "Cool water", 30, BLUE, bold=True) + t(160, 118, "15-20 minutes", 28, BLUE)
b += t(300, 266, "Then cover loosely", 26)
D["burn.svg"] = svg(600, 280, b)

# Hypothermia
b = L(20, 240, 580, 240, GR, 4) + R(40, 214, 380, 18, MU, 6)
b += f'<path d="M80,214 Q50,150 120,140 L370,148 Q415,158 410,214 Z" fill="{BLUE}"/>' + C(120, 150, 28, GR, INK, 4)
b += R(470, 150, 44, 48, "#fff", 6, INK, 4) + P("M514,162 q18,0 18,14 q0,14 -18,14")
for x in [484, 500]: b += P(f"M{x},140 q-6,-10 0,-20", stroke=MU, sw=3)
b += t(500, 86, "Warm drink", 26, INK, bold=True) + t(500, 116, "if alert", 24, MU)
b += t(240, 112, "Dry clothes, bag", 26, BLUE, bold=True) + t(230, 276, "Pad: off the cold ground", 24, MU)
D["hypothermia.svg"] = svg(600, 290, b)

# Heat exhaustion vs heatstroke
def face(cx, fill): return C(cx, 120, 70, fill, INK, 4) + C(cx - 24, 105, 6) + C(cx + 24, 105, 6)
b = face(150, "#E9ECEF")
for (x, y) in [(95, 80), (208, 92), (200, 150)]: b += P(f"M{x},{y} q-8,14 0,20 q8,-6 0,-20 Z", fill=BLUE, stroke=BLUE, sw=2)
b += P("M125,150 q25,-10 50,0") + face(450, "#E8743B")
for x in [375, 525]: b += P(f"M{x},60 q10,12 0,24 q-10,12 0,24", stroke=RED, sw=4)
b += P("M425,150 q25,8 50,0") + t(450, 40, "?", 34, INK, bold=True)
b += t(150, 232, "Exhaustion", 28, INK, bold=True) + t(150, 268, "Pale, sweaty", 26)
b += t(450, 232, "Heatstroke", 28, RED, bold=True) + t(450, 268, "Hot, red, confused", 24)
D["heat.svg"] = svg(600, 285, b)

# Stroke face
b = C(260, 140, 100, "#E9ECEF", INK, 4) + C(225, 115, 8) + P("M282,122 q14,6 28,4", sw=5) + P("M222,190 q38,-14 76,12", sw=5)
b += arrow(450, 150, 360, 170, RED, 5) + t(500, 120, "One side", 28, RED, bold=True) + t(500, 154, "droops", 28, RED, bold=True)
D["stroke.svg"] = svg(600, 270, b)

# Eye flush
b = C(250, 150, 95, "#E9ECEF", INK, 4) + f'<ellipse cx="215" cy="130" rx="18" ry="11" fill="#fff" stroke="{INK}" stroke-width="4"/>' + C(215, 130, 5) + C(285, 130, 6) + P("M222,195 q28,10 56,0")
b += R(100, 10, 40, 70, LB, 8, BLUE, 4) + P("M140,60 Q190,70 205,120", stroke=BLUE, sw=4) + P("M208,140 Q196,190 170,232", stroke=BLUE, sw=3, dash="6 6")
b += t(470, 120, "Don't rub", 30, RED, bold=True) + t(470, 160, "Flush it", 28, BLUE, bold=True)
D["eye.svg"] = svg(600, 260, b)

# Fire lays
def tinder(x, y): return C(x, y, 12, "#E3C17A", INK, 2)
b = L(20, 220, 580, 220, GR, 4) + tinder(100, 210)
for dx in [-50, -25, 25, 50]: b += L(100 + dx, 218, 100, 120, WOOD, 8)
b += tinder(300, 205)
for i, y in enumerate([212, 196, 180, 164]):
    b += L(255, y, 345, y, WOOD, 10) if i % 2 == 0 else C(262, y, 6, WOOD) + C(338, y, 6, WOOD) + L(262, y, 338, y, "#A9773F", 4)
b += L(440, 206, 560, 206, WOOD, 16) + tinder(490, 214)
for x in [455, 480, 505, 530]: b += L(x, 218, x + 30, 190, WOOD, 7)
b += t(100, 266, "Tepee", 28, INK, bold=True) + t(300, 266, "Log cabin", 28, INK, bold=True) + t(500, 266, "Lean-to", 28, INK, bold=True)
D["firelays.svg"] = svg(600, 285, b)

# Firewood sizes
b = P("M40,90 q10,-30 20,0 q10,-30 20,0 q10,-30 20,0 q10,-30 20,0 q10,-30 20,0", stroke="#B08A4A", sw=3)
b += L(230, 80, 360, 80, WOOD, 12) + L(420, 80, 570, 80, WOOD, 44)
b += t(90, 160, "Tinder", 28, INK, bold=True) + t(90, 196, "match-thin", 24, MU)
b += t(295, 160, "Kindling", 28, INK, bold=True) + t(295, 196, "pencil-thumb", 24, MU)
b += t(495, 160, "Fuel wood", 28, INK, bold=True) + t(495, 196, "wrist and up", 24, MU)
D["firewood.svg"] = svg(600, 220, b)

# Compass parts
b = R(150, 20, 180, 300, LB, 16, BLUE, 4) + arrow(240, 110, 240, 36, BLUE, 7)
b += C(240, 220, 72, "#fff", INK, 4)
for a in range(0, 360, 30):
    s, c = math.sin(math.radians(a)), math.cos(math.radians(a))
    b += L(240 + 64 * s, 220 - 64 * c, 240 + 72 * s, 220 - 72 * c, INK, 2)
b += P("M240,166 L256,192 L246,192 L246,264 L234,264 L234,192 L224,192 Z", stroke=RED, sw=3)
b += f'<path d="M240,178 L249,220 L231,220 Z" fill="{RED}"/><path d="M240,262 L249,220 L231,220 Z" fill="#fff" stroke="{INK}" stroke-width="2"/>'
b += L(350, 48, 256, 60, MU, 2) + t(355, 56, "Travel arrow", 24, INK, "start", True)
b += L(350, 150, 252, 196, MU, 2) + t(355, 140, "Needle", 24, INK, "start", True) + t(355, 168, "red = north", 22, RED, "start")
b += L(350, 270, 308, 250, MU, 2) + t(355, 278, "Housing", 24, INK, "start", True)
b += L(130, 300, 236, 252, MU, 2) + t(20, 336, "Orienting arrow:", 22, INK, "start", True) + t(195, 336, "red in the shed", 22, RED, "start")
D["compass.svg"] = svg(600, 350, b)

# Shadow stick
b = f'<path d="M30,250 L570,250 L530,90 L70,90 Z" fill="#F3EFE6" stroke="{GR}" stroke-width="3"/>'
b += L(330, 240, 330, 100, WOOD, 8)
b += L(330, 240, 190, 196, MU, 6) + C(190, 196, 10, BLUE) + t(190, 178, "1st", 26, BLUE, bold=True)
b += L(330, 240, 270, 160, "#A6AEB6", 6) + C(270, 160, 10, RED) + t(300, 150, "2nd", 26, RED, bold=True)
b += P("M110,236 L370,96", sw=3, dash="8 6")
b += t(90, 230, "W", 34, BLUE, bold=True) + t(390, 92, "E", 34, RED, bold=True)
b += t(300, 40, "15 minutes apart", 28, INK, bold=True)
D["shadowstick.svg"] = svg(600, 270, b)

# Big Dipper and the North Star
b = ""
stars = [(80, 240), (135, 218), (185, 208), (240, 214), (268, 166), (355, 166), (366, 224)]
for (x, y) in stars: b += C(x, y, 6, "#fff")
b += P("M80,240 L135,218 L185,208 L240,214 L268,166 L355,166 L366,224 L240,214", stroke="#8FB3D9", sw=2)
b += P("M366,224 L355,166 L330,48", stroke="#F2C14E", sw=3, dash="7 7") + C(328, 40, 10, "#F2C14E")
b += t(352, 48, "North Star", 28, "#F2C14E", "start", True) + t(392, 210, "Pointers", 26, "#fff", "start", True)
b += t(150, 280, "Big Dipper", 26, "#8FB3D9", bold=True)
D["dipper.svg"] = svg(600, 300, b, "#0B2545")

# Map symbols
b = ""
for i in range(4): b += P(f"M30,{52 - i * 6} q60,{-18 + i * 4} 120,0", stroke=WOOD, sw=3)
b += R(40, 88, 100, 36, "#9CC3E6", 18) + R(40, 146, 100, 36, "#B7D7A8")
b += L(30, 220, 150, 220, INK, 5, "14 10") + L(70, 254, 110, 286, INK, 6) + L(110, 254, 70, 286, INK, 6)
for y, s in [(52, "Contour lines: height"), (116, "Blue: water"), (174, "Green: vegetation"), (230, "Dashed: trail"), (282, "Picks: mine")]:
    b += t(180, y, s, 26, INK, "start")
D["mapsymbols.svg"] = svg(600, 300, b)

for k, v in D.items():
    with open(os.path.join(OUT, k), "w") as f: f.write(v)
print(len(D), "diagrams")
