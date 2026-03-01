import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopERPService } from '../../shared/services/shop-erp.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-shop-accounting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-accounting.component.html',
  styleUrl: './shop-accounting.component.css'
})
export class ShopAccountingComponent implements OnInit {
  stats: any;

  constructor(private shopERPService: ShopERPService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user?.shopId) {
        this.shopERPService.getAccountingStats(user.shopId).subscribe(res => {
          this.stats = res.data;
        });
      }
    });
  }
}
