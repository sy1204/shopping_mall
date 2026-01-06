<!-- docs/page_improvement_plan.md -->
# UI/UX & Functional Improvement Plan
**Author**: UI/UX Director Agent
**Date**: 2026-01-04
**Status**: Critical Fixes Required

## 1. Executive Summary
The current audit reveals a **Critical Blocker** on the Shop Page (Client-side Exception), rendering the core shopping experience inaccessible. The Admin Interface is functional but lacks basic security UX (Password field) and requires visual refinement.

**Priority Order**:
1.  🔴 **Fix Shop Page Crash** (Immediate)
2.  🟡 **Enhance Admin Login** (High)
3.  🟢 **Refine Admin Dashboard & Board** (Medium)

---

## 2. Detailed Audit Findings

### A. Shop Page (`/shop`) - **CRITICAL FAIL**
*   **Status**: 🔴 Broken
*   **Issue**: "Application Error" overlay covers the screen.
*   **UX Impact**: Zero usability. Users cannot view products.
*   **Technical Diagnosis**: Likely `Hydration Mismatch` or `Image Config` issue preventing successful rendering of the Product Grid.
*   **Action Item**: 
    1.  Debug `shop/page.tsx` and `ProductCard.tsx` isolation.
    2.  Verify `next.config.js` image domains.
    3.  **Restart Server** to ensure config application.

### B. Admin Login (`/admin/login`)
*   **Status**: 🟡 Usable but Flawed
*   **Issue**: Password field is missing.
*   **UX Impact**: Confusing for administrators expecting secure login. "Unprofessional" implementation.
*   **Action Item**: Add `input type="password"` field to the login form.

### C. Admin Board (`/admin/board`)
*   **Status**: 🟢 Functional
*   **UX Review**: 
    *   Tabs (Notice/FAQ/etc) are clear.
    *   "Empty States" (Data not found) are present.
    *   **Improvement**: Add subtle hover effects on table rows. Add "Badge" for status (e.g., [Answered] vs [Pending]).

### D. Visual System (Typography & Color)
*   **Status**: 🟢 Good
*   **Review**: The transition to `bg-white` (White Background) has been successfully applied, creating a clean, editorial look consistent with the user's request.
*   **Action Item**: Maintain this strict white/black/gray palette. Avoid introducing unapproved accents.

---

## 3. Action Plan (PM Collaboration)

| Phase | Task | Owner | Priority |
| :--- | :--- | :--- | :--- |
| **Phase 1: Stabilization** | **Fix Shop Page Crash** (Debug & Server Restart) | Dev | **P0** |
| | Add Admin Password Field | Dev | P1 |
| **Phase 2: Polish** | Enhance Board Table UX (Badges, Hover) | UI/UX | P2 |
| | Verify Stats Charts Data Visualization | UI/UX | P2 |

## 4. Directive to Developer
> "Design is how it works, not just how it looks. A crashing page has **zero** design value. Prioritize the Shop Page fix immediately. Once stable, apply the security patch to the Login page." - *UI/UX Director*
