import { Invoice, StatusType } from "@/lib/types/invoice"

export class InvoiceService {
  private static instance: InvoiceService
  private constructor() {}

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService()
    }
    return InvoiceService.instance
  }

  async updateInvoiceStatus(invoice: Invoice, newStatus: StatusType): Promise<void> {
    // TODO: Call API to update invoice status
    console.log(`Updating invoice ${invoice.id} status to ${newStatus}`)
  }
} 