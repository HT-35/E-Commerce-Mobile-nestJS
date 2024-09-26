import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { cartItem, User } from "@/modules/user/schema/user.schema";
import mongoose, { Model } from "mongoose";

import { v4 as uuidv4 } from "uuid";
import * as dayjs from "dayjs";
import { hashPassWord } from "@/utils/bcrypt";
import { MailerService } from "@nestjs-modules/mailer";
import { ActiveAccount } from "@/auth/dto/activeAccount.dto";
import { NewPasswordDto } from "@/auth/dto/NewPasswordDto.dto";
import aqp from "api-query-params";
import { CreateEmployeeDto } from "@/modules/user/dto/CreateEmployeeDto";
import { Product } from "@/modules/product/schema/product-model.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private mailerServive: MailerService,
  ) {}

  sendCodeIdToEmail = async (result: any, IdCode: string) => {
    // send Email
    this.mailerServive.sendMail({
      to: result?.email,
      //from: 'noreply@nestjs.com',
      subject: "Email test send email with NestJS",
      text: "welcome", // plaintext body

      template: "./register",
      context: {
        name: result?.name ?? result?.email,
        activationCode: IdCode,
      },
    });
  };

  handleActiveAccount = async (user: any, dataClient: any) => {
    if (user.codeId === dataClient.codeId) {
      if (dayjs().isBefore(user.codeExpired)) {
        // Trường hợp: Quên mật khẩu (Forget Password)
        if (dataClient.password) {
          const hashPassword = await hashPassWord(dataClient.password);

          await this.UserModel.updateOne(
            {
              _id: dataClient.id,
              codeId: dataClient.codeId,
            },
            {
              codeId: "",
              isActive: true,
              password: hashPassword,
              codeExpired: dayjs(),
            },
          );
          return {
            user: "active successful",
          };
        } else {
          // Trường hợp: Kích hoạt tài khoản (Active Account)
          await this.UserModel.updateOne(
            {
              _id: dataClient.id,
              codeId: dataClient.codeId,
            },
            {
              codeId: "",
              isActive: true,
              codeExpired: dayjs(),
            },
          );
          return {
            user: "active successful",
          };
        }
      } else {
        // Nếu code đã hết hạn
        throw new BadRequestException("CodeId đã hết hạn !!");
      }
    } else {
      // Nếu codeId không đúng
      throw new BadRequestException("CodeId không đúng !!");
    }
  };

  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException("email đã tồn tại !!");
    }

    // Tạo một UUID để làm mã kích hoạt người dùng
    const IdCode = uuidv4();

    // Thiết lập thời gian hết hạn của mã kích hoạt là 5 phút
    const date = dayjs().add(5, "minute");

    const hasPassWord = await hashPassWord(createUserDto.password);

    try {
      await this.UserModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hasPassWord,
        address: createUserDto.address,
        phone: createUserDto.phone,
        codeId: IdCode,
        codeExpired: date,
      });

      // Đồng bộ hóa các chỉ mục của mô hình trong cơ sở dữ liệu
      await this.UserModel.syncIndexes();

      const result = await this.findOneByEmail(createUserDto.email);

      this.sendCodeIdToEmail(result, IdCode);

      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${error.keyValue.email} đã tồn tại`);
      }
      throw new BadRequestException(error);
    }

    //return 'This action adds a new user';
  }

  // đk tài khoản nhân viên hoặc admin
  async registerEmployee(createEmployeeDto: CreateEmployeeDto) {
    const existingUser = await this.findOneByEmail(createEmployeeDto.email);

    if (existingUser) {
      throw new BadRequestException("email đã tồn tại !!");
    }

    try {
      await this.UserModel.create({
        name: createEmployeeDto.name,
        email: createEmployeeDto.email,
        password: 1111, // defaul password
        address: createEmployeeDto.address,
        phone: createEmployeeDto.phone,
        roles: createEmployeeDto.roles,
        //isActive: true,
      });

      // Đồng bộ hóa các chỉ mục của mô hình trong cơ sở dữ liệu
      await this.UserModel.syncIndexes();

      const result = await this.findOneByEmail(createEmployeeDto.email);

      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${error.keyValue.email} đã tồn tại`);
      }
      throw new BadRequestException(error);
    }

    //return 'This action adds a new user';
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    // đếm tổng số lượng bản ghi vd có 10 bản ghi
    const totalItem = (await this.UserModel.find(filter)).length;

    // tính tổng số trang : ví dụ 1 trang có 2 bản ghi thì : 10/2 = 5 trang
    const totalPages = Math.ceil(totalItem / pageSize);

    // ví dự trang 1 thì sẽ bỏ qua 0 bản ghi, trang 2 thì sẽ bỏ qua : (2-1) * 10 =10, vậy là bỏ qua từ bản ghi 1 -> bản ghi 10
    const skip = (current - 1) * pageSize;

    const result = await this.UserModel.find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password -createdAt -updatedAt") // loại bỏ trường password
      .sort(sort as any);

    return { result, totalPages };
  }

  async findOneByEmail(email: string) {
    return await this.UserModel.findOne({
      email,
    }).select("-password  -codeId -codeExpired -createdAt -updatedAt -cart  ");
  }
  async searchUserByName(name: string) {
    const regex = new RegExp(name, "i");
    return await this.UserModel.find({
      name: regex,
    }).select("-password  -codeId -codeExpired -createdAt -updatedAt -cart  ");
  }

  async findOne(_id: mongoose.Types.ObjectId) {
    try {
      return this.UserModel.findOne({
        _id,
      }).select("-password  -codeId -codeExpired -createdAt -updatedAt  ");
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: mongoose.Types.ObjectId, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new BadRequestException("Not Found User");
    }

    try {
      await this.UserModel.updateOne({ _id: id }, { ...updateUserDto });

      await this.UserModel.syncIndexes();
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(_id: string) {
    const user = await this.UserModel.findById(_id).select(
      "-password  -codeId -codeExpired -createdAt -updatedAt  -isActive -isAdmin ",
    );
    if (!user) {
      throw new BadRequestException("not found user !!");
    }

    await this.UserModel.deleteOne({ _id });

    return {
      delete_successfull: user,
    };
  }

  async activeAccount(data: ActiveAccount) {
    const user = await this.UserModel.findOne({
      _id: data.id,
      codeId: data.codeId,
    });

    if (!user) {
      throw new UnauthorizedException("Not Found User !!");
    }

    try {
      if (user.codeId === data.codeId) {
        if (dayjs().isBefore(user.codeExpired)) {
          await this.UserModel.updateOne(
            {
              _id: data.id,
              codeId: data.codeId,
            },
            {
              codeId: "",
              isActive: true,
              codeExpired: dayjs(),
            },
          );
          return {
            user: "active successfull",
          };
        } else {
          throw new BadRequestException("CodeId đã hết hạn !!");

          //return {
          //  user: 'CodeId đã hết hạn !!',
          //};
        }
      } else {
        throw new BadRequestException("CodeId không đúng !!");
      }

      //await this.handleActiveAccount(user, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
    //return user;
  }

  async ReSendCodeId(email: any) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Not Found User !!");
    }
    // Tạo một UUID để làm mã kích hoạt người dùng
    const IdCode = uuidv4();

    // Thiết lập thời gian hết hạn của mã kích hoạt là 5 phút
    const date = dayjs().add(5, "minute");

    try {
      this.sendCodeIdToEmail(user, IdCode);

      await this.UserModel.updateOne(
        {
          email,
        },
        {
          codeId: IdCode,
          codeExpired: date,
        },
      );

      return {
        id: user._id,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async resetPassword(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Not Found User !!");
    }

    // Tạo một UUID để làm mã kích hoạt người dùng
    const codeId = uuidv4();

    // Thiết lập thời gian hết hạn của mã kích hoạt là 5 phút
    const date = dayjs().add(5, "minute");

    try {
      this.sendCodeIdToEmail(user, codeId);

      await this.UserModel.updateOne(
        {
          email,
        },
        {
          codeId,
          codeExpired: date,
        },
      );
      return {
        user: {
          id: user._id,
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async NewPassword(data: NewPasswordDto) {
    const user = await this.UserModel.findOne({
      _id: data.id,
    });

    if (!user) {
      throw new BadRequestException("Not Found User !!");
    }

    try {
      await this.handleActiveAccount(user, data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException(
          "An error occurred while processing the request.",
        );
      }
    }
  }

  //   =========    Cart

  async getAllProductInCart(_id: mongoose.Types.ObjectId) {
    try {
      console.log(`_id:`, _id);
      //const user = await this.findOne(_id);

      const user = await this.UserModel.findOne({ _id }).populate({
        path: "cart.slug", // Đi đến slug trong cart
        model: Product.name, // Model Product
        localField: "cart.slug", // Trường trong model User (cart.slug)
        foreignField: "slug", // Trường trong model Product
      });

      if (!user) {
        throw new BadGatewayException("Not Found User !");
      }

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addProductInCart(data: cartItem, _id: mongoose.Types.ObjectId) {
    try {
      const user = await this.findOne(_id);
      if (!user) {
        throw new BadGatewayException("Not Found User !");
      }
      let newCart: cartItem[];
      if (user.cart.length === 0) {
        newCart = [{ quatity: data.quatity, slug: data.slug }];
      } else {
        const checkProduct = user.cart.some((item) => {
          if (item.slug === data.slug) {
            console.log(`item:`, item);
            return true;
          } else {
            return false;
          }
        });
        if (checkProduct) {
          user.cart.forEach((item, index) => {
            if (item.slug === data.slug) {
              newCart = [
                ...user.cart,
                {
                  quatity: Number(Number(data.quatity) + Number(item.quatity)),
                  slug: data.slug,
                },
              ];
              delete newCart[index];
              //console.log(`newCart:`, newCart);
            }
          });
        } else {
          newCart = [...user.cart, { quatity: data.quatity, slug: data.slug }];
        }
        console.log(`checkProduct:`, checkProduct);
      }

      //console.log(`newCart:`, newCart);

      user.cart = newCart;
      const saveCart = await user.save();
      await this.UserModel.syncIndexes();
      return saveCart;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async reduceProductQuanlityInCart(
    data: cartItem,
    _id: mongoose.Types.ObjectId,
  ) {
    const user = await this.findOne(_id);
    if (!user) {
      throw new BadGatewayException("Not Found User !");
    }
    let newCart: cartItem[];
    if (user.cart.length === 0) {
      throw new BadRequestException("Nothing Product In Cart");
    }

    user.cart.forEach((item, index) => {
      if (item.slug === data.slug) {
        console.log(`item:`, item.quatity);
        console.log(`data:`, data.quatity);
        if (item.quatity === 1) {
          throw new BadRequestException("Quanlity Product Min : 1");
        }

        newCart = [
          ...user.cart,
          {
            quatity: Number(Number(item.quatity) - Number(data.quatity)),
            slug: data.slug,
          },
        ];
        delete newCart[index];
      }
    });
    try {
      user.cart = newCart;
      const saveCart = await user.save();
      await this.UserModel.syncIndexes();
      return saveCart;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteProductQuanlityInCart(
    slug: string,
    _id: mongoose.Types.ObjectId,
  ) {
    console.log(`slug:`, slug);
    try {
      const user = await this.findOne(_id);

      if (!user) {
        throw new BadRequestException("Not Found User !");
      }

      let newCart: cartItem[];
      user.cart.forEach((item, index) => {
        if (item.slug === slug) {
          newCart = [...user.cart];
          delete newCart[index];
        }
      });

      user.cart = newCart;
      await user.save();
      await this.UserModel.syncIndexes();

      return await this.getAllProductInCart(_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
