// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { User } from '../modules/users/entities/user.entity';

interface TokenPayload {
    id?: string;
    email?: string;
    role?: 'ADMIN' | 'USER';
    firstName?: string;
    lastName?: string;
    iat?: number;
    exp?: number;
}

// The shape we expect after validation
export type UserPayload = {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER';
    firstName?: string;
    lastName?: string;
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export const generateToken = (user: User): string => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user: User): string => {
    return jwt.sign(
        { id: user.id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

// Return unknown so callers must validate before using
export const verifyToken = (token: string): unknown => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export const verifyRefreshToken = (token: string): unknown => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

// Type guard to narrow unknown -> UserPayload
function isUserPayload(p: unknown): p is UserPayload {
    if (p !== null && typeof p === 'object') {
        const obj = p as Record<string, unknown>;
        const role = obj.role as unknown;
        return (
            typeof obj.id === 'string' &&
            typeof obj.email === 'string' &&
            (role === 'ADMIN' || role === 'USER')
        );
    }
    return false;
}

// Shape of the decoded refresh token payload
export type RefreshPayload = {
    id: string;
    iat?: number;
    exp?: number;
};

// Type guard for refresh token payload
export function isRefreshPayload(p: unknown): p is RefreshPayload {
    if (p !== null && typeof p === 'object') {
        const obj = p as Record<string, unknown>;
        return typeof obj.id === 'string';
    }
    return false;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    try {
        const decoded = verifyToken(token);

        if (!isUserPayload(decoded)) {
            // token may be missing required properties or role isn't correct
            return res.status(403).json({ message: 'Invalid or malformed token payload' });
        }

        // payload validated and narrowed — assign to req.user
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
