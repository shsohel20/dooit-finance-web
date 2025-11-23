import { MapPin, Mail, Building2, DollarSign, FileText, CheckCircle, AlertCircle } from 'lucide-react'



export default function TransactionDetail({
  senderName,
  senderTitle,
  senderAddress,
  senderEmail,
  recipientName,
  recipientAccount,
  recipientBranch,
  recipientSwift,
  purpose,
  paymentMethod,
  notes,
  amount,
}) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mt-8">
      {/* Header with Amount */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border px-8 py-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Transaction Amount</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">${amount.toLocaleString()}</span>
              <span className="text-muted-foreground">USD</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Verified</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Sender and Recipient Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Sender Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Sender Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-foreground">{senderName}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">{senderTitle}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-foreground">{senderAddress}</p>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{senderEmail}</p>
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Recipient Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-foreground">{recipientName}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account:</span>
                  <span className="font-mono text-foreground">{recipientAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Branch:</span>
                  <span className="text-foreground">{recipientBranch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SWIFT:</span>
                  <span className="font-mono text-foreground">{recipientSwift}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Transaction Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Transaction Purpose
            </h4>
            <p className="text-foreground font-medium">{purpose}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Payment Method
            </h4>
            <p className="text-foreground font-medium">{paymentMethod}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Additional Notes */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Additional Notes
          </h4>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-foreground leading-relaxed">{notes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
