import { Component, inject, OnInit } from '@angular/core';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Component({
    standalone: true,
    template: `
    <div class="min-h-screen bg-background flex items-center justify-center">
      <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  `
})
export class HomeComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit() {
        this.authService.initialised$.pipe(
            filter(init => init === true),
            take(1)
        ).subscribe(() => {
            const user = this.authService.currentUserValue as UserProfile | null;
            if (!user) {
                this.router.navigate(['/login']);
                return;
            }

            switch (user.role) {
                case 2: this.router.navigate(['/admin']); break;
                case 1: this.router.navigate(['/shop']); break;
                case 0: this.router.navigate(['/customer']); break;
                default: this.router.navigate(['/login']); break;
            }
        });
    }
}
