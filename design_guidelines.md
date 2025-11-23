# Discipline Forge ® Design Guidelines

## Design Approach: Premium Gamified Mobile Experience
**Reference Inspiration**: Duolingo (gamification mastery) + Nike Training Club (motivational premium feel) + Apple Fitness+ (clean progression UI) + Habitica (RPG-style rewards)

**Core Philosophy**: Create an app that feels like a $10 premium native iOS/Android game with addictive visual feedback, bold celebrations, and share-worthy moments.

---

## Typography System
- **Primary Font**: 'Poppins' (Google Fonts) - Bold, modern, gamified feel
  - Headings: 700 weight (Bold)
  - Body: 500 weight (Medium)
  - UI Elements: 600 weight (Semi-Bold)
- **Secondary Font**: 'Inter' for data/stats (400, 500 weights)
- **Scale**: Use large, confident sizing
  - Hero/Dashboard title: text-4xl to text-5xl
  - Task names: text-xl
  - Stats/numbers: text-3xl (bold)
  - Body text: text-base

---

## Layout & Spacing
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Consistent component padding: p-6 on mobile, p-8 on desktop
- Section spacing: mb-8 between major sections
- Card gaps: gap-4 for grids
- Button spacing: px-6 py-3 for primary actions

**Container Strategy**:
- Max width: max-w-md (mobile-first, centered)
- Full bleed for backgrounds/particles
- Generous internal whitespace (never cramped)

---

## Core UI Components

### Navigation
- **Bottom Tab Bar** (fixed, mobile-native feel)
  - 4 tabs: Dashboard, Shop, Stats, Profile
  - Active state with icon color change + bottom border accent
  - Icons: Heroicons (home, shopping-bag, chart-bar, user-circle)
  - Height: h-16, backdrop blur effect

### Dashboard (Main Screen)
**Layout Sections**:
1. **Header Area** (not traditional hero):
   - Greeting + motivational quote of the day
   - Centered, max-w-sm
   - Daily streak counter (large fire emoji + number in bold text-3xl)
   - Current level badge (circular, glowing effect)

2. **Today's Tasks Section**:
   - Large heading "Today's Discipline"
   - Each task card:
     - Rounded-2xl cards with shadow-lg
     - Large checkbox button (left, h-12 w-12, rounded-full)
     - Task name (text-xl, truncate if needed)
     - Streak indicator (right side, fire emoji + number)
     - Time reminder badge (if set, small pill shape)
     - Tap entire card to check/uncheck
   - Spacing: space-y-4 between cards
   - Completed tasks: subtle opacity change + strikethrough

3. **Weekly Heatmap Calendar**:
   - Grid of 7 columns (days) × 4 rows (weeks)
   - Each cell: rounded square, aspect-square
   - Intensity levels: 4 shades (empty, 25%, 75%, 100%)
   - Current day: border highlight
   - Compact spacing: gap-1

### Gamification Elements
**Progress Rings** (circular progress indicators):
- Daily completion ring around profile icon
- Weekly completion ring in stats view
- Smooth animated fills on completion

**Achievement Badges**:
- Grid layout: grid-cols-3, gap-4
- Circular badge icons with glow effects
- Locked state: grayscale + lock icon overlay
- Unlocked: full color + particle burst animation

**Level System Display**:
- XP bar (horizontal progress bar)
- Current level number in badge (hexagon or shield shape)
- "Next Level" indicator with XP needed

### Discipline Shop
- **Trophy Display Grid**: grid-cols-2, gap-6
- Each trophy card:
  - Large emoji/icon (text-5xl)
  - Trophy name (text-lg, font-bold)
  - Cost in discipline points
  - "Purchase" button or "Owned" badge
  - Subtle card elevation

### Task Creation Modal
**Full-screen overlay** (mobile pattern):
- Slide-up animation from bottom
- Close button (top-right)
- Form sections with clear spacing (space-y-6):
  - Task name input (large, text-xl)
  - Frequency selector (segmented control: Daily/Weekly/Custom)
  - Day toggle buttons (Mon-Sun, pill shapes, multi-select)
  - Time picker (native input type="time")
  - Motivational note textarea (3 rows)
- Large "Create Task" button (w-full, fixed bottom)

### Premium Upgrade Screen
**Feature Comparison Layout**:
- Hero area: "Go Premium" headline
- Feature list cards:
  - Icon + Feature title + Description
  - Checkmarks for included features
- Prominent pricing card (centered, elevated)
  - "$3.99 One-Time" (large, bold)
  - "Upgrade Now" CTA button
- Bottom: "Restore Purchase" link

### Shareable Screenshot Feature
**Screenshot Canvas Design**:
- Gradient background (brand-themed)
- Centered card with:
  - User's streak stats (large numbers)
  - Weekly heatmap visual
  - "Discipline Forge ®" branding (bottom)
  - Motivational text overlay
- "Share to Instagram/TikTok" buttons below preview

---

## Visual Effects & Animations

**Particle Background**:
- Subtle floating particles (canvas-based)
- Slow drift animation
- Low opacity to not distract from content

**Confetti Celebrations**:
- Trigger on: Task completion, streak milestones, level up
- Canvas-based, brief (2-3 seconds)
- Colorful, celebratory particles falling from top

**Micro-interactions**:
- Checkbox: Scale bounce on tap + color fill animation
- Buttons: Slight scale (0.95) on press, bounce back
- Cards: Subtle hover lift (translate-y-1) on desktop
- Progress bars: Smooth width transitions (duration-500)

**Haptic-style Feedback**:
- Visual pulse effect on interactions
- Quick flash/glow on success actions

---

## Onboarding Tour
**Overlay Spotlight Pattern**:
- Dark overlay (bg-black/80)
- Circular spotlight on highlighted feature
- Tooltip card with arrow pointing to feature
- "Next" button + progress dots (bottom)
- 5-6 key features showcased

---

## Monetization UI

**Rewarded Ad CTA**:
- Appears on missed task (strike-through state)
- Card with video play icon
- Text: "Watch Ad to Revive" + restore icon
- Positioned below missed task

**Premium Badge**:
- Small "PRO" badge on premium-only features
- Tapping triggers upgrade modal

---

## Images
**No large hero image needed** - This is a dashboard-focused app, not a landing page. The primary screen is the task list with gamification elements.

**Icon Assets**:
- App icon: 512×512 - Shield with sword, fire glow effect, gradient background
- Badge icons: Trophy, medal, fire, star variations
- Achievement graphics: Use emoji + geometric shapes

---

## Sound Design Triggers
- Task completion: Satisfying "ding" or "pop"
- Level up: Fanfare sound
- Streak milestone: Applause/cheer
- Toggle in settings (icon: Heroicons speaker-wave)

---

**Final Note**: Every interaction should feel rewarding. Prioritize immediate visual feedback, generous spacing, and bold typography. The app should photograph/screen-record beautifully for social sharing - high contrast, clear hierarchy, Instagram-worthy aesthetics.