import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ShopService } from '../services/shop.service';

export const shopInterceptor: HttpInterceptorFn = (req, next) => {
    const shopService = inject(ShopService);
    const shopId = shopService.activeShopId;

    // Only attach header if we have a shopId and it's a shop-specific API call
    if (shopId && /\/shop(\/|$)/.test(req.url)) {
        req = req.clone({
            setHeaders: {
                'X-Shop-Id': shopId
            }
        });
    }

    return next(req);
};
