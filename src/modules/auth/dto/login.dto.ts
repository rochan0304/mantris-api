import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Formato de correo inválido.' })
    email: string;

    @IsNotEmpty()
    @MinLength(8, {message: 'Contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(72, { message: 'La contraseña es demasiado larga.'})
    password: string;
}
