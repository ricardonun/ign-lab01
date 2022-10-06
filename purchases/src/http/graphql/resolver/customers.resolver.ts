import { UseGuards } from '@nestjs/common';
import {
  Parent,
  Query,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { AuthorizationGuard } from '../../../http/auth/authorization.guard';
import { CustomerService } from '../../../services/customer.service';
import { PurchasesService } from '../../../services/purchases.service';
import { CurrentUser, IAuthUser } from '../../auth/currtent-user';
import { Customer } from '../models/customer';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(
    private customerService: CustomerService,
    private purchaseService: PurchasesService,
  ) {}

  @Query(() => Customer)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: IAuthUser) {
    return this.customerService.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField()
  purchases(@Parent() customer: Customer) {
    console.log(customer);

    return this.purchaseService.listAllPurchaesFromCurstomer(customer.id);
  }

  @ResolveReference()
  resolveReferences(reference: { authUserId: string }) {
    return this.customerService.getCustomerByAuthUserId(reference.authUserId);
  }
}
