import { z } from 'zod';

// Schema cho đăng ký người dùng
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Họ phải có ít nhất 2 ký tự' })
    .max(50, { message: 'Họ không được vượt quá 50 ký tự' }),
  lastName: z
    .string()
    .min(2, { message: 'Tên phải có ít nhất 2 ký tự' })
    .max(50, { message: 'Tên không được vượt quá 50 ký tự' }),
  email: z
    .string()
    .email({ message: 'Email không hợp lệ' }),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Mật khẩu phải chứa ít nhất một chữ hoa',
    })
    .refine((value) => /[a-z]/.test(value), {
      message: 'Mật khẩu phải chứa ít nhất một chữ thường',
    })
    .refine((value) => /[0-9]/.test(value), {
      message: 'Mật khẩu phải chứa ít nhất một số',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// Schema cho đăng nhập
export const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
});

// Schema cho quên mật khẩu
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
});

// Schema cho đặt lại mật khẩu
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Mật khẩu phải chứa ít nhất một chữ hoa',
    })
    .refine((value) => /[a-z]/.test(value), {
      message: 'Mật khẩu phải chứa ít nhất một chữ thường',
    })
    .refine((value) => /[0-9]/.test(value), {
      message: 'Mật khẩu phải chứa ít nhất một số',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});
