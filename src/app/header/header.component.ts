import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  navigateTo(page: string): void {
    if (page === 'list') {
      this.router.navigate(['/orders']);
    } else if (page === 'create') {
      this.router.navigate(['/order-form']);
    } else if (page === 'gastos') {
      this.router.navigate(['/gastos']);
    }
  }
}
