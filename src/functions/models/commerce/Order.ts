import { Doc, Model, Field, File, firestore, CollectionReference, DocumentReference, Timestamp, Codable } from '@1amageek/ballcap-admin'
import { Currency } from '../../common/Currency'
import { OrderItemType, OrderItemStatus, DeliveryStatus, OrderPaymentStatus, Discount } from '../../common/commerce/Types'
import Shipping from './Shipping'

export class OrderItem extends Model {
	@Field type: OrderItemType = 'sku'
	@Field productReference?: DocumentReference
	@Field skuReference?: DocumentReference
	@Field quantity: number = 1
	@Field currency: Currency = 'USD'
	@Field amount: number = 0
	@Field discount: Discount | null = null
	@Field taxRate: number = 0
	@Field status: OrderItemStatus = 'none'
	@Field category: string = ''
	@Field name: string = ''
	@Field caption: string = ''
	@Field metadata?: any
}

export default class Order extends Doc {
	@Field parentID?: string
	@Field type?: string
	@Field title?: string
	@Field image?: string
	@Field assets: File[] = []
	@Field purchasedBy!: string
	@Field selledBy!: string
	@Field shipping?: Shipping
	@Field transferredTo: DocumentReference[] = []
	@Field paidAt?: Timestamp
	@Field expirationDate?: Timestamp
	@Field shippingDate?: any
	@Field estimatedArrivalDate?: any
	@Field currency: Currency = 'USD'
	@Field amount: number = 0
	@Codable(OrderItem)
	@Field items: OrderItem[] = []
	@Field deliveryStatus: DeliveryStatus = 'none'
	@Field paymentStatus: OrderPaymentStatus = 'none'
	@Field isCancelled: boolean = false
	@Field metadata?: any
}
