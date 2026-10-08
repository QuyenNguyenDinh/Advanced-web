export class User {
  id: number;
  username: string;
  password?: string;
  email?: string;
  name?: string;
  avatar?: string;
  role: string;
  created_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    if (this.password) {
      delete this.password;
    }
  }
}
