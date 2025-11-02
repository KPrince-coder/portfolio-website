# Welcome to your Lovable project

## Project info

**URL**: <https://lovable.dev/projects/128c4c86-0b4a-4f20-b768-3ef35432fb4c>

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/128c4c86-0b4a-4f20-b768-3ef35432fb4c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/128c4c86-0b4a-4f20-b768-3ef35432fb4c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 📚 Documentation

All project documentation is organized in the [`docs/`](./docs) directory:

- **[Current Status](./docs/CURRENT_STATUS.md)** - Migration progress and status
- **[Migration Success](./docs/MIGRATION_SUCCESS.md)** - Profiles migration verification
- **[Profiles Migration Guide](./docs/PROFILES_MIGRATION_GUIDE.md)** - Step-by-step migration guide
- **[File Upload Guide](./docs/FILE_UPLOAD_GUIDE.md)** - Avatar and resume upload guide
- **[Migration Checklist](./docs/MIGRATION_CHECKLIST.md)** - General migration checklist

See the [docs README](./docs/README.md) for a complete index of all documentation.

## 🗄️ Database

This project uses Supabase for the backend:

- **Project ID:** `id`
- **Dashboard:** <https://supabase.com/dashboard/project/id>

### Migrations

Database migrations are located in `supabase/migrations/`:

- ✅ **Profiles** - Hero section, About section, Resume management

To apply migrations:

```bash
npx supabase link --project-ref id
npx supabase db push
```

To generate TypeScript types:

```bash
npx supabase gen types typescript --project-id id > src/integrations/supabase/types.ts
```
