import { UserRepository } from "src/infrastructure/repository/user.repo";
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtHelperService } from "src/infrastructure/services/jwtservice";
import admin from "src/infrastructure/firebase/firebase-admin.config";
import { MailService } from "src/infrastructure/mail/mail";
import { welcomeEmailTemplate } from "src/infrastructure/mail/template/template";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly jwtService: JwtHelperService,
        private readonly mailService: MailService
    ) { }

    async googleAuth(idToken: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { email, name, uid: googleUid, picture } = decodedToken;

            if (!email) {
                throw new BadRequestException("Email not found in Google account");
            }

            let users = await this.userRepo.findByEmail(email);
            let user;

            if (!users) {
                const newUser = await this.userRepo.register({
                    email,
                    name: name || "Google User",
                    image: picture
                });
                user = newUser;
            } else {
                user = users;
            }

            const token = await this.jwtService.generateJwtToken(user);

            //welcome mail send
            const emailContent = welcomeEmailTemplate(user.name);

            await this.mailService.sendMail({
                message: emailContent,
                subject: `Welcome to the platform, ${user.name}!`,
                to: user.email
            });

            return {
                message: "Google Auth Success",
                access_token: token,
                user: {
                    name: user.name,
                    email: user.email,
                    uid: user.uuid,
                    image: user.image
                }
            };

        } catch (error) {
            console.error("Google Auth Error:", error);
            throw new BadRequestException("Invalid Google token");
        }
    }
}
