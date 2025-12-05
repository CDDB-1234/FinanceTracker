# Deposit Detail Modal - Visual Guide 🎨

## Modal Appearance

### Desktop View (Full Screen)

```
┌───────────────────────────────────────────────────────────────┐
│ Deposit Details - John Doe                                 ×  │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  Investment Account Type      Bank              Account Number  │
│  ┌─────────────────────┐      ┌─────────────┐  ┌────────────┐ │
│  │ FD                  │      │ HDFC        │  │ ACC123456  │ │
│  └─────────────────────┘      └─────────────┘  └────────────┘ │
│                                                                 │
│  Account Holder               Deposit Type     Account Status   │
│  ┌─────────────────────┐      ┌─────────────┐  ┌────────────┐ │
│  │ John Doe            │      │ Long Term   │  │ Active ✓   │ │
│  └─────────────────────┘      └─────────────┘  └────────────┘ │
│                                                                 │
│  Deposit Amount (₹)           Interest Rate (%) Interest Amount │
│  ┌─────────────────────┐      ┌─────────────┐  ┌────────────┐ │
│  │ ₹500,000            │      │ 7.5%        │  │ ₹175,000   │ │
│  └─────────────────────┘      └─────────────┘  └────────────┘ │
│                                                                 │
│  Maturity Amount (₹)          Amount Accumulated Start Date     │
│  ┌─────────────────────┐      ┌─────────────┐  ┌────────────┐ │
│  │ ₹675,000            │      │ ₹600,000    │  │ 01/01/2023 │ │
│  └─────────────────────┘      └─────────────┘  └────────────┘ │
│                                                                 │
│  Maturity Date                Plan on Maturity Deposit on Mat.  │
│  ┌─────────────────────┐      ┌─────────────┐  ┌────────────┐ │
│  │ 01/01/2024          │      │ Reinvest    │  │ Both       │ │
│  └─────────────────────┘      └─────────────┘  └────────────┘ │
│                                                                 │
│  Created By                   Updated By         Last Modified  │
│  ┌─────────────────────┐      ┌─────────────┐  ┌────────────┐ │
│  │ admin               │      │ admin       │  │ 12/04/2025 │ │
│  └─────────────────────┘      └─────────────┘  └────────────┘ │
│                                                                 │
│  Comments (Full Width)                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ FD opened for retirement planning                         │ │
│  │ Considering reinvestment on maturity                      │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
├───────────────────────────────────────────────────────────────┤
│                    [✎ Edit Deposit]  [Close]                   │
└───────────────────────────────────────────────────────────────┘
```

---

## Color Scheme

### Element Colors

```
┌─────────────────────────────────────────────────────┐
│ Header Background:  White (#FFFFFF)                 │
│ Header Text:        Dark Gray (#333333)             │
│ Header Border:      Light Gray (#F0F0F0)            │
│                                                      │
│ Field Label:        Medium Gray (#666666)           │
│ Label Style:        UPPERCASE, 12px, 600 weight    │
│                                                      │
│ Value Background:   Very Light Gray (#F9F9F9)      │
│ Value Text:         Dark Gray (#333333)             │
│ Value Border:       Blue (#667EEA) - left 3px      │
│                                                      │
│ Overlay:            Black with 60% opacity          │
│ Modal Border:       Radius 12px                     │
│ Modal Shadow:       0 10px 40px rgba(0,0,0,0.2)   │
│                                                      │
│ Edit Button:        Gradient Purple (#667EEA-#764BA2)│
│ Close Button:       Light Gray (#E0E0E0)            │
│                                                      │
│ Status Badges:                                       │
│   • Active:         Green                           │
│   • Matured:        Orange                          │
│   • Closed:         Red                             │
└─────────────────────────────────────────────────────┘
```

---

## Animation Sequences

### 1. Modal Opening

```
STEP 1: User clicks row
├─ Row highlights with light purple shadow
└─ Cursor changes to pointer

STEP 2: Overlay appears (0.0s - 0.3s)
├─ Overlay fades in
├─ From: opacity 0%
├─ To: opacity 100%
└─ Easing: ease

STEP 3: Modal appears (0.0s - 0.3s)
├─ Modal slides up
├─ From: 30px below + opacity 0%
├─ To: center position + opacity 100%
└─ Easing: ease

TOTAL TIME: 0.3 seconds
RESULT: Smooth, professional appearance
```

