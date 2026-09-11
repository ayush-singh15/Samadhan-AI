export class UsersService {
  async getProfile(userId: string) {
    return {
      id: userId,
      name: 'Dr. Anita Sharma',
      email: 'anita@university.edu.in',
      role: 'UNIVERSITY',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export const usersService = new UsersService();
