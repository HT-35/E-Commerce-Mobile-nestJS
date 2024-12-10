import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import {
  Bill,
  cartItem,
  itemBill,
  User,
} from "@/modules/user/schema/user.schema";
import mongoose, { Model } from "mongoose";

import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { hashPassWord } from "@/utils/bcrypt";
import { MailerService } from "@nestjs-modules/mailer";
import { ActiveAccount } from "@/auth/dto/activeAccount.dto";
import { NewPasswordDto } from "@/auth/dto/NewPasswordDto.dto";
import aqp from "api-query-params";
import { CreateEmployeeDto } from "@/modules/user/dto/CreateEmployeeDto";
import { Product } from "@/modules/product/schema/product-model.schema";
import { addressDto } from "@/modules/user/dto/address.dto";
import { updateAddressDto } from "@/modules/user/dto/updateAddress.dto";
import { CreateBillDto } from "@/modules/user/dto/create-bill.dto";
import axios from "axios";
import { ProductModelService } from "@/modules/product/product.service";

//const keyGHN = process.env.key_GHN;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private mailerServive: MailerService,
    private productServer: ProductModelService,
  ) {}

  sendCodeIdToEmail = async (result: any, IdCode: string) => {
    // send Email
    this.mailerServive.sendMail({
      to: result?.email,
      //from: 'noreply@nestjs.com',
      subject: "Mã Xác Thực Tài Khoản Tại HTS Store",
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
      throw new BadRequestException("Mã xác thực không đúng !");
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
      //await this.UserModel.syncIndexes();

      const result = await this.findOneByEmail(createUserDto.email);

      this.sendCodeIdToEmail(result, IdCode);

      return result;
    } catch (error) {
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
        numberPhone: createEmployeeDto.numberPhone,
        role: createEmployeeDto.role,
        //isActive: true,
      });

      // Đồng bộ hóa các chỉ mục của mô hình trong cơ sở dữ liệu
      //await this.UserModel.syncIndexes();

      const result = await this.findOneByEmail(createEmployeeDto.email);

      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
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
      const updateUser = await this.UserModel.updateOne(
        { _id: id },
        { ...updateUserDto },
      );

      //await this.UserModel.syncIndexes();
      return await updateUser;
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
        throw new BadRequestException("Mã xác thực không đúng !");
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

      return user.cart;
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

      const newCart: cartItem[] = [...user.cart]; // Clone the current cart
      const existingProductIndex = newCart.findIndex(
        (item) => item.slug === data.slug && item.color === data.color,
      );

      if (existingProductIndex > -1) {
        // Trường hợp sản phẩm đã tồn tại với cùng màu sắc
        newCart[existingProductIndex].quantity =
          Number(newCart[existingProductIndex].quantity) +
          Number(data.quantity);
      } else {
        // Trường hợp sản phẩm chưa tồn tại hoặc khác màu

        newCart.push({
          quantity: data.quantity,
          slug: data.slug,
          color: data.color,
        });
      }

      user.cart = newCart;
      await user.save();
      //await this.UserModel.syncIndexes();

      return await this.UserModel.findOne({ _id }).populate({
        path: "cart.slug", // Đi đến slug trong cart
        model: Product.name, // Model Product
        localField: "cart.slug", // Trường trong model User (cart.slug)
        foreignField: "slug", // Trường trong model Product
      });
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
    const newCart: cartItem[] = [...user.cart];
    if (user.cart.length === 0) {
      throw new BadRequestException("Nothing Product In Cart");
    }

    const findProduct = newCart.findIndex(
      (item) => item.slug === data.slug && item.color === data.color,
    );

    if (findProduct > -1) {
      const count =
        Number(newCart[findProduct].quantity) - Number(data.quantity) > 0
          ? Number(newCart[findProduct].quantity) - Number(data.quantity)
          : 1;

      newCart[findProduct].quantity = count;
    }
    try {
      user.cart = newCart;
      await user.save();
      //await this.UserModel.syncIndexes();
      return await this.UserModel.findOne({ _id }).populate({
        path: "cart.slug", // Đi đến slug trong cart
        model: Product.name, // Model Product
        localField: "cart.slug", // Trường trong model User (cart.slug)
        foreignField: "slug", // Trường trong model Product
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteProductQuanlityInCart({
    slug,
    color,
    _id,
  }: {
    slug: string;
    color: string;
    _id: mongoose.Types.ObjectId;
  }) {
    console.log(`slug:`, slug);

    const user = await this.findOne(_id);

    if (!user) {
      throw new BadRequestException("Not Found User !");
    }
    if (user.cart.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    const checkProduct = await user.cart.some((item) => {
      if (item.slug === slug && item.color === color) {
        return true;
      } else {
        return false;
      }
    });

    if (!checkProduct) {
      throw new BadRequestException("Not Found Product In Cart");
    }
    let newCart: cartItem[];
    user.cart.forEach(async (item, index) => {
      console.log("item.slug ", item.slug);
      console.log("slug", slug);
      console.log("");
      console.log("");
      console.log("item.color", item.color);
      console.log("color", color);
      if (item.slug === slug && item.color === color) {
        newCart = [...user.cart];
        delete newCart[index];

        user.cart = newCart;
        await user.save();
        await this.UserModel.syncIndexes();
      }
    });
    return await this.getAllProductInCart(_id);
  }

  // ===============  add  Address

  async addAddress({ address, _id }: { address: addressDto; _id: string }) {
    try {
      const user = await this.findOne(new mongoose.Types.ObjectId(_id));

      if (!user) {
        throw new BadRequestException("Không tìm thấy user!");
      }

      const checkDuplicate = await user.address.some(
        (item) => item.address_detail === address.address_detail,
      );

      if (checkDuplicate) {
        throw new BadRequestException("Địa chỉ giao hàng cụ thể đã tồn tại !");
      }
      console.log(checkDuplicate);

      user.address.push(address);
      const newUser = await user.save();
      //this.UserModel.syncIndexes();
      return newUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAddress({ _id }: { _id: string }) {
    const user = await this.findOne(new mongoose.Types.ObjectId(_id));

    if (!user) throw new BadRequestException("Not Found User !");

    return user.address;
  }

  async updateAddress({
    address,
    _id,
    addressId,
  }: {
    address: updateAddressDto;
    _id: string;
    addressId: string;
  }) {
    const user = await this.findOne(new mongoose.Types.ObjectId(_id));

    if (!user) throw new BadRequestException("Not Found User !");

    const checkDuplicate = user.address.some(
      (item) => item.address_detail === address.address_detail,
    );

    if (checkDuplicate) {
      throw new BadRequestException("Địa chỉ giao hàng cụ thể đã tồn tại !");
    }
    const updateCart = await this.UserModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(_id),
        "address._id": new mongoose.Types.ObjectId(addressId),
      },
      {
        $set: {
          "address.$.province_id": address.province_id,
          "address.$.district_id": address.district_id,
          "address.$.ward_code": address.ward_code,
          "address.$.address_detail": address.address_detail,
          "address.$.updatedAt": new Date(),
        },
      },
    );

    if (!updateCart) {
      throw new BadRequestException(updateCart);
    }

    console.log("");
    console.log("");
    console.log("");
    console.log(updateCart);
    console.log("");
    console.log("");
    //console.log("");

    return await this.findOne(new mongoose.Types.ObjectId(_id));
  }

  async deleteAddress({ _id, addressId }: { _id: string; addressId: string }) {
    const user = await this.findOne(new mongoose.Types.ObjectId(_id));

    if (!user) throw new BadRequestException("Not Found User");

    const findIndexAddress = user.address.findIndex((item: any) => {
      return item._id.toString() === addressId;
    });

    if (findIndexAddress === -1) {
      throw new BadRequestException("Not Found Address");
    }

    user.address.splice(findIndexAddress, 1);

    const newUser = user.save();

    return newUser;
  }

  async createBill({
    _id,
    createBillDto,
  }: {
    _id: string;
    createBillDto: CreateBillDto;
  }) {
    try {
      const user = await this.findOne(new mongoose.Types.ObjectId(_id));
      if (!user) {
        throw new BadRequestException("Not Found User !");
      }

      const itemBill: itemBill[] = await Promise.all(
        createBillDto.item.map(async (item) => {
          const product = await this.productServer.findOne(item.slug);
          if (!product) {
            throw new BadRequestException("Not Found Product");
          }
          const indexOption = await product.option.findIndex(
            (item) => item.color === item.color,
          );
          if (indexOption === -1) {
            throw new BadRequestException("Not Found Color Product");
          }
          const price = await product.option[indexOption].price;
          const calc = Number(price) * Number(item.quantity);

          return {
            price,
            slug: item.slug,
            color: item.color,
            name: product.name,
            brand: product.brand,
            calcPrice: calc,
            quantity: item.quantity,
          };
        }),
      );

      const indexAddressShiping = user.address.findIndex(
        (item) => item.address_detail === createBillDto.addressShiping,
      );
      if (indexAddressShiping === -1) {
        throw new BadRequestException("Không tìm thấy địa chỉ giao hàng");
      }

      const total = itemBill.reduce((a, b) => {
        return Number(a) + Number(b.calcPrice);
      }, 0);

      const newBill: Bill = {
        itemArr: itemBill,
        email: createBillDto.email,
        paymentMethod: "VNPAY",
        orderer: user.name,
        numberPhone: createBillDto.numberPhone,
        statusShiping: "waiting for payment",
        statusPayment: "unpaid",
        CodeShipGHN: "",
        total,
        addressShiping: user.address[indexAddressShiping].address_detail,
      };

      user.Bill.push(newBill);
      const newUser = await user.save();

      const newBillRecord = newUser.Bill[newUser.Bill.length - 1];

      return newBillRecord;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateBill({ _id, idBill }: { _id: string; idBill: string }) {
    try {
      const user = await this.findOne(new mongoose.Types.ObjectId(_id));
      if (!user) {
        throw new BadRequestException("Not Found User !");
      }
      //console.log(`user:`, user);

      const indexBill = user.Bill.findIndex(
        (item: any) => item._id.toString() === idBill,
      );
      console.log(`indexBill:`, indexBill);

      const contentOrderShiping = user.Bill[indexBill].itemArr.map((item) => {
        return {
          name: `${item.name}`,
          code: `${item.brand}`,
          quantity: Number(item.quantity),
          price: +item.price,
          length: 16,
          width: 7,
          height: 1,
          weight: 50,
          category: {
            level1: `${item.name}`,
          },
        };
      });

      //const indexAddressShiping = user.Bill[indexBill].addressShiping;

      const indexAddressShiping = user.address.findIndex(
        (item) => item.address_detail === user.Bill[indexBill].addressShiping,
      );
      if (indexAddressShiping === -1) {
        throw new BadRequestException("Không tìm thấy địa chỉ giao hàng");
      }

      //// tạo đợn hàng GHN
      const orderData = {
        payment_type_id: 1,
        note: "Gọi điện trước khi giao hàng",
        required_note: "CHOTHUHANG",
        from_name: "Huy Trần",
        from_phone: "0343128733",
        from_address:
          "tạp hóa quỳnh trang, tổ 38, khu phố vườn dừa, phường phước tân, thành phố biên hòa, tỉnh đồng nai",
        from_ward_name: "Xã Phước Tân",
        from_district_name: "Thành phố Biên Hòa",
        from_province_name: "Đồng Nai",
        return_phone: "0343128733",
        return_address:
          "tạp hóa quỳnh trang, tổ 38, khu phố vườn dừa, phường phước tân, thành phố biên hòa, tỉnh đồng nai",
        return_district_id: 1536,
        return_ward_code: "480128",
        client_order_code: "",

        to_name: `${user.name}`,
        to_phone: `${user.Bill[indexBill].numberPhone}`,
        to_address: `${user.address[indexAddressShiping].address_detail}`,
        to_ward_code: `${user.address[indexAddressShiping].ward_code}`,
        to_district_id: Number(user.address[indexAddressShiping].district_id),
        cod_amount: 0,
        content: "Test chức năng giao hàng của website bán điện thoại",
        weight: 50,
        length: 16,
        width: 7,
        height: 1,
        pick_station_id: 10,
        deliver_station_id: null,
        insurance_value: 5000000,
        service_id: 0,
        service_type_id: 2,
        coupon: null,
        pick_shift: [2],
        items: [...contentOrderShiping],
      };

      console.log("");
      console.log("");
      console.log("");
      console.log("orderData   :  ", orderData);
      console.log("");
      console.log("");

      const createShippingGHN = await axios.post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Token: `0e987591-4e75-11ef-8e53-0a00184fe694`,
          },
        },
      );

      user.Bill[indexBill].statusShiping = "pending";
      user.Bill[indexBill].statusPayment = "paid";
      user.Bill[indexBill].CodeShipGHN =
        await createShippingGHN.data.data.order_code;

      console.log("");
      console.log("");
      console.log("await createShippingGHN :  ", await createShippingGHN);
      console.log("");
      console.log("");
      console.log("");

      const newUser = await user.save();

      const newBillRecord = newUser.Bill[newUser.Bill.length - 1];

      return newBillRecord;
    } catch (error) {
      console.log(`error:`, error);
      throw new BadRequestException(error.message);
    }
  }

  async getAllBill({ page = 1, limit = 10 }: { page: number; limit: number }) {
    try {
      //// Tham số page và limit, nhận từ request hoặc mặc định
      //const page = parseInt(page as string) || 1; // Trang hiện tại (mặc định là 1)
      //const limit = parseInt(limit as string) || 10; // Số lượng phần tử mỗi trang (mặc định là 10)

      // Lấy tất cả dữ liệu từ UserModel
      const getAllBill = await this.UserModel.find();

      const billAll = getAllBill
        ?.map((item) => item.Bill)
        ?.filter((item: any) => item.length > 0);

      const mergedArray = billAll
        ?.flat()
        ?.filter((item) => item.itemArr.length > 0)
        ?.sort((a: any, b: any) => {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

      // Tính toán phân trang
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // Lấy dữ liệu trang hiện tại
      const paginatedData = mergedArray.slice(startIndex, endIndex);

      // Tổng số trang
      const totalPages = Math.ceil(mergedArray.length / limit);

      // Kết quả trả về
      const result = {
        currentPage: page,
        totalPages,
        totalItems: mergedArray.length,
        pageSize: limit,
        data: paginatedData,
      };

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createBillCOD({
    _id,
    createBillDto,
  }: {
    _id: string;
    createBillDto: CreateBillDto;
  }) {
    try {
      const user = await this.findOne(new mongoose.Types.ObjectId(_id));
      //console.log(`user:`, user);
      if (!user) {
        throw new BadRequestException("Not Found User !");
      }

      const itemBill: itemBill[] = await Promise.all(
        createBillDto.item.map(async (item) => {
          const product = await this.productServer.findOne(item.slug);
          if (!product) {
            throw new BadRequestException("Not Found Product");
          }
          const indexOption = await product.option.findIndex(
            (item) => item.color === item.color,
          );
          if (indexOption === -1) {
            throw new BadRequestException("Not Found Color Product");
          }
          const price = await product.option[indexOption].price;
          const calc = Number(price) * Number(item.quantity);

          return {
            price,
            slug: item.slug,
            color: item.color,
            name: product.name,
            brand: product.brand,
            calcPrice: calc,
            quantity: item.quantity,
          };
        }),
      );

      const total = itemBill.reduce((a, b) => {
        return Number(a) + Number(b.calcPrice);
      }, 0);

      const contentOrderShiping = itemBill.map((item) => {
        return {
          name: `${item.name}`,
          code: `${item.brand}`,
          quantity: Number(item.quantity),
          price: +item.price,
          length: 16,
          width: 7,
          height: 1,
          weight: 50,
          category: {
            level1: `${item.name}`,
          },
        };
      });

      const indexAddressShiping = user.address.findIndex(
        (item) => item.address_detail === createBillDto.addressShiping,
      );
      if (indexAddressShiping === -1) {
        throw new BadRequestException("Không tìm thấy địa chỉ giao hàng");
      }

      // tạo đợn hàng GHN
      const orderData = {
        payment_type_id: 1,
        note: "Gọi điện trước khi giao hàng",
        required_note: "CHOTHUHANG",
        from_name: "Huy Trần",
        from_phone: "0343128733",
        from_address:
          "tạp hóa quỳnh trang, tổ 38, khu phố vườn dừa, phường phước tân, thành phố biên hòa, tỉnh đồng nai",
        from_ward_name: "Xã Phước Tân",
        from_district_name: "Thành phố Biên Hòa",
        from_province_name: "Đồng Nai",
        return_phone: "0343128733",
        return_address:
          "tạp hóa quỳnh trang, tổ 38, khu phố vườn dừa, phường phước tân, thành phố biên hòa, tỉnh đồng nai",
        return_district_id: 1536,
        return_ward_code: "480128",
        client_order_code: "",

        to_name: `${user.name}`,
        to_phone: `${createBillDto.numberPhone}`,
        to_address: `${user.address[indexAddressShiping].address_detail}`,
        to_ward_code: `${user.address[indexAddressShiping].ward_code}`,
        to_district_id: Number(user.address[indexAddressShiping].district_id),
        cod_amount: total,
        content: "Test chức năng giao hàng của website bán điện thoại",
        weight: 50,
        length: 16,
        width: 7,
        height: 1,
        pick_station_id: 10,
        deliver_station_id: null,
        insurance_value: 5000000,
        service_id: 0,
        service_type_id: 2,
        coupon: null,
        pick_shift: [2],
        items: [...contentOrderShiping],
      };

      const createShippingGHN = await axios.post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Token: `0e987591-4e75-11ef-8e53-0a00184fe694`,
          },
        },
      );
      //console.log(createShippingGHN.data.data.order_code);

      const newBill: Bill = {
        itemArr: itemBill,
        email: createBillDto.email,
        numberPhone: createBillDto.numberPhone,
        orderer: user.name,
        paymentMethod: "COD",
        statusPayment: "unpaid",
        statusShiping: "pending",
        CodeShipGHN: await createShippingGHN.data.data.order_code,
        total,
        addressShiping: createBillDto.addressShiping,
      };
      console.log("");
      console.log("");
      console.log("");
      console.log("newBill", newBill);
      console.log("");
      console.log("");

      user.Bill.push(newBill);
      const newUser = await user.save();

      const newBillRecord = newUser.Bill[newUser.Bill.length - 1];

      return newBillRecord;
    } catch (error) {
      console.log(`error:`, error);
      throw new BadRequestException(error.message);
    }
  }

  async getDetalBill({ idOrder, _id }: { idOrder: string; _id: string }) {
    try {
      const user = await this.findOne(new mongoose.Types.ObjectId(_id));
      if (!user) {
        throw new BadRequestException("Not Found User !");
      }

      const indexBill = user.Bill.findIndex(
        (item: any) => item._id.toString() === idOrder.toString(),
      );
      return user.Bill[indexBill];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
