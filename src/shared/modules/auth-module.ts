// 认证模块示例
export interface AuthToken {
    userId: number;
    token: string;
    expiry: number;
}

export class AuthModule {
    static validateToken(token: AuthToken): boolean {
        return token.expiry > tick();
    }
}
