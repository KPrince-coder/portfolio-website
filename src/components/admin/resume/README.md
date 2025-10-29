# Resume Admin Management

Comprehensive admin interface for managing resume data including work experiences, education, and certifications.

## Structure

```
resume/
├── hooks/
│   ├── useWorkExperiences.ts    # Work experience CRUD operations
│   ├── useEducation.ts          # Education CRUD operations
│   ├── useCertifications.ts     # Certifications CRUD operations
│   └── index.ts                 # Hooks barrel export
├── sections/
│   ├── ResumeHeaderSection.tsx  # Resume title & description
│   ├── WorkExperiencesSection.tsx # Work experiences management
│   ├── EducationSection.tsx     # Education management
│   ├── CertificationsSection.tsx # Certifications management
│   └── index.ts                 # Sections barrel export
├── types.ts                     # TypeScript type definitions
├── WorkExperienceForm.tsx       # Work experience form
├── EducationForm.tsx            # Education form
├── CertificationForm.tsx        # Certification form
├── WorkExperiencesList.tsx      # Work experiences list
├── EducationList.tsx            # Education list
├── CertificationsList.tsx       # Certifications list
├── ResumeManagement.tsx         # Main management component
├── ResumeManagementRouter.tsx   # Router for resume management
├── index.ts                     # Module barrel export
└── README.md                    # This file
```

## Features

### Work Experiences

- Add/Edit/Delete work experiences
- Track current position
- Multiple achievements per role
- Employment type selection
- Date validation (end date cannot be before start date)
- Featured and visibility toggles
- Display order management

### Education

- Add/Edit/Delete education records
- GPA and grade tracking
- Multiple activities per education
- Date validation
- Display order management

### Certifications

- Add/Edit/Delete certifications
- Expiration tracking
- Credential verification URLs
- Does not expire option
- Display order management

### Resume Header

- Customizable resume title and description
- Quick stats (years of experience, projects completed, technologies mastered)
- Toggle to show/hide stats section

## Usage

```tsx
import { ResumeManagement } from "@/components/admin/resume";

function AdminPage() {
  return <ResumeManagement />;
}
```

## Database Tables

- `resume_work_experiences` - Professional work history
- `resume_education` - Academic background
- `resume_certifications` - Professional credentials
- `profiles` - Extended with resume stats fields

## Type Safety

All components are fully typed with TypeScript. See `types.ts` for complete type definitions.

## Hooks

### useWorkExperiences

```tsx
const {
  experiences,
  loading,
  error,
  createExperience,
  updateExperience,
  deleteExperience,
  refetch
} = useWorkExperiences();
```

### useEducation

```tsx
const {
  education,
  loading,
  error,
  createEducation,
  updateEducation,
  deleteEducation,
  refetch
} = useEducation();
```

### useCertifications

```tsx
const {
  certifications,
  loading,
  error,
  createCertification,
  updateCertification,
  deleteCertification,
  refetch
} = useCertifications();
```

## Best Practices

- All forms include validation
- Date fields prevent invalid date ranges
- Achievements and activities use array management
- Consistent error handling across all operations
- Loading states for better UX
- Confirmation dialogs for destructive actions
