import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { availableParallelism } from "os";
import { ExtractJwt, Strategy } from "passport-jwt";

interface Currency {
    id: string;
    symbol: string;
    name: string;
}

interface AuthPayload {
    sub: string;
    name: string | null;
    lastName: string | null;
    email: string;
    baseCurrency: Currency,
    role: string,
}

export interface RequestDto {
    user: AuthPayload;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET no está definido en las variables de entorno.')  
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    validate(payload: AuthPayload) {
        const user = payload;

        return user;
    }
}