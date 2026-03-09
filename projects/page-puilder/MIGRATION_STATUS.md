# Migration Status - Moving to Core Structure

## Completed ✅

1. **Guards** → `core/guards/`
   - ✅ `auth.guard.ts` moved to `core/guards/`

2. **API** → `core/api/`
   - ✅ `auth.api.ts` moved to `core/api/`
   - ✅ `ai.api.ts` moved to `core/api/`
   - ✅ `pages.api.ts` moved to `core/api/`

3. **Models** → `core/models/`
   - ✅ Models already in `core/models/`
   - ✅ All imports updated to use `core/models/`

4. **Stores** → `core/stores/`
   - ✅ `page-builder.store.ts` moved to `core/stores/`
   - ✅ `main-store.service.ts` moved to `core/stores/`

5. **Services** → `core/services/`
   - ✅ `auth.service.ts` moved to `core/services/`
   - ⚠️ Other services still need to be moved

6. **Auth Requirement Removed**
   - ✅ Removed `authGuard` from builder route
   - ✅ Removed auth check from `initial-state.component.ts`

## Remaining Tasks

### Services to Move to `core/services/`:
- [ ] `builder.service.ts`
- [ ] `pages.service.ts`
- [ ] `page-renderer.service.ts`
- [ ] `ai-generator.service.ts`
- [ ] `event-manager.service.ts`
- [ ] `theme.service.ts`
- [ ] `page-styling.service.ts`
- [ ] `landing-page.service.ts`
- [ ] `main-store.service.ts` (duplicate - already in core/stores)

### Files to Delete:
- [ ] `app/services/auth.service.ts` (duplicate - use core/services/auth.service.ts)
- [ ] `app/store/page-builder.store.ts` (duplicate - use core/stores/page-builder.store.ts)
- [ ] `app/api/*` (duplicates - use core/api/*)

### Import Updates Needed:
All components importing from:
- `../../services/` → `../../core/services/`
- `../../../services/` → `../../../core/services/`
- `../services/` → `../core/services/`

## Import Pattern Updates

### Models
```typescript
// Old
import { Page } from '../../models/builder.models';

// New
import { Page } from '../../core/models/builder.models';
```

### Services
```typescript
// Old
import { BuilderService } from '../../services/builder.service';

// New
import { BuilderService } from '../../core/services/builder.service';
```

### API
```typescript
// Old
import { AuthApi } from '../../api/auth.api';

// New
import { AuthApi } from '../../core/api/auth.api';
```

### Guards
```typescript
// Old
import { authGuard } from '../guards/auth.guard';

// New
import { authGuard } from '../core/guards/auth.guard';
```

### Stores
```typescript
// Old
import { PageBuilderStore } from '../../store/page-builder.store';

// New
import { PageBuilderStore } from '../../core/stores/page-builder.store';
```
