import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/google')
    async googleAuth(@Body() body: { idToken: string }) {
        return this.authService.googleAuth(body.idToken);
    }
}