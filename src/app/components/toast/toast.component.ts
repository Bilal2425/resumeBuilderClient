import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 2000">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="modern-toast glass-card animate-slide-in mb-3 d-flex align-items-center"
          [class]="toast.type"
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true">
          
          <div class="toast-icon me-3">
            @switch (toast.type) {
              @case ('success') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              }
              @case ('danger') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              }
              @default {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              }
            }
          </div>
          
          <div class="toast-content flex-grow-1 me-3">
            <p class="mb-0 fw-semibold small">{{ toast.message }}</p>
          </div>

          <button type="button" class="btn-close btn-close-white ms-auto" (click)="toastService.remove(toast.id)" aria-label="Close"></button>
        </div>
      }
    </div>
  `,
  styles: `
    .modern-toast {
      min-width: 300px;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .modern-toast.success { background: rgba(16, 185, 129, 0.9); border-color: rgba(16, 185, 129, 0.2); }
    .modern-toast.danger { background: rgba(239, 68, 68, 0.9); border-color: rgba(239, 68, 68, 0.2); }
    .modern-toast.info { background: rgba(14, 165, 233, 0.9); border-color: rgba(14, 165, 233, 0.2); }
    .modern-toast.warning { background: rgba(245, 158, 11, 0.9); border-color: rgba(245, 158, 11, 0.2); }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-sm);
    }

    .animate-slide-in {
      animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .btn-close {
      filter: brightness(0) invert(1);
      font-size: 0.75rem;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .btn-close:hover { opacity: 1; }
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
