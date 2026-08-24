---
name: Academic Elite
colors:
  surface: '#f9f9ff'
  surface-dim: '#cadaff'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8edff'
  surface-container-high: '#e0e8ff'
  surface-container-highest: '#d7e2ff'
  on-surface: '#041b3c'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3052'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#dee0e2'
  on-secondary-container: '#606365'
  tertiary: '#7b2600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a33500'
  on-tertiary-container: '#ffc6b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#e1e2e4'
  secondary-fixed-dim: '#c5c6c8'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#f9f9ff'
  on-background: '#041b3c'
  surface-variant: '#d7e2ff'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  card-gap: 12px
---

## Brand & Style

This design system is engineered for a premium teacher-centric mobile experience, prioritizing clarity, professional authority, and cognitive ease. The aesthetic sits at the intersection of **Corporate Modern** and **Minimalism**, utilizing generous whitespace and a sophisticated "elevated flat" approach to reduce the administrative burden felt by educators. 

The emotional response should be one of calm reliability and premium quality. By using a restricted palette and structured layouts, the interface recedes to let student data and curriculum content take center stage, while the soft, tactile elements make the digital environment feel approachable and high-end.

## Colors

The palette is anchored by a deep **Premium Blue**, representing institutional trust and intelligence. 

- **Primary**: Used for key actions, active states, and branding.
- **Secondary/Background**: A very light gray creates a soft canvas that reduces eye strain during long grading sessions compared to pure white.
- **Surface**: Pure white is reserved for cards and interactive containers to create clear physical separation from the background.
- **Semantic Palette**: Standardized success (Green), warning (Orange), and danger (Red) tones are used strictly for status indicators (attendance, grade thresholds, urgent alerts) to maintain their cognitive impact.

## Typography

The design system utilizes **Inter** for its exceptional legibility on mobile screens and its neutral, systematic character. 

Hierarchy is established through a dramatic scale between display headings and body text. Large headings help teachers quickly orient themselves within high-density data views (like class rosters). Use `label-md` for metadata and category headers to provide clear structure without competing with primary content. All body text should maintain a minimum of 1.4x line height to ensure readability in variable lighting conditions typical of a classroom.

## Layout & Spacing

The layout follows a strict **8px spacing system** to ensure mathematical harmony across all components. 

- **Mobile Grid**: A flexible column system with **20px side margins** and **12px gutters**.
- **Padding**: Internal card padding should default to `md` (16px) or `lg` (24px) for premium, airy feel.
- **Animations**: Transitions should feel instantaneous but fluid. Use `fast` for hover/tap states and `smooth` for page transitions or expanding cards. Use staggering for list entries to guide the teacher's eye down the roster.

## Elevation & Depth

This design system uses a **Tonal Layering** approach combined with **Soft Ambient Shadows**. 

1. **Level 0 (Background)**: `#F4F5F7` - The base of the application.
2. **Level 1 (Cards/Floating Elements)**: `#FFFFFF` - Accompanied by a very soft, diffused shadow: `0px 4px 12px rgba(0, 0, 0, 0.05)`. 
3. **Level 2 (Active/Modal)**: `#FFFFFF` - A more pronounced shadow to indicate focus: `0px 8px 24px rgba(0, 0, 0, 0.08)`.

Avoid harsh borders. Depth is primarily communicated through the contrast between the white surface and the gray background, using shadows only to signify interactable containers.

## Shapes

The shape language is defined by **Large Rounded Corners**, evoking a friendly yet professional "app-centric" feel. 

- **Cards**: Utilize a `16px` radius to reinforce the premium, modern aesthetic.
- **Buttons & Inputs**: Use a slightly tighter `12px` radius for a more precise, functional appearance.
- **Interactive States**: Selection indicators should follow the radius of their parent container.

## Components

- **Cards**: The primary container for student profiles, class summaries, and assignments. Always use White background with 16px corner radius and soft shadows.
- **Buttons**:
    - *Primary*: Solid Primary Blue, white text, 12px radius.
    - *Secondary*: Transparent background with Primary Blue border or light blue tint.
- **Input Fields**: Soft Gray background (one shade darker than the canvas) or White with a subtle border. Focused state uses a 2px Primary Blue border.
- **Chips**: Use for status (e.g., "Present", "Excused", "Late"). Use high-transparency versions of semantic colors (e.g., light green background with dark green text) for a refined look.
- **Lists**: Clean, divider-less lists using spacing to separate items. Each list item should have a subtle touch-state highlight.
- **Iconography**: Use consistent **24px line icons** (2px stroke width). Icons should be monochromatic (Neutral color) unless they represent a specific semantic state.
- **Progress Indicators**: Use thin, rounded bars for grade distributions or curriculum completion to maintain the sophisticated aesthetic.