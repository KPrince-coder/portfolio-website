# Skills Management System

This folder contains the complete skills management system for the admin panel.

## Structure

```
skills/
├── sections/              # Individual section components
│   ├── SkillsHeaderSection.tsx      # Manage skills section title/description
│   ├── SkillsCategoriesSection.tsx  # Manage skill categories
│   ├── SkillsListSection.tsx        # Manage individual skills
│   └── LearningGoalsSection.tsx     # Manage learning goals
├── hooks/                 # Custom hooks for data management
│   ├── useSkills.ts
│   ├── useSkillCategories.ts
│   └── useLearningGoals.ts
├── SkillsManagementRouter.tsx  # Routes to different sections
├── SkillsList.tsx         # Skills list component
├── SkillForm.tsx          # Skill form component
├── LearningGoalsList.tsx  # Learning goals list component
├── LearningGoalForm.tsx   # Learning goal form component
└── types.ts               # TypeScript types
```

## Sub-Tabs

The skills management is divided into 4 sub-tabs:

1. **Skills Header** (`skills-header`) - Customize the section title and description
2. **Categories** (`skills-categories`) - Manage skill category labels
3. **Skills** (`skills-list`) - Add, edit, and delete individual skills
4. **Learning Goals** (`skills-goals`) - Manage learning goals and their status

## Usage

The `SkillsManagementRouter` component handles routing between different sections based on the active sub-tab passed from the Admin page.

```tsx
<SkillsManagementRouter activeSubTab={activeTab} />
```
