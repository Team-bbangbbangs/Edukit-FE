class TokenStore {
  private token: string | null = null;
  private isAdmin: boolean | null = null;
  private listeners: Set<(token: string | null, isAdmin: boolean | null) => void> = new Set();

  getToken(): string | null {
    return this.token;
  }

  getIsAdmin(): boolean | null {
    return this.isAdmin;
  }

  setToken(token: string | null, isAdmin: boolean | null = null): void {
    this.token = token;
    this.isAdmin = isAdmin;
    this.notifyListeners();
  }

  clearToken(): void {
    this.token = null;
    this.isAdmin = null;
    this.notifyListeners();
  }

  subscribe(listener: (token: string | null, isAdmin: boolean | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.token, this.isAdmin));
  }
}

export const tokenStore = new TokenStore();
