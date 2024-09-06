import { Module } from "@nestjs/common";
import { CloudinaryService } from "@/cloundinary/cloundinary.service";
import { CloudinaryProvider } from "@/cloundinary/cloudinary.provider";

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