### 2. Button Hover

```
EDIT BUTTON:
├─ From: Normal position, gradient background
├─ To: Moved up 2px, enhanced shadow
├─ Duration: 0.3s
└─ Effect: Lift animation

CLOSE BUTTON:
├─ From: Gray (#E0E0E0)
├─ To: Darker gray (#D0D0D0), moved up 1px
├─ Duration: 0.3s
└─ Effect: Subtle lift

CLOSE (×) BUTTON:
├─ From: Light gray background
├─ To: Gray background, darker text
├─ Duration: 0.2s
└─ Effect: Highlight on hover
```

### 3. Modal Closing

```
STEP 1: User clicks close
├─ Button shows active state (pressed)
└─ Triggers close function

STEP 2: Cleanup (instant)
├─ State updated
├─ Component re-renders
└─ Modal removed from DOM

TOTAL TIME: Instant
RESULT: Modal disappears, overlay fades
```

---

## Responsive Layouts

### Desktop (1201px and above)

```
┌─ Modal: 95% width, max 900px
│
├─ Grid: 3 columns
│  └─ Each field gets 1/3 width
│
├─ Gap: 25px between fields
│
├─ Header: 25px padding
├─ Body: 30px padding  
├─ Footer: 20px padding
│
└─ Buttons: Horizontal, side-by-side

        DESKTOP LAYOUT (3-Column)
    ┌───────────┬───────────┬───────────┐
    │ Field 1   │ Field 2   │ Field 3   │
    ├───────────┼───────────┼───────────┤
    │ Field 4   │ Field 5   │ Field 6   │
    ├───────────┼───────────┼───────────┤
    │ Field 7   │ Field 8   │ Field 9   │
    ├───────────────────────────────────┤
    │ Comments (Full Width)             │
    └───────────────────────────────────┘
```

### Tablet (769px - 1200px)

```
┌─ Modal: 98% width
│
├─ Grid: Can be 2-3 columns (auto-fit)
│  └─ Responsive based on content
│
├─ Gap: 20px between fields
│
├─ Header: 20px padding
├─ Body: 20px padding
├─ Footer: 15px padding
│
└─ Buttons: Horizontal on larger tablets,
            Vertical on smaller tablets

        TABLET LAYOUT (2-Column)
    ┌──────────────┬──────────────┐
    │ Field 1      │ Field 2      │
    ├──────────────┼──────────────┤
    │ Field 3      │ Field 4      │
    ├──────────────┴──────────────┤
    │ Comments (Full Width)        │
    └──────────────────────────────┘
```

### Mobile (481px - 768px)

```
┌─ Modal: 98% width
│
├─ Grid: 1 column (single)
│  └─ Each field takes full width
│
├─ Gap: 18px between fields
│
├─ Header: 20px padding
├─ Body: 20px padding
├─ Footer: 15px padding, vertical buttons
│
└─ Buttons: Stacked vertically, full-width

        MOBILE LAYOUT (1-Column)
    ┌──────────────────┐
    │ Field 1          │
    ├──────────────────┤
    │ Field 2          │
    ├──────────────────┤
    │ Field 3          │
    ├──────────────────┤
    │ Field 4          │
    ├──────────────────┤
    │ Comments         │
    ├──────────────────┤
    │ [✎ Edit]         │
    │ [Close]          │
    └──────────────────┘
```

### Small Mobile (≤480px)

```
┌─ Modal: 99% width
│
├─ Grid: 1 column
│
├─ Gap: 15px (reduced)
│
├─ Padding: 15-20px (reduced)
│
├─ Font: Smaller (12-13px)
│
└─ Close button: 28px (from 32px)

        SMALL MOBILE (Ultra Responsive)
    ┌────────────┐
    │ Field 1    │
    ├────────────┤
    │ Field 2    │
    ├────────────┤
    │ Comments   │
    ├────────────┤
    │ [✎ Edit]   │
    │ [Close]    │
    └────────────┘
```

---

## Status Badge Styles

### Active Status (Green)
```
┌──────────────┐
│ ● Active     │  Color: Green (#22C55E or similar)
└──────────────┘  Padding: 6px 12px
                  Border-radius: 20px
                  Font-weight: 600
```

