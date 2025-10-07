import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Address { line: string }
export interface RegisterPayload {
  name: string; email: string; phone: string; password: string; address?: Address;
}
export interface LoginPayload { email: string; password: string; }
export interface AuthResponse {
  id: number; name: string; email: string; role: 'USER'|'ADMIN';
  token?: string;        // preferred
  jwt?: string;          // fallback header/body name
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiUrl;
  private _user = signal<AuthResponse | null>(this.loadUser());
  user = this._user;

  constructor(private http: HttpClient) {}

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem('bh_user');
    return raw ? JSON.parse(raw) as AuthResponse : null;
  }

  private persistUser(u: AuthResponse | null) {
    if (u) localStorage.setItem('bh_user', JSON.stringify(u));
    else localStorage.removeItem('bh_user');
  }

  private persistToken(token?: string | null) {
    if (token) localStorage.setItem('bh_token', token);
    else localStorage.removeItem('bh_token');
  }

  token(): string | null { return localStorage.getItem('bh_token'); }
  isLoggedIn() { return !!this.token(); }
  role() { return this._user()?.role || null; }

  private extractTokenFromResponse<T>(res: HttpResponse<T & Partial<AuthResponse>>): string | null {
    const body: any = res.body || {};
    const bodyToken = body.token || body.jwt;
    if (typeof bodyToken === 'string' && bodyToken.trim()) return bodyToken.trim();

    const authHeader = res.headers.get('Authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      return authHeader.substring(7).trim();
    }
    return null;
  }

  async register(payload: RegisterPayload): Promise<void> {
    const res = await this.http
      .post<AuthResponse>(`${this.base}/auth/register`, payload, { observe: 'response' })
      .toPromise();

    if (!res || !res.body) throw new Error('No response');

    const token = this.extractTokenFromResponse(res);
    const { id, name, email, role } = res.body;
    const user: AuthResponse = { id, name, email, role };

    this._user.set(user);
    this.persistUser(user);
    this.persistToken(token);
  }

  async login(payload: LoginPayload): Promise<void> {
    const res = await this.http
      .post<AuthResponse>(`${this.base}/auth/login`, payload, { observe: 'response' })
      .toPromise();

    if (!res || !res.body) throw new Error('No response');

    const token = this.extractTokenFromResponse(res);
    const { id, name, email, role } = res.body;
    const user: AuthResponse = { id, name, email, role };

    this._user.set(user);
    this.persistUser(user);
    this.persistToken(token);
  }

  async me(): Promise<void> {
    if (!this.token()) return;
    const res = await this.http.get<AuthResponse>(`${this.base}/auth/me`, { observe: 'response' }).toPromise();
    if (res?.body) {
      const { id, name, email, role } = res.body;
      const user: AuthResponse = { id, name, email, role };
      this._user.set(user);
      this.persistUser(user);
      const token = this.extractTokenFromResponse(res as HttpResponse<any>);
      if (token) this.persistToken(token);
    }
  }

  logout() {
    this.persistToken(null);
    this.persistUser(null);
    this._user.set(null);
  }
}
