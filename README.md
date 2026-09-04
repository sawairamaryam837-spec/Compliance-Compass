# Compliance Compass

1. CRITICAL REQUIREMENT — EVERYTHING MUST BE CLICKABLE

This is extremely important.

Do not create static UI mockups.

Every visible interactive element must work.

Make sure:

Navbar links work

Sidebar links work

Dashboard cards work

KPI cards navigate to relevant pages

Charts support useful interactions where appropriate

Buttons perform real actions

"View all" links work

Table rows open their corresponding detail pages

Status filters work

Search works

Notifications open

User profile menu works

Settings links work

Footer links work

CTA buttons work

Report Concern works

Sign in buttons work

Forms submit correctly

Back buttons work

Breadcrumbs work

Tabs work

Dropdowns work

Modals/dialogs work

Pagination works where needed

Empty states contain useful actions

Error states contain recovery actions

There must be no dead links or placeholder buttons.

If a destination does not yet exist, create the required route/page instead of leaving a broken link.

2. PREMIUM ENTERPRISE UI/UX

The application should look like a high-end enterprise SaaS product used by:

Corporate Compliance Teams

HR Departments

Legal Teams

Internal Audit

Risk Management

Enterprise Security Teams

It should NOT look like a generic admin dashboard.

Design direction:

Premium

Clean

Executive-level

Trustworthy

Modern

Professional

Minimal but powerful

Excellent whitespace

Strong visual hierarchy

Consistent spacing

Consistent components

Responsive

Accessible

Production-ready

Use subtle animations only where they improve usability.

Avoid excessive gradients, excessive shadows, unnecessary animations and overly decorative UI.

3. DESIGN SYSTEM

Preserve the existing design system and improve it where necessary.

Colors

Background: #F7F8FA

Surface: #FFFFFF

Primary: #172033

Secondary Text: #475569

Accent / Action: #2563EB

Success: #16A34A

Warning: #D97706

Danger / Critical: #DC2626

Border: #E2E8F0

Typography

Use:

Inter → body, navigation, tables, forms

Manrope → headings, KPI values and major numbers

Use a strong hierarchy:

Page title

Section title

Card title

Body

Secondary metadata

Small labels

Components

Use:

12–16px border radius

subtle borders

very soft shadows

professional badges

consistent Lucide icons

proper hover states

proper active states

visible focus states

disabled states

loading states

4. LANDING PAGE — MATCH THE PROVIDED REFERENCE

Use the uploaded navigation and footer references as the visual direction.

The landing page should have the same premium feel as the references:

Header

Left:

Compliance Compass logo + brand name

Center/right:

Features

Solutions

Resources

About

Contact

Right:

Theme toggle

Sign in with Google Workspace

Make every item clickable.

Navbar should:

remain responsive

collapse properly on mobile

have active/hover states

use smooth scrolling where appropriate

navigate to actual pages/sections

5. HERO SECTION

Create a premium hero similar to the provided reference.

Main headline:

Every concern, investigation and risk — on one auditable record.

Supporting text:

Compliance Compass gives compliance teams a single governed workflow from the moment a concern is raised to the moment it is closed, with database-enforced access control and a complete audit trail.

Primary CTA:

Sign in with Google Workspace →

Secondary CTA:

Report a Concern

Both must work.

Include:

enterprise security indicator

role-based access

complete audit trail

dashboard/product preview

The dashboard preview should feel like a real enterprise application, not a static image.

6. LANDING PAGE FEATURE CARDS

Create premium feature cards:

Intake & Case Management

Capture concerns from any channel and track them with structured workflows.

Click → /complaints

Investigations

Assign, investigate and document findings with clear timelines and accountability.

Click → /investigations

Risk Management

Identify, assess and mitigate risks across your organization.

Click → /risks

Audit & Compliance

Complete audit trail, reports and role-based access control.

Click → /audit-logs

Cards should have:

icon

title

description

hover animation

clickable area

correct navigation

7. GLOBAL APPLICATION SHELL

Complete and polish the authenticated application shell.

Sidebar

Include:

Dashboard

Complaints

Investigations

Evidence

Risk Assessment

Departments

Users & Roles

Audit Logs

Analytics & Reports

Notifications

Settings

Each item must navigate to a real route.

Sidebar requirements:

expanded state

collapsed state

mobile drawer

active route

hover state

keyboard accessible

role-based visibility

notification badge

tooltips in collapsed mode

Do not show pages to roles that should not access them.

8. TOP NAVIGATION

Create a premium top bar containing:

Global Search

Search across:

complaints

investigations

risks

users

departments

Search results should be clickable.

Notifications

Click → /notifications

Display unread count.

Help

Open useful help/support interface.

User Avatar

Dropdown:

Profile

Organization

Settings

Sign out

Role Indicator

Display current user's role.

Organization

Display current workspace/organization.

9. EXECUTIVE DASHBOARD

