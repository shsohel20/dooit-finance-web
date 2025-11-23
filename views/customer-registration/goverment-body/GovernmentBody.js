import { Controller, Control, FieldErrors } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'



export function GovernmentBodySection({ control, errors }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Government Body</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="govt_body_type">Government Body Type</Label>
          <Controller
            name="kyc.government_body.government_body_type"
            control={control}
            render={({ field }) => (
              <Input
                id="govt_body_type"
                placeholder="Enter government body type"
                {...field}
                error={errors?.kyc?.government_body?.government_body_type?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="govt_name">Government Name</Label>
          <Controller
            name="kyc.government_body.government_name"
            control={control}
            render={({ field }) => (
              <Input
                id="govt_name"
                placeholder="Enter government name"
                {...field}
                error={errors?.kyc?.government_body?.government_name?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legislation_name">Legislation Name</Label>
          <Controller
            name="kyc.government_body.legislation_name"
            control={control}
            render={({ field }) => (
              <Input
                id="legislation_name"
                placeholder="Enter legislation name"
                {...field}
                error={errors?.kyc?.government_body?.legislation_name?.message}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
