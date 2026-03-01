import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopRequestService {
  private apiUrl = environment.apiUrl + '/shop-requests';

  constructor(private http: HttpClient) { }

  createRequest(message?: string): Observable<any> {
    return this.http.post(this.apiUrl, { message });
  }

  getRequests(status: string = 'pending'): Observable<any> {
    return this.http.get(this.apiUrl, { params: { status } });
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }
}