Create a highly polished executive dashboard.

Top section:

Executive Overview

Include:

KPI Cards

Compliance Score

Total Complaints

Open Cases

Open Investigations

High Risks

Closed This Month

Every KPI card should be clickable and navigate to its relevant filtered page.

Example:

Total Complaints → /complaints

Open Investigations → /investigations?status=open

High Risks → /risks?level=high

10. DASHBOARD ANALYTICS

Include premium cards for:

Complaints by Status

Donut chart:

Open

In Progress

Under Review

Closed

Clicking a segment should navigate/filter complaints.

Risks by Level

Chart:

Critical

High

Medium

Low

Clicking a level should filter risks.

Recent Activity

Show:

new complaint

investigation assigned

risk updated

evidence uploaded

status changes

Each activity item should be clickable.

My Tasks

Show:

Review complaint

Approve investigation plan

Review risk assessment

Upload evidence

Complete assigned task

Every task should open its relevant record.

11. COMPLAINTS MODULE

Complete the complaints system.

Route:

/complaints

Features:

search

filters

status filter

priority filter

category filter

department filter

date filter

pagination

sorting

create complaint

table/list view

Each complaint row must be clickable.

Create:

/complaints/:id

Complaint detail should contain:

case reference

title

description

reporter

department

category

priority

status

assigned investigator

timestamps

timeline

investigation notes

evidence

comments

audit history

12. REPORT A CONCERN

Create a polished complaint intake page.

Fields:

Concern title

Description

Category

Department

Priority

Related people

Date

Attachments/evidence

Include:

validation

loading state

success state

error state

confirmation

audit logging

After submission:

→ create complaint

→ generate case reference

→ notify appropriate staff

→ record audit event

→ redirect to complaint detail

Preserve existing backend security.

13. INVESTIGATIONS

Create:

/investigations

Include:

investigation list

search

filters

status

priority

investigator

department

date

Create:

/investigations/:id

Include:

investigation overview

linked complaint

assigned investigator

investigation status

timeline

findings

notes

evidence

actions

audit history

Actions must respect existing role permissions.

14. EVIDENCE

Create:

/evidence

Support the existing private storage bucket and security model.

Features:

upload

download

preview where supported

file metadata

uploader

upload date

linked complaint/investigation

access history

Every evidence access must respect existing RLS/storage policies and access logging.

Do not weaken security to make uploads work.

15. RISK REGISTER

Create:

/risks

Features:

risk register

search

filters

risk level

department

owner

status

sorting

Risk detail:

/risks/:id

Include:

risk title

description

department

owner

likelihood

impact

computed risk score

risk level

mitigation plan

review date

status

audit history

Risk colors must be professional:

Critical → red

High → orange

Medium → amber

Low → green/blue

16. DEPARTMENTS

Create:

/departments

Include:

department cards/table

department name

manager

employee count

open complaints

open risks

Click department → department detail.

17. USERS & ROLES

Create:

/users

Show:

user

email

department

role

status

last activity

Create user detail/profile.

Role changes must use the existing backend role/security logic.

Never allow a user to change their own privileged role.

Do not bypass existing security.

18. NOTIFICATIONS

Create:

/notifications

Features:

unread

read

mark as read

mark all as read

notification filters

Clicking notification should navigate to the related complaint, investigation, risk or task.

19. AUDIT LOG

Create:

/audit-logs

Premium enterprise audit table:

Columns:

timestamp

user

action

entity

entity ID

department

IP/device metadata if already available

result

Features:

search

filters

date range

action filter

user filter

entity filter

pagination

Respect existing role restrictions.

20. ANALYTICS & REPORTS

Create:

/analytics

Include:

compliance trends

complaint trends

investigation trends

risk trends

department comparison

closure rate

average resolution time

audit activity

Use clean enterprise charts.

Include:

Export Report

If backend/export functionality is available, make it functional. Otherwise create a proper UI flow without pretending an export succeeded.

21. SETTINGS

Create:

/settings

Sections:

Organization

organization name

settings

Security

authentication

SSO status

access settings

Notifications

notification preferences

Appearance

theme

Permissions

Only show role-appropriate settings.

Never expose privileged controls to unauthorized users.

22. AUTHENTICATION

Preserve existing authentication implementation.

Support:

Google Workspace SSO

email/password if already configured

sign in

sign out

session handling

loading state

authentication errors

Complete the authenticated route gate.

Unauthenticated users should not access protected application routes.

Do not modify or weaken the existing RLS/security architecture.

23. ROUTING

Ensure every route actually exists.

Suggested routes:

/

 /signin

 /dashboard

 /complaints

 /complaints/new

 /complaints/:id

 /investigations

 /investigations/:id

 /evidence

 /risks

 /risks/:id

 /departments

 /departments/:id

 /users

 /users/:id

 /audit-logs

 /analytics

 /notifications

 /settings

Use the project's existing routing architecture.

