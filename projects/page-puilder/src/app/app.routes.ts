import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/initial-state/initial-state.component')
                .then(module => module.InitialStateComponent),
    },
    {
        path: 'auth',
        children: [
            {
                path: 'signin',
                loadComponent: () =>
                    import('./pages/auth/signin/signin.component')
                        .then(module => module.SigninComponent),
            },
            {
                path: 'signup',
                loadComponent: () =>
                    import('./pages/auth/signup/signup.component')
                        .then(module => module.SignupComponent),
            },
            {
                path: 'forgot-password',
                loadComponent: () =>
                    import('./pages/auth/forgot-password/forgot-password.component')
                        .then(module => module.ForgotPasswordComponent),
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./pages/auth/reset-password/reset-password.component')
                        .then(module => module.ResetPasswordComponent),
            },
            {
                path: 'callback',
                loadComponent: () =>
                    import('./pages/auth/callback/callback.component')
                        .then(module => module.AuthCallbackComponent),
            },
        ],
    },
    {
        path: 'builder',
        loadComponent: () =>
            import('./pages/builder-layout/builder-layout.component')
                .then(module => module.BuilderLayoutComponent),
    }
];
