import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { log } from 'node:console';
import { AuthorizationGuard } from '../../../http/auth/authorization.guard';
import { CustomerService } from '../../../services/customer.service';
import { ProductsService } from '../../../services/products.service';
import { PurchasesService } from '../../../services/purchases.service';
import { CurrentUser, IAuthUser } from '../../auth/currtent-user';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { Product } from '../models/product';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private purchaesService: PurchasesService,
    private productService: ProductsService,
    private customerService: CustomerService,
  ) {}

  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  purchases() {
    return this.purchaesService.listAllPurchaes();
  }

  @ResolveField()
  product(@Parent() purchase: Purchase) {
    return this.productService.getProductById(purchase.productId);
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: IAuthUser,
  ) {
    let customer = await this.customerService.getCustomerByAuthUserId(user.sub);

    if (!customer) {
      customer = await this.customerService.createCustomer({
        authUserId: user.sub,
      });
    }

    return this.purchaesService.createPurchase({
      customerId: customer.id,
      productId: data.productId,
    });
  }
}