### Matured Status (Orange)
```
┌──────────────┐
│ ● Matured    │  Color: Orange (#F97316 or similar)
└──────────────┘  Padding: 6px 12px
                  Border-radius: 20px
                  Font-weight: 600
```

### Closed Status (Red)
```
┌──────────────┐
│ ● Closed     │  Color: Red (#DC2626 or similar)
└──────────────┘  Padding: 6px 12px
                  Border-radius: 20px
                  Font-weight: 600
```

---

## Field Value Examples

```
┌─ Text Field
│  ├─ Bank: HDFC Bank
│  ├─ Account Holder: John Doe
│  └─ Background: #F9F9F9, Left Border: #667EEA
│
├─ Currency Field
│  ├─ Format: ₹500,000
│  ├─ Includes: ₹ symbol, comma separators
│  └─ Right-aligned (optional)
│
├─ Date Field
│  ├─ Format: 01/01/2024
│  ├─ Locale: en-IN format
│  └─ Handles: Null/undefined as "N/A"
│
├─ Percentage Field
│  ├─ Format: 7.5%
│  ├─ Precision: 2 decimal places
│  └─ Includes: % symbol
│
├─ Status Field
│  ├─ Format: Color-coded badge
│  ├─ Values: Active/Matured/Closed
│  └─ Visual: Badge with dot indicator
│
└─ Textarea Field
   ├─ Format: Multi-line text
   ├─ Height: Min 80px
   ├─ White-space: pre-wrap (preserves formatting)
   └─ Comments example:
      "FD opened for retirement
       Considering reinvestment"
```

---

## Interaction Flow Diagram

```
┌─────────────────┐
│ Deposits Table  │
└────────┬────────┘
         │
         ├─ Click on row
         │  └─ Modal opens (fade + slide)
         │
         ├─ View all details
         │  └─ Read-only format
         │
         ├─ Close Options:
         │  ├─ Click × button ──┐
         │  ├─ Click overlay    ├─── Modal Closes
         │  └─ Click Close btn  ┘
         │
         └─ Edit Option:
            ├─ Click "✎ Edit"
            ├─ Modal closes
            └─ Edit form opens
```

---

## Accessibility Features Visual

```
┌──────────────────────────────────────┐
│ Keyboard Navigation                  │
├──────────────────────────────────────┤
│ TAB      → Focus next button         │
│ SHIFT+TAB → Focus previous button    │
│ ENTER    → Activate focused button   │
│ SPACE    → Activate focused button   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Visual Indicators                    │
├──────────────────────────────────────┤
│ Focus: Blue outline (2px)            │
│ Hover: Background color change       │
│ Active: Button pressed appearance    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Color Contrast (WCAG AA)             │
├──────────────────────────────────────┤
│ Text on White: 4.5:1 ratio           │
│ Buttons: 3:1 ratio minimum           │
│ Status: Color + Symbol               │
└──────────────────────────────────────┘
```

---

## Error Handling Visual

```
Missing Value:
┌─────────────────────────────────┐
│ Comments                         │
│ ┌─────────────────────────────┐ │
│ │ No comments                 │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

Invalid/Null Currency:
┌─────────────────────────────────┐
│ Interest Amount (₹)             │
│ ┌─────────────────────────────┐ │
│ │ N/A                         │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

Invalid Date:
┌─────────────────────────────────┐
│ Start Date                      │
│ ┌─────────────────────────────┐ │
│ │ N/A                         │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## Size Reference

```
Desktop Modal:
├─ Width: 95% of screen (max 900px)
├─ Height: max 85vh (85% of viewport height)
├─ Min Width: 700px (minimum for readability)
└─ Typical Size: 850px × 600px

Field Values:
├─ Font Size: 15px
├─ Padding: 12px 15px
├─ Min Height: auto
└─ Border-left: 3px

Buttons:
├─ Font Size: 14px
├─ Padding: 12px 24px
├─ Min Width: 100px
├─ Border-radius: 8px
└─ Gap between: 12px

Text:
├─ Labels: 12px (uppercase)
├─ Values: 15px
├─ Title: 22px (desktop)
└─ Mobile Title: 16px
```

---

**Status: ✅ VISUAL DESIGN COMPLETE**

All layouts tested and optimized for user experience.
