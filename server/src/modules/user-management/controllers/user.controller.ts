import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { AppError } from '../../../shared/middleware/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    console.log('Registration request received:', { email, firstName, lastName, role }); // Debug log
    
    const userRepository = getRepository(User);

    // Validate role with strict checking
    if (!role) {
      console.log('Role is missing in request'); // Debug log
      return next(new AppError(400, 'Role is required'));
    }
    
    if (role !== 'ADMIN' && role !== 'USER') {
      console.log('Invalid role received:', role); // Debug log
      return next(new AppError(400, 'Invalid role specified. Role must be either ADMIN or USER'));
    }

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError(400, 'User already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object with explicit role setting
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role as 'ADMIN' | 'USER' // Explicitly type cast the role
    };
    
    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' }); // Debug log
    
    const user = userRepository.create(userData);
    console.log('User object created:', { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }); // Debug log

    // Save the user and immediately fetch it back to verify
    const savedUser = await userRepository.save(user);
    console.log('User saved to database:', { 
      id: savedUser.id, 
      email: savedUser.email, 
      role: savedUser.role 
    }); // Debug log

    // Verify the saved user
    const verifiedUser = await userRepository.findOne({ where: { id: savedUser.id } });
    console.log('Verified user from database:', verifiedUser); // Debug log

    const token = jwt.sign(
      { id: savedUser.id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: '7d' }
    );

    if (!verifiedUser) {
      throw new Error('Failed to verify saved user');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = verifiedUser;

    res.status(201).json({
      user: userWithoutPassword,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(new AppError(500, 'Error registering user'));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email); // Debug log
    
    if (!email || !password) {
      return next(new AppError(400, 'Email and password are required'));
    }

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role'] // Explicitly select fields
    });

    if (!user) {
      console.log('User not found for email:', email); // Debug log
      return next(new AppError(401, 'Email or password is incorrect'));
    }

    console.log('Found user:', { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      hasPassword: !!user.password 
    }); // Debug log

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', isPasswordValid); // Debug log
      
      if (!isPasswordValid) {
        console.log('Invalid password for user:', email); // Debug log
        return next(new AppError(401, 'Email or password is incorrect'));
      }
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return next(new AppError(500, 'Error validating credentials'));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log('Login successful for user:', email, 'with role:', user.role); // Debug log
    res.json({ 
      user: userWithoutPassword, 
      token 
    });
  } catch (error) {
    next(new AppError(500, 'Error logging in'));
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.user.id },
      relations: ['tasks']
    });

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    res.json(user);
  } catch (error) {
    next(new AppError(500, 'Error fetching profile'));
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return next(new AppError(403, 'Access forbidden. Admin only.'));
    }

    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'] // Exclude password
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    next(new AppError(500, 'Error fetching users'));
  }
};
