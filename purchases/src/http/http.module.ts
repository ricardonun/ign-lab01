import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from '../database/database.module';
import path from 'node:path';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

import { ProductsResolver } from './graphql/resolver/products.resolver';
import { ProductsService } from '../services/products.service';
import { PurchasesResolver } from './graphql/resolver/purchases.resolver';
import { PurchasesService } from '../services/purchases.service';
import { CustomerService } from '../services/customer.service';
import { CustomersResolver } from './graphql/resolver/customers.resolver';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MessagingModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    // Resolvers
    ProductsResolver,
    PurchasesResolver,
    CustomersResolver,

    //Service
    ProductsService,
    PurchasesService,
    CustomerService,
  ],
})
export class HttpModule {}
