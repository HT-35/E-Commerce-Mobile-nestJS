import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "@/core/transform.interceptor";
import { JwtAuthGuard } from "@/auth/passport/verify token/jwt-auth.guard";
import { RolesGuard } from "@/roles/roles.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector); //config use guard local
  const configService = app.get(ConfigService);
  const PORT = configService.get("PORT");

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "*",
  });

  // config pipe global
  app.useGlobalPipes(
    new ValidationPipe({
      // bỏ đi các field thừa không có trong dto khi người dùng gửi lên
      whitelist: true,
    }),
  );

  // config jwt-auth guard glogbal
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // guard check role
  app.useGlobalGuards(new RolesGuard(reflector));

  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  //app.useGlobalFilters(new AllExceptionsFilter(reflector));

  await app.listen(PORT);
}
bootstrap();