Do not introduce conflicting route patterns.

24. FOOTER — MATCH PROVIDED REFERENCE

Redesign the footer based on the provided footer reference.

Create four major columns:

Platform

Dashboard

Complaints

Investigations

Risks

Evidence

Reports

Audit Log

Notifications

Solutions

Compliance Teams

Legal & Risk

Internal Audit

HR & People Ops

Regulated Industries

Resources

Documentation

Help Center

Guides & Tutorials

Templates

Compliance Library

API Reference

Company

About Us

Security

Careers

Partners

Contact Us

Status

Every footer link must be clickable.

If a page does not exist, create it or route it to the appropriate existing page.

25. FOOTER LOWER SECTION

Include:

© 2026 Compliance Compass

All rights reserved.

Trust badges:

SOC 2 Compliant

GDPR Ready

ISO 27001 Aligned

Encrypted End to End

Social icons:

LinkedIn

X/Twitter

Website/Globe

Newsletter:

Stay updated

Get the latest updates, product news and compliance insights.

Input:

Enter your work email

Button:

Subscribe →

Implement proper validation and success/error states.

26. RESPONSIVE DESIGN

The entire application must work perfectly on:

Desktop

full sidebar

full dashboard

multi-column layouts

Tablet

compact navigation

responsive cards

responsive tables

Mobile

hamburger menu

mobile sidebar drawer

stacked KPI cards

horizontally scrollable tables where necessary

responsive charts

responsive forms

responsive footer

no horizontal page overflow

Test all major pages at mobile width.

27. LOADING / EMPTY / ERROR / PERMISSION STATES

Every page must have proper:

Loading

Use professional skeleton loaders.

Empty

Example:

No complaints found.

With useful CTA:

Create Complaint

Error

Show:

Something went wrong.

Button:

Try Again

Permission

Show:

You don't have permission to access this resource.

Do not expose restricted information.

28. SECURITY — DO NOT CHANGE

This is critical.

Preserve the existing:

RLS

role hierarchy

permissions

role guards

complaint visibility rules

evidence restrictions

audit logging

workflow guards

SSO role mapping

self-role-change protection

storage policies

Never solve a frontend permission problem by weakening backend security.

Frontend role filtering is only for UX. Backend authorization remains the source of truth.

29. DATABASE / BACKEND

Do not recreate existing tables.

Do not delete demo data.

Do not replace existing backend architecture.

Only create additional migrations/functions if absolutely required for an existing frontend feature, and keep them secure.

Use the existing database schema and APIs.

30. MICRO-INTERACTIONS

Use subtle professional interactions:

card hover

button hover

active navigation

smooth dropdowns

modal transitions

toast notifications

skeleton loading

subtle page transitions

Avoid flashy animations.

31. ACCESSIBILITY

Implement:

semantic HTML

keyboard navigation

visible focus states

accessible buttons

accessible forms

ARIA labels where required

sufficient contrast

screen-reader-friendly navigation

proper heading hierarchy

32. FINAL QUALITY PASS

Before considering the work complete, inspect the entire application.

Check:

Navigation

Every sidebar item works

Every navbar item works

Every footer item works

Every CTA works

No broken routes

Pages

Dashboard

Complaints

Investigations

Evidence

Risks

Departments

Users

Audit Logs

Analytics

Notifications

Settings

Functionality

Search

Filters

Forms

CRUD where permitted

Authentication

Notifications

Evidence

Status changes

Role restrictions

Audit logging

UI

Desktop

Tablet

Mobile

Loading states

Empty states

Error states

Permission states

Technical

TypeScript errors fixed

Route errors fixed

Console errors fixed

Broken imports fixed

Broken links fixed

No duplicate components

No placeholder pages

No fake functionality presented as completed

33. MOST IMPORTANT IMPLEMENTATION RULE

Do not stop after designing the pages.

Build the complete connected application.

For example:

Dashboard

   ↓

Complaint KPI

   ↓

Complaints

   ↓

Complaint Detail

   ↓

Investigation

   ↓

Evidence

   ↓

Audit Log

And:

Dashboard

   ↓

High Risks

   ↓

Risk Register

   ↓

Risk Detail

   ↓

Mitigation

   ↓

Audit Log

Everything should feel like one connected enterprise platform, not separate demo pages.

34. FINAL INSTRUCTION TO LOVABLE

Start by reviewing the existing implementation and current route structure.

Then continue from the exact point where the previous build stopped.

Do not start over.

Do not create a separate project.

Do not remove working features.

Do not weaken security.

Do not use static mockups where functional UI is required.

Use the provided navigation.png and footer.png as visual references for the landing page navigation and footer.

The final result should feel like a $50k–$100k enterprise SaaS product, with polished UX, real navigation, real interactions, secure role-based access and a consistent Compliance Compass design system.

Complete the implementation end-to-end and verify that there are zero broken navigation links or unfinished placeholder pages before stopping.




## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
