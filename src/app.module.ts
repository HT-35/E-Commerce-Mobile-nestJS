import { ProductModule } from "./modules/product/product.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "@/modules/user/user.module";
import { AuthModule } from "./auth/auth.module";
import { MailerModule } from "@nestjs-modules/mailer";

import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { FileModule } from "./modules/file/file.module";
import { CloudinaryModule } from "@/cloundinary/cloundinary.module";

@Module({
  imports: [
    //========   Config   mongodb    global  ===================================================
    ConfigModule.forRoot({
      envFilePath: ".development.env",
      isGlobal: true,
    }),
    //========   Config   mongodb    global  ===================================================
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),

    // ========   mail    ===================================================

    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // sử dụng SSL
          auth: {
            user: configService.get<string>("MAILDEV_USER"), // Địa chỉ email của bạn
            pass: configService.get<string>("MAILDEV_PASS"), // Mật khẩu ứng dụng (nếu sử dụng xác thực 2 bước)
          },
        },
        defaults: {
          from: '"No Reply !! i am software engineering" <no-reply@localhost>',
        },
        //preview: true,
        template: {
          dir: process.cwd() + "/src/mail/templates",
          //dir: join(__dirname, '/mail/templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    // ========   module    ===================================================
    UserModule,
    AuthModule,
    ProductModule,
    FileModule,

    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
