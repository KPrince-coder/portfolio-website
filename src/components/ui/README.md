# UI Components

This folder contains reusable UI components used throughout the application.

## Custom Components

### DestructiveButton

A styled button component for destructive actions (like delete operations).

**Usage:**

```tsx
import { DestructiveButton } from "@/components/ui/destructive-button";

<DestructiveButton onClick={handleDelete}>
  <Trash2 className="w-4 h-4 mr-1" />
  Delete
</DestructiveButton>
```

### DeleteConfirmationDialog

A reusable confirmation dialog for delete actions with integrated toast notifications. This component handles the entire delete flow including confirmation, execution, and user feedback.

**Features:**

- Confirmation dialog with customizable title and item name
- Integrated toast notifications for success/error states
- Loading state during deletion
- Consistent error handling
- Accessible design

**Props:**

- `open` - Controls dialog visibility
- `onOpenChange` - Callback when dialog state changes
- `title` - Dialog title (e.g., "Delete Skill")
- `itemName` - Name of the item being deleted (shown in description and toast)
- `itemType` - Type of item (e.g., "skill", "category", "learning goal")
- `onConfirm` - Async function that performs the deletion, returns `{ error: Error | null }`

**Usage:**

```tsx
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

// Trigger deletion
const handleDeleteClick = (id: string, name: string) => {
  setItemToDelete({ id, name });
  setDeleteDialogOpen(true);
};

// Render dialog
{itemToDelete && (
  <DeleteConfirmationDialog
    open={deleteDialogOpen}
    onOpenChange={setDeleteDialogOpen}
    title="Delete Skill"
    itemName={itemToDelete.name}
    itemType="skill"
    onConfirm={async () => await deleteSkill(itemToDelete.id)}
  />
)}
```

**Benefits:**

- DRY principle - eliminates duplicate dialog and toast code
- Consistent UX across all delete operations
- Centralized error handling
- Easy to maintain and update

### IconPicker

A searchable dropdown component for selecting Lucide icons. Provides a visual preview of icons and supports real-time search filtering.

**Features:**

- Search functionality to filter through 300+ Lucide icons
- Visual icon preview in dropdown and selected value
- Consistent interface across all icon selection needs
- Type-safe with full TypeScript support

**Props:**

- `value` - Currently selected icon name
- `onValueChange` - Callback when icon selection changes
- `label` - Optional label for the picker
- `id` - Optional HTML id attribute
- `placeholder` - Optional placeholder text (default: "Select an icon")

**Usage:**

```tsx
import { IconPicker } from "@/components/ui/icon-picker";

const [iconName, setIconName] = useState("Code");

<IconPicker
  value={iconName}
  onValueChange={setIconName}
  label="Choose Icon"
  id="category-icon"
/>
```

**Benefits:**

- Reusable across skills, categories, projects, and profile sections
- Searchable interface for quick icon discovery
- Visual feedback with icon previews
- Consistent UX for all icon selections
- Eliminates hardcoded icon lists in individual components
