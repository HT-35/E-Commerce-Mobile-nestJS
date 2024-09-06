import { ConfigService } from "@nestjs/config";
import { CLOUDINARY } from "@/utils/constants";
import { ConfigOptions, v2 } from "cloudinary";

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService): ConfigOptions => {
    return v2.config({
      cloud_name: "huysa",
      api_key: "714563965946811",
      api_secret: "DTjA7A2t4W7EcKHVuTgKNJ7kPk0",

      //cloud_name: configService.get('CLOUD_NAME'),
      //api_key: configService.get('API_KEY'),
      //api_secret: configService.get('API_SECRET'),
    });
  },
};
